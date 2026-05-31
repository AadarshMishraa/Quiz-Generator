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
      className="w-full glassmorphism rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6"
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
              className={`flex items-center gap-4 w-full p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-muted-background/20 backdrop-blur-sm hover:bg-muted-background/60 border-border/50 hover:border-primary/40 text-foreground"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border transition-all duration-300 ${
                  isSelected
                    ? "bg-primary border-primary text-primary-foreground shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                    : "bg-card border-border/50 text-muted"
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
