import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "¡Dígalo! - Spanish Quiz Generator",
  description: "Generate interactive, AI-powered Spanish quizzes on any topic instantly. Perfect for beginners to advanced learners.",
  keywords: ["Spanish", "Quiz", "AI", "Gemini", "Spanish learning", "Duolingo style", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We inject a script to prevent theme flash when loading the app
  const themeInitScript = `
    (function() {
      const theme = localStorage.getItem('theme') || 'dark';
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    })()
  `;

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
