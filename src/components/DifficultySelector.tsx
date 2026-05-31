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
  borderColorClass: string;
  shadowClass: string;
  subtitle: string;
}

const OPTIONS: DifficultyOption[] = [
  {
    value: "beginner",
    title: "Beginner",
    icon: Award,
    colorClass: "text-emerald-500",
    bgColorClass: "bg-emerald-500/10 dark:bg-emerald-500/5",
    borderColorClass: "border-emerald-500",
    shadowClass: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    subtitle: "Basic grammar & simple vocabulary",
  },
  {
    value: "intermediate",
    title: "Intermediate",
    icon: Zap,
    colorClass: "text-purple-500",
    bgColorClass: "bg-purple-500/10 dark:bg-purple-500/5",
    borderColorClass: "border-purple-500",
    shadowClass: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    subtitle: "Sentence comprehension & varied tenses",
  },
  {
    value: "advanced",
    title: "Advanced",
    icon: Flame,
    colorClass: "text-indigo-500",
    bgColorClass: "bg-indigo-500/10 dark:bg-indigo-500/5",
    borderColorClass: "border-indigo-500",
    shadowClass: "shadow-[0_0_20px_rgba(99,102,241,0.25)]",
    subtitle: "Complex grammar & formal idioms",
  },
];

export default function DifficultySelector({ selected, onSelect }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <span className="font-display font-bold text-sm sm:text-base text-foreground">
        Select your difficulty level
      </span>
      
      <div className="flex flex-col md:flex-row gap-3">
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
              className={`flex-1 relative flex flex-row md:flex-col items-center md:items-start text-left p-3 sm:p-4 rounded-2xl glassmorphism border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? `${opt.borderColorClass} ${opt.bgColorClass} ${opt.shadowClass}`
                  : "border-border/40 hover:border-border hover:bg-card/40 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-card shadow-sm" : "bg-muted-background"} ${opt.colorClass}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm sm:text-base text-foreground leading-tight">
                    {opt.title}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted mt-0.5 md:mt-1 hidden sm:block">
                    {opt.subtitle}
                  </span>
                </div>
              </div>
              
              <span className="text-[10px] text-muted mt-1 block sm:hidden ml-2">
                {opt.subtitle}
              </span>
              
              {isSelected && (
                <div className={`absolute right-3 md:top-3 md:right-3 ${opt.colorClass}`}>
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
