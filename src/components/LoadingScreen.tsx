"use client";

import { useEffect, useState } from "react";
import { Sparkles, Globe, BookOpen, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  topic: string;
}

const FACTS = [
  {
    icon: Globe,
    text: "Spanish is the official language of 21 countries and is spoken by over 500 million people worldwide.",
  },
  {
    icon: BookOpen,
    text: "Tip: Inverted question marks (¿) and exclamation marks (¡) at the start of a sentence help to set the reading tone from the beginning.",
  },
  {
    icon: Lightbulb,
    text: "Fun Fact: The letter 'ñ' is the most distinctive symbol of Spanish, originated by medieval scribes to save parchment.",
  },
  {
    icon: Sparkles,
    text: "Tip: Unlike English, most adjectives in Spanish are placed after the noun (e.g., 'el coche rápido').",
  },
  {
    icon: BookOpen,
    text: "Fact: Spanish is a Romance language, meaning it evolved directly from vulgar Latin spoken by Roman soldiers.",
  },
  {
    icon: Globe,
    text: "Did you know? Spanish is the second most spoken language in the world as a native tongue, after Mandarin Chinese.",
  },
];

export default function LoadingScreen({ topic }: LoadingScreenProps) {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FACTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = FACTS[factIndex]?.icon || Sparkles;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 max-w-xl mx-auto gap-8">
      {/* Premium Loader */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Outer pulse */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 rounded-3xl bg-primary/20"
        />
        {/* Spinning border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 rounded-2xl border-4 border-primary border-t-transparent border-r-transparent"
        />
        <Sparkles className="absolute w-6 h-6 text-primary animate-pulse" />
      </div>

      <div className="space-y-2">
        <h3 className="font-display font-extrabold text-xl sm:text-2xl text-foreground">
          Generating your custom quiz...
        </h3>
        <p className="text-sm font-semibold text-primary">
          Topic: &quot;{topic}&quot;
        </p>
      </div>

      {/* Facts Slider */}
      <div className="w-full glassmorphism border rounded-2xl p-5 min-h-[140px] flex items-center relative overflow-hidden shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex gap-4 items-start text-left w-full"
          >
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Did you know?
              </span>
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                {FACTS[factIndex]?.text}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <span className="text-xs text-muted font-medium">
        The AI generation process takes between 5 and 15 seconds.
      </span>
    </div>
  );
}
