export type Difficulty = "beginner" | "intermediate" | "advanced";

export type AIProvider = "gemini" | "openai" | "openrouter";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  title: string;
  questions: Question[];
}

export interface QuizHistoryItem {
  id: string;
  topic: string;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface QuizGenerationParams {
  topic: string;
  difficulty: Difficulty;
  provider?: AIProvider;
}
