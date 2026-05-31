"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizHistoryItem, Difficulty } from "@/types";

export function useQuizHistory() {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("digalo_quiz_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading quiz history from localStorage:", e);
    }
    setMounted(true);
  }, []);

  // Save item to history
  const saveQuiz = useCallback((topic: string, difficulty: Difficulty, score: number, totalQuestions: number) => {
    const newItem: QuizHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      topic,
      difficulty,
      score,
      totalQuestions,
      date: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 50); // Cap at 50 entries
      try {
        localStorage.setItem("digalo_quiz_history", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving quiz history to localStorage:", e);
      }
      return updated;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem("digalo_quiz_history");
      setHistory([]);
    } catch (e) {
      console.error("Error clearing quiz history:", e);
    }
  }, []);

  return {
    history: mounted ? history : [],
    saveQuiz,
    clearHistory,
    isLoaded: mounted,
  };
}
