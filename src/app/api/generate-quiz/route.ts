import { NextRequest, NextResponse } from "next/server";
import { quizSchema } from "@/lib/validations/quiz";
import { generateQuiz } from "@/lib/ai/provider";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = quizSchema.safeParse(body);
    if (!result.success) {
      const errorMap = result.error.flatten().fieldErrors;
      const firstError = Object.values(errorMap)[0]?.[0] || "Invalid input parameters";
      return NextResponse.json(
        { error: firstError, details: errorMap },
        { status: 400 }
      );
    }
    
    const { topic, difficulty, provider } = result.data;
    
    // Generate the quiz using the selected AI provider
    const quiz = await generateQuiz(topic, difficulty, provider);
    
    return NextResponse.json(quiz);
  } catch (error: any) {
    console.error("API /api/generate-quiz error details:", error);
    
    // Handle user-friendly error response
    let errorMessage = "Unable to generate quiz right now. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "AI Provider credentials are not configured on the server. Please check environment setup.";
      } else if (error.message.includes("did not return a valid quiz format")) {
        errorMessage = "The AI response failed to compile into a proper quiz format. Please try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
