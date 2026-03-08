import { useTheme } from "@/hooks/use-theme";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { cn } from "@/lib/utils";

type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";

const SEASON_CONFIG: Record<Season, {
  lightBg: string;
  darkBg: string;
  lightKnob: string;
  darkKnob: string;
  lightIcon: string;
  darkIcon: string;
  lightDecor: { emoji: string; pos: string; size: string; opacity: string }[];
  darkDecor: { emoji: string; pos: string; size: string; opacity: string }[];
}> = {
  spring: {
    lightBg: "bg-[hsl(120,45%,75%)]",
    darkBg: "bg-[hsl(150,30%,15%)]",
    lightKnob: "bg-[hsl(120,55%,50%)]",
    darkKnob: "bg-[hsl(150,25%,28%)]",
    lightIcon: "🌸",
    darkIcon: "🌙",
    lightDecor: [
      { emoji: "🌿", pos: "right-2.5 top-1", size: "7px", opacity: "opacity-60" },
      { emoji: "🦋", pos: "right-5 bottom-0.5", size: "6px", opacity: "opacity-40" },
    ],
    darkDecor: [
      { emoji: "✨", pos: "left-1.5 top-1", size: "5px", opacity: "opacity-50" },
      { emoji: "🌾", pos: "left-4 bottom-1", size: "6px", opacity: "opacity-30" },
    ],
  },
  summer: {
    lightBg: "bg-[hsl(45,80%,72%)]",
    darkBg: "bg-[hsl(30,25%,15%)]",
    lightKnob: "bg-[hsl(40,90%,55%)]",
    darkKnob: "bg-[hsl(30,20%,30%)]",
    lightIcon: "☀️",
    darkIcon: "🌅",
    lightDecor: [
      { emoji: "🌻", pos: "right-2.5 top-0.5", size: "7px", opacity: "opacity-60" },
      { emoji: "🔥", pos: "right-5 bottom-0.5", size: "5px", opacity: "opacity-30" },
    ],
    darkDecor: [
      { emoji: "⭐", pos: "left-2 top-1", size: "5px", opacity: "opacity-40" },
      { emoji: "🦗", pos: "left-4 bottom-1.5", size: "5px", opacity: "opacity-30" },
    ],
  },
  monsoon: {
    lightBg: "bg-[hsl(200,50%,70%)]",
    darkBg: "bg-[hsl(210,35%,15%)]",
    lightKnob: "bg-[hsl(200,60%,50%)]",
    darkKnob: "bg-[hsl(210,30%,28%)]",
    lightIcon: "🌧️",
    darkIcon: "⛈️",
    lightDecor: [
      { emoji: "💧", pos: "right-2 top-0.5", size: "6px", opacity: "opacity-50" },
      { emoji: "🌊", pos: "right-5 bottom-0.5", size: "6px", opacity: "opacity-35" },
    ],
    darkDecor: [
      { emoji: "💧", pos: "left-1.5 top-1.5", size: "5px", opacity: "opacity-40" },
      { emoji: "🌫️", pos: "left-4 bottom-1", size: "5px", opacity: "opacity-25" },
    ],
  },
  autumn: {
    lightBg: "bg-[hsl(30,55%,70%)]",
    darkBg: "bg-[hsl(25,30%,14%)]",
    lightKnob: "bg-[hsl(25,65%,50%)]",
    darkKnob: "bg-[hsl(25,25%,28%)]",
    lightIcon: "🍂",
    darkIcon: "🎃",
    lightDecor: [
      { emoji: "🍁", pos: "right-2 top-0.5", size: "7px", opacity: "opacity-55" },
      { emoji: "🍃", pos: "right-5 bottom-0.5", size: "6px", opacity: "opacity-35" },
    ],
    darkDecor: [
      { emoji: "🍂", pos: "left-2 top-1", size: "5px", opacity: "opacity-40" },
      { emoji: "🌰", pos: "left-4.5 bottom-1", size: "5px", opacity: "opacity-30" },
    ],
  },
  winter: {
    lightBg: "bg-[hsl(210,30%,82%)]",
    darkBg: "bg-[hsl(220,25%,14%)]",
    lightKnob: "bg-[hsl(210,40%,65%)]",
    darkKnob: "bg-[hsl(220,20%,30%)]",
    lightIcon: "❄️",
    darkIcon: "🌨️",
    lightDecor: [
      { emoji: "⛄", pos: "right-2.5 top-0.5", size: "6px", opacity: "opacity-50" },
      { emoji: "❄️", pos: "right-5 bottom-0.5", size: "5px", opacity: "opacity-35" },
    ],
    darkDecor: [
      { emoji: "✨", pos: "left-1.5 top-1", size: "5px", opacity: "opacity-40" },
      { emoji: "❄️", pos: "left-4 bottom-1.5", size: "5px", opacity: "opacity-25" },
    ],
  },
};

const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const { season } = useEnvironment();
  const isDark = theme === "dark";
  const config = SEASON_CONFIG[season];

  const decor = isDark ? config.darkDecor : config.lightDecor;

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Toggle theme (${season})`}
      className={cn(
        "relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 overflow-hidden",
        isDark
          ? `${config.darkBg} shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]`
          : `${config.lightBg} shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]`,
        className
      )}
    >
      {/* Season-specific background decorations */}
      {decor.map((d, i) => (
        <span
          key={i}
          className={cn("absolute leading-none", d.pos, d.opacity)}
          style={{ fontSize: d.size }}
        >
          {d.emoji}
        </span>
      ))}

      {/* Knob */}
      <span
        className={cn(
          "relative inline-flex h-5 w-5 items-center justify-center rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDark
            ? `translate-x-8 ${config.darkKnob}`
            : `translate-x-1 ${config.lightKnob}`
        )}
      >
        <span className="text-[10px] leading-none">
          {isDark ? config.darkIcon : config.lightIcon}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
