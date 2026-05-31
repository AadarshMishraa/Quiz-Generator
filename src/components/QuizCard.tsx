"use client";

import { motion } from "framer-motion";
import { Question } from "@/types";

interface QuizCardProps {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
}

export default function QuizCard({ question, selectedAnswer, onSelectAnswer }: QuizCardProps) {
  const optionPrefixes = ["A", "B", "C", "D"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="w-full bg-card border-2 border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-primary uppercase tracking-widest font-display">
          Select an answer
        </span>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-snug">
          {question.question}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const prefix = optionPrefixes[idx] || "";
          
          return (
            <motion.button
              key={idx}
              type="button"
              onClick={() => onSelectAnswer(option)}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-4 w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-primary/10 border-primary text-primary shadow-sm"
                  : "bg-muted-background/40 hover:bg-muted-background border-border hover:border-muted text-foreground"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-card border-border text-muted"
                }`}
              >
                {prefix}
              </div>
              <span className="font-semibold text-sm sm:text-base">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
