"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Timer, TimerOff, LogOut } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import QuizCard from "@/components/QuizCard";
import { Quiz, Difficulty } from "@/types";

export default function QuizPage() {
  const router = useRouter();
  
  // Quiz data loaded from sessionStorage
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  
  // Timer state
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds per question
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Event handlers wrapped in useCallback
  const handleSelectAnswer = useCallback((answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: answer,
    }));
  }, [currentIdx]);

  const handlePrevQuestion = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  }, [currentIdx]);

  const handleSubmitQuiz = useCallback(() => {
    // Save state to sessionStorage for the results page
    sessionStorage.setItem("digalo_quiz_answers", JSON.stringify(userAnswers));
    router.push("/results");
  }, [userAnswers, router]);

  const handleNextQuestion = useCallback(() => {
    const totalQuestions = quiz?.questions.length || 0;
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  }, [currentIdx, quiz, handleSubmitQuiz]);

  const handleAbandonQuiz = useCallback(() => {
    if (confirm("Are you sure you want to abandon the quiz? Your answers will not be saved.")) {
      sessionStorage.removeItem("digalo_quiz_data");
      router.push("/");
    }
  }, [router]);

  // Load quiz from sessionStorage
  useEffect(() => {
    try {
      const storedQuiz = sessionStorage.getItem("digalo_quiz_data");
      const storedTopic = sessionStorage.getItem("digalo_quiz_topic") || "Quiz de Español";
      const storedDiff = sessionStorage.getItem("digalo_quiz_difficulty") as Difficulty || "beginner";
      
      if (!storedQuiz) {
        router.push("/");
        return;
      }
      
      setQuiz(JSON.parse(storedQuiz));
      setTopic(storedTopic);
      setDifficulty(storedDiff);
    } catch (e) {
      console.error("Error reading quiz from sessionStorage:", e);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Handle timer countdown
  useEffect(() => {
    if (loading || !quiz) return;
    
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time is up! Move to next question or submit
      handleNextQuestion();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isTimerActive, quiz, loading, handleNextQuestion]);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(45);
  }, [currentIdx]);

  if (loading || !quiz) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-muted">Loading quiz data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];
  const totalQuestions = quiz.questions.length;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl flex flex-col gap-6">
        {/* Header Controls */}
        <div className="flex justify-between items-center bg-card border-2 border-border p-4 rounded-2xl shadow-sm text-foreground gap-4">
          <button
            onClick={handleAbandonQuiz}
            className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Abandon</span>
          </button>
          
          <div className="flex-grow flex flex-col min-w-0">
            <h1 className="font-display font-extrabold text-sm sm:text-base text-foreground truncate text-center md:text-left">
              {topic}
            </h1>
            <div className="hidden md:flex items-center gap-1.5 mt-0.5 justify-start">
              <span className="text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded-full capitalize">
                Level: {difficulty}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {/* Timer Controller */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerActive(!isTimerActive)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isTimerActive 
                    ? "bg-primary/10 border-primary/20 text-primary" 
                    : "bg-muted-background border-border text-muted"
                }`}
                title={isTimerActive ? "Disable timer" : "Enable timer"}
              >
                {isTimerActive ? <Timer className="w-4 h-4 animate-pulse" /> : <TimerOff className="w-4 h-4" />}
              </button>
              
              <div className="text-sm font-bold w-12 font-mono">
                {isTimerActive ? (
                  <span className={timeLeft <= 10 ? "text-red-500 font-extrabold" : "text-foreground"}>
                    {timeLeft}s
                  </span>
                ) : (
                  <span className="text-muted text-xs">No limit</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-card border-2 border-border p-5 rounded-2xl shadow-sm">
          <ProgressBar current={currentIdx + 1} total={totalQuestions} />
        </div>

        {/* Question Panel */}
        <div className="min-h-[300px] flex flex-col justify-center">
          {currentQuestion && (
            <QuizCard
              question={currentQuestion}
              selectedAnswer={userAnswers[currentIdx] || null}
              onSelectAnswer={handleSelectAnswer}
            />
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between gap-4 mt-2">
          <button
            type="button"
            onClick={handlePrevQuestion}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 px-4 py-3 border-2 border-border text-sm font-bold text-foreground bg-card hover:bg-muted-background disabled:opacity-40 disabled:hover:bg-card disabled:cursor-not-allowed rounded-2xl cursor-pointer transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            className={`flex items-center gap-1.5 px-6 py-3 text-sm font-bold text-white rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 ${
              currentIdx === totalQuestions - 1
                ? "bg-success hover:bg-emerald-600 shadow-success/15 hover:shadow-success/25"
                : "bg-primary hover:bg-primary-hover shadow-primary/15 hover:shadow-primary/25"
            }`}
          >
            {currentIdx === totalQuestions - 1 ? (
              <span>Finish</span>
            ) : (
              <>
                Next <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
