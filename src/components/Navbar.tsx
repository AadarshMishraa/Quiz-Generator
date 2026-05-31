"use client";

import Link from "next/link";
import Image from "next/image";
import { History } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  showHistoryBtn?: boolean;
  onOpenHistory?: () => void;
}

export default function Navbar({ showHistoryBtn, onOpenHistory }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <Image src="/logo.png" alt="Digalo Logo" width={40} height={40} className="object-cover" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ¡Dígalo!
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {showHistoryBtn && onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-muted hover:text-foreground rounded-xl bg-muted-background border border-transparent hover:border-border transition-all cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
