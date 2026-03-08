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
        "relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 overflow-hidden",
        isDark
          ? "bg-[hsl(150,30%,15%)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
          : "bg-[hsl(90,50%,75%)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      {/* Background details */}
      {isDark ? (
        <>
          {/* Stars */}
          <span className="absolute left-1.5 top-1 h-0.5 w-0.5 rounded-full bg-primary-foreground/50 animate-pulse" />
          <span className="absolute left-4 top-2 h-[3px] w-[3px] rounded-full bg-primary-foreground/30" />
          <span className="absolute left-2.5 bottom-1.5 h-0.5 w-0.5 rounded-full bg-primary-foreground/40 animate-pulse" />
          <span className="absolute left-5 bottom-1 h-[2px] w-[2px] rounded-full bg-primary-foreground/20" />
        </>
      ) : (
        <>
          {/* Little leaf/branch details */}
          <span className="absolute right-2.5 top-1 text-[7px] leading-none opacity-60">🌿</span>
          <span className="absolute right-5 bottom-0.5 text-[6px] leading-none opacity-40">🍃</span>
        </>
      )}

      {/* Knob */}
      <span
        className={cn(
          "relative inline-flex h-5 w-5 items-center justify-center rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDark
            ? "translate-x-8 bg-[hsl(150,20%,30%)]"
            : "translate-x-1 bg-[hsl(90,60%,45%)]"
        )}
      >
        {isDark ? (
          /* Dried leaf / moon */
          <span className="text-[10px] leading-none">🍂</span>
        ) : (
          /* Green leaf / sun */
          <span className="text-[10px] leading-none">🌱</span>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
