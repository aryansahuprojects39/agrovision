import { useEffect, useState, useMemo } from "react";
import { useEnvironment } from "@/contexts/EnvironmentContext";

type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";

const SEASON_PARTICLES: Record<Season, { day: string[]; night: string[] }> = {
  spring: {
    day: ["🌸", "🌼", "🦋", "🌿", "💐"],
    night: ["🌸", "✨", "🌿", "🌙"],
  },
  summer: {
    day: ["🌻", "☀️", "🌾", "🐝", "🔥"],
    night: ["⭐", "🌙", "✨", "🦗"],
  },
  monsoon: {
    day: ["💧", "🌧️", "🌊", "🍃", "💦"],
    night: ["💧", "⚡", "🌫️", "💦"],
  },
  autumn: {
    day: ["🍂", "🍁", "🍃", "🌰", "🍄"],
    night: ["🍂", "🍁", "🌙", "✨"],
  },
  winter: {
    day: ["❄️", "⛄", "🌨️", "💎", "🧊"],
    night: ["❄️", "✨", "🌙", "💎"],
  },
};

interface Particle {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
  sway: number;
}

const FloatingSeasonalParticles = () => {
  const { season, isDark, timeOfDay } = useEnvironment();
  const isNight = timeOfDay === "night" || timeOfDay === "evening";
  const [visible, setVisible] = useState(true);

  // Regenerate particles when season changes
  const particles = useMemo(() => {
    const emojis = SEASON_PARTICLES[season][isNight ? "night" : "day"];
    const count = 15;
    return Array.from({ length: count }, (_, i): Particle => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 10,
      size: 10 + Math.random() * 14,
      sway: 20 + Math.random() * 40,
    }));
  }, [season, isNight]);

  // Respect reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setVisible(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setVisible(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={`${season}-${p.id}`}
          className="absolute animate-float-particle"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: isDark ? 0.3 : 0.5,
            ["--sway" as string]: `${p.sway}px`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingSeasonalParticles;
