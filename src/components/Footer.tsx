export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div className="text-center sm:text-left">
          <p className="font-display font-bold text-foreground">
            ¡Dígalo! Spanish Quiz Generator
          </p>
          <p className="text-xs text-muted mt-0.5">
            Learn Spanish fast and fun with Artificial Intelligence.
          </p>
        </div>
        <div className="text-center sm:text-right text-xs">
          <p>&copy; {new Date().getFullYear()} ¡Dígalo!. Created with Next.js and Gemini.</p>
        </div>
      </div>
    </footer>
  );
}
