"use client";

import { ComponentType } from "react";
import { CheckCircle2, Award, Zap, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Difficulty } from "@/types";

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

interface DifficultyOption {
  value: Difficulty;
  title: string;
  icon: ComponentType<{ className?: string }>;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  bullets: string[];
}

const OPTIONS: DifficultyOption[] = [
  {
    value: "beginner",
    title: "Beginner",
    icon: Award,
    colorClass: "text-emerald-500",
    bgColorClass: "bg-emerald-500/10 dark:bg-emerald-500/5",
    borderColorClass: "border-emerald-500",
    bullets: ["Simple vocabulary", "Basic grammar", "Easy and short questions"],
  },
  {
    value: "intermediate",
    title: "Intermediate",
    icon: Zap,
    colorClass: "text-purple-500",
    bgColorClass: "bg-purple-500/10 dark:bg-purple-500/5",
    borderColorClass: "border-purple-500",
    bullets: ["Moderate grammar", "Varied vocabulary", "Sentence comprehension"],
  },
  {
    value: "advanced",
    title: "Advanced",
    icon: Flame,
    colorClass: "text-indigo-500",
    bgColorClass: "bg-indigo-500/10 dark:bg-indigo-500/5",
    borderColorClass: "border-indigo-500",
    bullets: ["Complex grammar", "Advanced reading", "Idioms and formal vocabulary"],
  },
];

export default function DifficultySelector({ selected, onSelect }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <span className="font-display font-bold text-lg text-foreground">
        Select your difficulty level
      </span>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.value;
          
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col items-start text-left p-5 rounded-2xl bg-card border-2 transition-all cursor-pointer shadow-sm ${
                isSelected
                  ? `${opt.borderColorClass} ${opt.bgColorClass} shadow-md`
                  : "border-border hover:border-muted"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${isSelected ? "bg-card shadow-sm" : "bg-muted-background"} ${opt.colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-display font-bold text-base text-foreground">
                  {opt.title}
                </span>
              </div>
              
              <ul className="space-y-1.5 w-full">
                {opt.bullets.map((bullet, index) => (
                  <li key={index} className="text-xs text-muted flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted/60" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              
              {isSelected && (
                <div className={`absolute top-4 right-4 ${opt.colorClass}`}>
                  <CheckCircle2 className="w-5 h-5 fill-current text-white dark:text-slate-900 stroke-2" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
