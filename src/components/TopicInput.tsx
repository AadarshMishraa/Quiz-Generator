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
    <div className="flex flex-col gap-3.5 w-full">
      <div className="flex justify-between items-center">
        <label
          htmlFor="topic"
          className="font-display font-bold text-lg text-foreground flex items-center gap-1.5"
        >
          <span>What would you like to practice today?</span>
          <span className="text-primary text-xs flex items-center gap-0.5 bg-primary/10 px-2 py-0.5 rounded-full font-semibold">
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
          className={`w-full h-14 px-5 pr-12 rounded-2xl bg-card border-2 ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/10"
              : "border-border focus:border-primary focus:ring-primary/10"
          } text-foreground placeholder-muted outline-none transition-all shadow-sm font-medium text-base`}
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
        <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wider pl-1">
          Suggested Topics
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_TOPICS.map((topic, idx) => (
            <motion.button
              key={idx}
              type="button"
              onClick={() => onChange(topic.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-medium border-2 cursor-pointer transition-colors duration-200 ${
                value.toLowerCase() === topic.value.toLowerCase()
                  ? "bg-primary border-primary text-primary-foreground font-semibold"
                  : "bg-card border-border hover:border-primary/50 text-foreground"
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
