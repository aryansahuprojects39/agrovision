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
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0",
        isDark
          ? "bg-[hsl(220,20%,25%)]"
          : "bg-[hsl(45,90%,70%)]",
        className
      )}
    >
      {isDark && (
        <>
          <span className="absolute left-1.5 top-1 h-0.5 w-0.5 rounded-full bg-primary-foreground/60 animate-pulse" />
          <span className="absolute left-3 top-2.5 h-0.5 w-0.5 rounded-full bg-primary-foreground/40" />
        </>
      )}
      {!isDark && (
        <span className="absolute right-1.5 top-1.5 h-1.5 w-2 rounded-full bg-primary-foreground/25" />
      )}
      <span
        className={cn(
          "inline-flex h-4 w-4 items-center justify-center rounded-full shadow-sm transition-transform duration-300",
          isDark
            ? "translate-x-6 bg-[hsl(220,10%,75%)]"
            : "translate-x-1 bg-[hsl(45,80%,55%)]"
        )}
      >
        {isDark ? (
          <span className="h-1 w-1 rounded-full bg-[hsl(220,10%,60%)]" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-[hsl(45,90%,65%)] shadow-[0_0_4px_hsl(45,90%,65%)]" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
