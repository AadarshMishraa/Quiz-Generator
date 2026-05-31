import { z } from "zod";

export const quizSchema = z.object({
  topic: z
    .string()
    .min(1, "Topic cannot be empty")
    .max(80, "Topic must be 80 characters or less")
    .refine((val) => val.trim().length > 0, "Topic cannot contain only spaces")
    .refine((val) => /^[a-zA-Z0-9\sñáéíóúÜüÑ¿?¡!.,'-]+$/.test(val), "Topic contains invalid characters"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"], {
    message: "Invalid difficulty level selected",
  }),
  provider: z.enum(["gemini", "openai", "openrouter"]).optional(),
});

export type QuizSchemaType = z.infer<typeof quizSchema>;
export type QuizValidationErrors = Partial<Record<keyof QuizSchemaType, string>>;
