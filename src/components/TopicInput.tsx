"use client";

import { Sparkles, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TopicInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

const PRESET_TOPICS = [
  { label: "Common Verbs", value: "Spanish Verbs" },
  { label: "Family Vocabulary", value: "Family Vocabulary" },
  { label: "Spanish for Travel", value: "Travel Spanish" },
  { label: "Present Tense", value: "Present Tense" },
  { label: "Numbers and Times", value: "Numbers and Telling Time" },
  { label: "Colors and Clothing", value: "Colors and Clothing" },
  { label: "Greetings and Phrases", value: "Greetings and Phrases" },
];

export default function TopicInput({ value, onChange, error }: TopicInputProps) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex justify-between items-center">
        <label
          htmlFor="topic"
          className="font-display font-bold text-lg text-foreground flex items-center gap-1.5"
        >
          <span>What would you like to practice today?</span>
          <span className="text-primary text-[10px] sm:text-xs flex items-center gap-0.5 bg-primary/10 px-2 py-0.5 rounded-full font-semibold">
            <Sparkles className="w-3 h-3" /> Free Topic
          </span>
        </label>
        <span className="text-xs text-muted">Examples: Verbs, Greetings, Trips...</span>
      </div>

      <div className="relative">
        <input
          id="topic"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a Spanish topic..."
          aria-invalid={!!error}
          aria-describedby={error ? "topic-error" : undefined}
          className={`w-full h-12 sm:h-14 px-5 pr-12 rounded-2xl bg-card border ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              : "border-border focus:border-primary focus:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          } text-foreground placeholder-muted outline-none transition-all shadow-inner font-medium text-base`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
          <HelpCircle className="w-5 h-5 opacity-60" />
        </div>
      </div>

      {error && (
        <motion.p
          id="topic-error"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold text-red-500 pl-1"
        >
          {error}
        </motion.p>
      )}

      <div>
        <p className="text-[10px] sm:text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider pl-1">
          Suggested Topics
        </p>
        <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          {PRESET_TOPICS.map((topic, idx) => (
            <motion.button
              key={idx}
              type="button"
              onClick={() => onChange(topic.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`shrink-0 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs sm:text-sm font-medium border cursor-pointer transition-all duration-300 ${
                value.toLowerCase() === topic.value.toLowerCase()
                  ? "bg-primary/90 border-primary text-primary-foreground font-semibold shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                  : "bg-muted-background/30 backdrop-blur-md border-border/50 hover:bg-muted-background/80 hover:border-primary/40 text-foreground"
              }`}
            >
              {topic.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
