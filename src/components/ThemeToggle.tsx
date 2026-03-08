import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDark
          ? "bg-[hsl(220,20%,25%)]"
          : "bg-[hsl(45,90%,70%)]",
        className
      )}
    >
      {/* Stars (dark mode) */}
      {isDark && (
        <>
          <span className="absolute left-2.5 top-1.5 h-1 w-1 rounded-full bg-primary-foreground/60 animate-pulse" />
          <span className="absolute left-5 top-3 h-0.5 w-0.5 rounded-full bg-primary-foreground/40" />
          <span className="absolute left-3.5 bottom-1.5 h-0.5 w-0.5 rounded-full bg-primary-foreground/50 animate-pulse" />
        </>
      )}
      {/* Clouds (light mode) */}
      {!isDark && (
        <>
          <span className="absolute right-2 top-2 h-2 w-3 rounded-full bg-primary-foreground/30" />
          <span className="absolute right-4 bottom-1.5 h-1.5 w-2.5 rounded-full bg-primary-foreground/20" />
        </>
      )}
      {/* Knob */}
      <span
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-transform duration-300",
          isDark
            ? "translate-x-9 bg-[hsl(220,10%,75%)]"
            : "translate-x-1 bg-[hsl(45,80%,55%)]"
        )}
      >
        {isDark ? (
          // Moon craters
          <>
            <span className="absolute h-1.5 w-1.5 rounded-full bg-[hsl(220,10%,65%)] top-1.5 right-1.5" />
            <span className="absolute h-1 w-1 rounded-full bg-[hsl(220,10%,65%)] bottom-1.5 left-2" />
          </>
        ) : (
          // Sun rays
          <span className="h-3 w-3 rounded-full bg-[hsl(45,90%,65%)] shadow-[0_0_6px_hsl(45,90%,65%)]" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
