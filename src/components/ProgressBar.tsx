"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-baseline text-sm font-semibold">
        <span className="text-primary font-display">
          Question {current} of {total}
        </span>
        <span className="text-muted">
          {Math.round(percentage)}% completed
        </span>
      </div>
      
      <div className="w-full h-3 rounded-full bg-muted-background overflow-hidden border border-border shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
