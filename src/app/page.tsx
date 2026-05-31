"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Settings, Trash2, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopicInput from "@/components/TopicInput";
import DifficultySelector from "@/components/DifficultySelector";
import LoadingScreen from "@/components/LoadingScreen";
import { useQuizHistory } from "@/hooks/useLocalStorage";
import { Difficulty, AIProvider } from "@/types";
import { quizSchema } from "@/lib/validations/quiz";

export default function HomePage() {
  const router = useRouter();
  const { history, clearHistory } = useQuizHistory();
  
  // App state
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [provider, setProvider] = useState<AIProvider>(() => {
    const defaultProvider = process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER;
    if (defaultProvider === "gemini" || defaultProvider === "openai" || defaultProvider === "openrouter") {
      return defaultProvider as AIProvider;
    }
    return "gemini";
  });
  const [loading, setLoading] = useState(false);
  
  // Validation state
  const [validationError, setValidationError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    
    // Validate using Zod schema
    const validation = quizSchema.safeParse({ topic, difficulty, provider });
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Invalid inputs";
      setValidationError(errorMsg);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, provider }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred while generating the quiz.");
      }

      // Store generated quiz in sessionStorage to pass to the /quiz route
      sessionStorage.setItem("digalo_quiz_data", JSON.stringify(data));
      sessionStorage.setItem("digalo_quiz_topic", topic);
      sessionStorage.setItem("digalo_quiz_difficulty", difficulty);
      
      // Navigate to active quiz page
      router.push("/quiz");
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || "Could not connect to the server.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar showHistoryBtn={history.length > 0} onOpenHistory={() => setShowHistoryModal(true)} />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center py-12"
            >
              <LoadingScreen topic={topic} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <div className="text-center mb-8">
                <span className="inline-block px-3.5 py-1 text-xs font-bold bg-primary/10 border border-primary/20 text-primary rounded-full uppercase tracking-wider font-display mb-3">
                  Learn Spanish with Artificial Intelligence!
                </span>
                <h1 className="text-3.5xl sm:text-5xl font-display font-black tracking-tight text-foreground leading-tight">
                  Spanish Quiz Generator
                </h1>
                <p className="text-sm sm:text-base text-muted max-w-lg mx-auto mt-2 font-medium">
                  Choose any topic and level. Our AI will build a custom quiz with 10-15 questions in seconds.
                </p>
              </div>

              <form
                onSubmit={handleGenerateQuiz}
                className="bg-card border-2 border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6"
              >
                <TopicInput value={topic} onChange={setTopic} error={validationError} />
                
                <DifficultySelector selected={difficulty} onSelect={setDifficulty} />

                {/* Advanced Settings toggle */}
                <div className="border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground cursor-pointer transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Advanced Settings (AI Provider)</span>
                  </button>

                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3"
                      >
                        <div className="flex flex-col gap-2 p-4 bg-muted-background/40 border border-border rounded-2xl">
                          <label htmlFor="provider" className="text-xs font-bold text-foreground">
                            AI Provider
                          </label>
                          <select
                            id="provider"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value as AIProvider)}
                            className="h-10 px-3 rounded-xl border border-border bg-card text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all text-foreground"
                          >
                            <option value="gemini">Google Gemini (Model: gemini-1.5-flash)</option>
                            <option value="openai">OpenAI (Model: gpt-4o-mini)</option>
                            <option value="openrouter">OpenRouter (Model: gemma-4-26b-a4b-it:free)</option>
                          </select>
                          <span className="text-[10px] text-muted">
                            Make sure the corresponding API key is configured on the server.
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary-hover text-primary-foreground text-base font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-98 mt-2"
                >
                  <span>Generate Quiz</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* History Drawer Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-card border-l border-border p-6 shadow-2xl flex flex-col gap-6 text-foreground"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-extrabold text-xl flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" /> Quiz History
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 hover:bg-muted-background border border-transparent hover:border-border rounded-xl text-muted hover:text-foreground cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-3.5 pr-1">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center text-muted">
                    <p className="font-semibold text-sm">No saved quizzes yet</p>
                    <p className="text-xs mt-1">Complete your first quiz to see your history here.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-border bg-muted-background/30 rounded-2xl flex flex-col gap-2 relative group"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-foreground line-clamp-1">
                          {item.topic}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded-full capitalize">
                            {item.difficulty}
                          </span>
                          <span className="text-[10px] text-muted">{item.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/60 pt-2 mt-1">
                        <span className="text-xs text-muted">Score:</span>
                        <span className={`text-sm font-black ${item.score / item.totalQuestions >= 0.8 ? "text-emerald-500" : "text-primary"}`}>
                          {item.score}/{item.totalQuestions} ({Math.round((item.score / item.totalQuestions) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your quiz history?")) {
                      clearHistory();
                      setShowHistoryModal(false);
                    }
                  }}
                  className="w-full h-11 border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors mt-auto text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Clear History
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
