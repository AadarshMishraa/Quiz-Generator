"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResultCard from "@/components/ResultCard";
import { useQuizHistory } from "@/hooks/useLocalStorage";
import { Quiz, Difficulty } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const { saveQuiz } = useQuizHistory();
  
  // Data states
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  
  // Ref to ensure history is only saved once
  const savedRef = useRef(false);

  useEffect(() => {
    try {
      const storedQuiz = sessionStorage.getItem("digalo_quiz_data");
      const storedAnswers = sessionStorage.getItem("digalo_quiz_answers");
      const storedTopic = sessionStorage.getItem("digalo_quiz_topic") || "Spanish Quiz";
      const storedDiff = sessionStorage.getItem("digalo_quiz_difficulty") as Difficulty || "beginner";
      
      if (!storedQuiz || !storedAnswers) {
        router.push("/");
        return;
      }
      
      const parsedQuiz = JSON.parse(storedQuiz) as Quiz;
      const parsedAnswers = JSON.parse(storedAnswers) as Record<number, string>;
      
      setQuiz(parsedQuiz);
      setUserAnswers(parsedAnswers);
      setTopic(storedTopic);
      setDifficulty(storedDiff);
      
      // Calculate score and save to history exactly once
      if (!savedRef.current) {
        let correctCount = 0;
        parsedQuiz.questions.forEach((q, idx) => {
          if (parsedAnswers[idx] === q.correctAnswer) {
            correctCount++;
          }
        });
        
        saveQuiz(storedTopic, storedDiff, correctCount, parsedQuiz.questions.length);
        savedRef.current = true;
      }
    } catch (e) {
      console.error(e);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router, saveQuiz]);

  const handleRetry = () => {
    // SessionStorage contains the active quiz data. We just clear the user's answers and route back to quiz!
    sessionStorage.removeItem("digalo_quiz_answers");
    router.push("/quiz");
  };

  const handleGoHome = () => {
    sessionStorage.removeItem("digalo_quiz_data");
    sessionStorage.removeItem("digalo_quiz_answers");
    router.push("/");
  };

  if (loading || !quiz) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-muted">Loading results...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <ResultCard
          topic={topic}
          difficulty={difficulty}
          questions={quiz.questions}
          userAnswers={userAnswers}
          onRetry={handleRetry}
        />
        
        <div className="flex justify-center mt-6">
          <button
            onClick={handleGoHome}
            className="px-6 py-2.5 font-bold text-sm text-muted hover:text-foreground hover:bg-muted-background border border-transparent hover:border-border rounded-xl transition-all cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
