import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { Quiz, Difficulty, AIProvider } from "@/types";

// Determine which provider to use based on available keys and preferred config
export function getActiveProvider(): AIProvider {
  const preferred = process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER as AIProvider | undefined;
  
  if (preferred === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (preferred === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (preferred === "openrouter" && process.env.OPENROUTER_API_KEY) return "openrouter";
  
  // Fallbacks
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  
  throw new Error("No AI provider API key found. Please set GEMINI_API_KEY, OPENAI_API_KEY, or OPENROUTER_API_KEY in your environment.");
}

function buildPrompt(topic: string, difficulty: Difficulty): string {
  let difficultyDesc = "";
  if (difficulty === "beginner") {
    difficultyDesc = "Easy vocabulary, basic grammar, greetings, simple verbs in present tense. Questions can be in English asking for Spanish equivalents, or very simple Spanish.";
  } else if (difficulty === "intermediate") {
    difficultyDesc = "Moderate grammar, past tenses, mixed vocabulary, sentence comprehension. Questions should be mostly in Spanish with medium complexity.";
  } else {
    difficultyDesc = "Complex grammar (subjunctive, conditional), reading comprehension, advanced vocabulary, idioms. Questions and options must be entirely in Spanish and intellectually challenging.";
  }

  return `Generate a Spanish learning quiz.

Topic: ${topic}
Difficulty: ${difficulty} (${difficultyDesc})

Requirements:
1. Generate between 5 to 7 multiple-choice questions.
2. Four options per question.
3. Exactly one correct answer.
4. The correct answer MUST be an exact string match with one of the four options.
5. Questions must strictly match the selected difficulty level.
6. The output must be valid JSON only. Do not include markdown wraps (like \`\`\`json ... \`\`\`), do not include explanations, and do not prefix or suffix the response.

JSON Response Format:
{
  "title": "A short engaging title for this quiz",
  "questions": [
    {
      "question": "The question text?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": "Option B"
    }
  ]
}`;
}

// Clean raw text to ensure it is valid JSON
function parseQuizJSON(rawText: string): Quiz {
  let cleanText = rawText.trim();
  
  // Strip markdown code block if LLM returned it anyway
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(json)?/, "").replace(/```$/, "").trim();
  }
  
  try {
    const data = JSON.parse(cleanText) as Quiz;
    if (!data.title || !Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error("Invalid structure: missing title or questions");
    }
    
    // Validate each question structure
    data.questions = data.questions.map((q) => {
      const options = Array.isArray(q.options) ? q.options.map(o => String(o).trim()) : [];
      const question = String(q.question || "").trim();
      let correctAnswer = String(q.correctAnswer || "").trim();
      
      // Safety: make sure options has exactly 4 elements
      while (options.length < 4) {
        options.push("Option Placeholder");
      }
      if (options.length > 4) {
        options.splice(4);
      }
      
      // Safety: make sure correctAnswer is one of the options
      if (!options.includes(correctAnswer)) {
        correctAnswer = options[0];
      }
      
      return { question, options, correctAnswer };
    });
    
    return data;
  } catch (error) {
    console.error("Failed to parse JSON response from LLM:", error, rawText);
    throw new Error("The AI provider did not return a valid quiz format. Please try again.");
  }
}

export async function generateQuiz(topic: string, difficulty: Difficulty, provider?: AIProvider): Promise<Quiz> {
  const activeProvider = provider || getActiveProvider();
  const prompt = buildPrompt(topic, difficulty);
  
  console.log(`Generating quiz using provider: ${activeProvider} for topic: "${topic}" (${difficulty})`);

  if (activeProvider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing.");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return parseQuizJSON(responseText);
  }
  
  if (activeProvider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY environment variable is missing.");
    
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    
    const responseText = response.choices[0]?.message?.content || "";
    return parseQuizJSON(responseText);
  }
  
  if (activeProvider === "openrouter") {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY environment variable is missing.");
    
    const openrouter = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://localhost:3000",
        "X-Title": "Spanish Quiz Generator",
      }
    });

    // List of active fallback free models to try on OpenRouter, prioritized by speed (smaller models first)
    const freeModels = [
      "meta-llama/llama-3.2-3b-instruct:free",
      "google/gemma-2-9b-it:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "qwen/qwen-2.5-72b-instruct:free",
    ];

    let lastError: any = null;
    let hadRateLimitError = false;

    for (const model of freeModels) {
      try {
        console.log(`Querying OpenRouter free model: ${model}...`);
        const response = await openrouter.chat.completions.create({
          model,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });
        
        const responseText = response.choices[0]?.message?.content || "";
        return parseQuizJSON(responseText);
      } catch (err: any) {
        const errorMsg = String(err?.message || err || "");
        console.warn(`OpenRouter model ${model} failed:`, errorMsg);
        lastError = err;
        
        if (errorMsg.includes("429") || errorMsg.toLowerCase().includes("rate limit") || errorMsg.toLowerCase().includes("provider returned error")) {
          hadRateLimitError = true;
        }
        // Continue to next model if this one fails (e.g. 429 rate limit, 503 overload, 404)
      }
    }

    // If all models in the fallback array failed
    if (hadRateLimitError) {
      throw new Error("OpenRouter's free tier is overloaded (429 Rate Limit). Please try again in 5-10 seconds.");
    }
    
    const errorString = String(lastError?.message || lastError || "");
    throw new Error(`OpenRouter error: ${errorString || "All fallback free models failed. Please retry."}`);
  }
  
  throw new Error(`Unsupported AI provider: ${activeProvider}`);
}
