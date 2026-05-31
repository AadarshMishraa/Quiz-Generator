"use client";

import { useState } from "react";
import { Check, X, RotateCcw, Share2, Trophy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Question, Difficulty } from "@/types";

interface ResultCardProps {
  topic: string;
  difficulty: Difficulty;
  questions: Question[];
  userAnswers: Record<number, string>;
  onRetry: () => void;
}

export default function ResultCard({
  topic,
  difficulty,
  questions,
  userAnswers,
  onRetry,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const totalQuestions = questions.length;
  
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctAnswer) {
      correctCount++;
    }
  });
  
  const incorrectCount = totalQuestions - correctCount;
  const percentageScore = Math.round((correctCount / totalQuestions) * 100);

  // Generate performance analysis feedback based on difficulty and score
  const getFeedback = () => {
    const isGood = percentageScore >= 80;
    const isMedium = percentageScore >= 50;
    
    if (difficulty === "beginner") {
      if (isGood) return "Excellent! You have a strong understanding of basic Spanish vocabulary. Continue practicing sentence construction.";
      if (isMedium) return "Good job! Review basic pronouns, vocabulary, and simple verbs to solidify your basics.";
      return "Don't worry! Keep practicing. Focus on greetings, numbers, and basic nouns to build a solid foundation.";
    } else if (difficulty === "intermediate") {
      if (isGood) return "Very good! Focus on improving grammar consistency and verb conjugation (past & future tenses).";
      if (isMedium) return "Good progress. Pay closer attention to verb agreements and prepositions like por and para.";
      return "Needs practice. Focus on core conjugations (present, preterite, imperfect) and reading simple articles.";
    } else {
      if (isGood) return "Amazing! Great performance. Continue practicing complex sentence structures (subjunctive) and reading comprehension.";
      if (isMedium) return "Solid skills! Review Spanish idioms, subjunctive mood applications, and advanced vocabulary words.";
      return "Advanced Spanish is tough! Focus on reading authentic material, listening to podcasts, and studying rare conjugations.";
    }
  };

  const handleShare = () => {
    const shareText = `I scored ${percentageScore}% on the "${topic}" quiz on ¡Dígalo! 🎓🇪🇸 \n${correctCount} correct and ${incorrectCount} incorrect. Test yourself too!`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 pb-12">
      {/* Overview Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border-2 border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center gap-6"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>
        
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest font-display">
            Quiz Completed!
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground mt-1">
            {topic}
          </h2>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-bold bg-muted-background border border-border text-foreground rounded-full capitalize">
            Level: {difficulty}
          </span>
        </div>

        {/* Score & Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-md my-4">
          <div className="flex flex-col items-center justify-center p-4 bg-muted-background/40 border border-border rounded-2xl">
            <span className="text-3xl sm:text-4xl font-display font-black text-primary">
              {percentageScore}%
            </span>
            <span className="text-xs text-muted font-bold uppercase mt-1">Score</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <span className="text-3xl sm:text-4xl font-display font-black text-emerald-500">
              {correctCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-1">Correct</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <span className="text-3xl sm:text-4xl font-display font-black text-red-500">
              {incorrectCount}
            </span>
            <span className="text-xs text-red-600 dark:text-red-400 font-bold uppercase mt-1">Incorrect</span>
          </div>
        </div>

        {/* Performance Feedback */}
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-4 sm:p-5 w-full max-w-xl text-left flex gap-3.5">
          <div className="text-primary shrink-0 mt-0.5">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-foreground mb-1">Performance Analysis</h3>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
              {getFeedback()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-2">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-2xl cursor-pointer shadow-md shadow-primary/15 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-card hover:bg-muted-background text-foreground font-bold rounded-2xl border-2 border-border cursor-pointer transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" /> Copied
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-muted" /> Share
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Review Section */}
      <div className="flex flex-col gap-4">
        <h3 className="font-display font-extrabold text-xl text-foreground">
          Questions Review
        </h3>
        
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`border-2 rounded-2xl p-5 bg-card flex flex-col gap-3 ${
                  isCorrect ? "border-emerald-500/20" : "border-red-500/20"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <span className="font-display font-bold text-sm text-muted shrink-0">
                    Question {idx + 1}
                  </span>
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                      <Check className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase">
                      <X className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>
                
                <p className="font-bold text-foreground text-sm sm:text-base">
                  {q.question}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = userAnswer === opt;
                    const isCorrectChoice = q.correctAnswer === opt;
                    
                    let itemStyle = "border-border text-muted bg-muted-background/20";
                    if (isCorrectChoice) {
                      itemStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold";
                    } else if (isUserChoice && !isCorrect) {
                      itemStyle = "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold";
                    }
                    
                    return (
                      <div
                        key={optIdx}
                        className={`px-3 py-2 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${itemStyle}`}
                      >
                        <span>{opt}</span>
                        {isCorrectChoice && <Check className="w-4 h-4 shrink-0 text-emerald-500" />}
                        {isUserChoice && !isCorrect && <X className="w-4 h-4 shrink-0 text-red-500" />}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
