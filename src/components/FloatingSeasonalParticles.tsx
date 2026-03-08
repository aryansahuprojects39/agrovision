import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useEnvironment } from "@/contexts/EnvironmentContext";

type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";

interface ParticleConfig {
  color: string;
  shape: "leaf" | "petal" | "snowflake" | "raindrop" | "maple";
  size: number;
}

const SEASON_PARTICLES: Record<Season, { day: ParticleConfig[]; night: ParticleConfig[] }> = {
  spring: {
    day: [
      { color: "rgba(236,72,153,0.5)", shape: "petal", size: 12 },
      { color: "rgba(34,197,94,0.4)", shape: "leaf", size: 14 },
      { color: "rgba(249,115,22,0.3)", shape: "petal", size: 10 },
    ],
    night: [
      { color: "rgba(236,72,153,0.3)", shape: "petal", size: 10 },
      { color: "rgba(34,197,94,0.25)", shape: "leaf", size: 12 },
    ],
  },
  summer: {
    day: [
      { color: "rgba(251,191,36,0.4)", shape: "leaf", size: 14 },
      { color: "rgba(245,158,11,0.35)", shape: "petal", size: 12 },
      { color: "rgba(34,197,94,0.3)", shape: "leaf", size: 10 },
    ],
    night: [
      { color: "rgba(251,191,36,0.25)", shape: "leaf", size: 12 },
      { color: "rgba(245,158,11,0.2)", shape: "petal", size: 10 },
    ],
  },
  monsoon: {
    day: [
      { color: "rgba(59,130,246,0.5)", shape: "raindrop", size: 8 },
      { color: "rgba(34,197,94,0.3)", shape: "leaf", size: 12 },
      { color: "rgba(96,165,250,0.4)", shape: "raindrop", size: 6 },
    ],
    night: [
      { color: "rgba(59,130,246,0.3)", shape: "raindrop", size: 7 },
      { color: "rgba(96,165,250,0.25)", shape: "raindrop", size: 5 },
    ],
  },
  autumn: {
    day: [
      { color: "rgba(234,88,12,0.5)", shape: "maple", size: 16 },
      { color: "rgba(161,98,7,0.4)", shape: "leaf", size: 14 },
      { color: "rgba(220,38,38,0.35)", shape: "maple", size: 12 },
    ],
    night: [
      { color: "rgba(234,88,12,0.3)", shape: "maple", size: 14 },
      { color: "rgba(161,98,7,0.25)", shape: "leaf", size: 12 },
    ],
  },
  winter: {
    day: [
      { color: "rgba(147,197,253,0.5)", shape: "snowflake", size: 10 },
      { color: "rgba(219,234,254,0.45)", shape: "snowflake", size: 8 },
      { color: "rgba(191,219,254,0.4)", shape: "snowflake", size: 12 },
    ],
    night: [
      { color: "rgba(147,197,253,0.3)", shape: "snowflake", size: 9 },
      { color: "rgba(219,234,254,0.25)", shape: "snowflake", size: 7 },
    ],
  },
};

function renderShape(shape: ParticleConfig["shape"], size: number, color: string) {
  switch (shape) {
    case "leaf":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22.65C9.93 19.16 14 16 17 8Z"
            fill={color}
          />
          <path
            d="M17 8C17 8 21 3 13 1C13 1 15 6 17 8Z"
            fill={color}
            opacity={0.7}
          />
        </svg>
      );
    case "petal":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="8" rx="5" ry="8" fill={color} transform="rotate(15 12 12)" />
        </svg>
      );
    case "snowflake":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
          <circle cx="12" cy="12" r="2" fill={color} stroke="none" />
        </svg>
      );
    case "raindrop":
      return (
        <svg width={size} height={size * 1.4} viewBox="0 0 12 17" fill="none">
          <path
            d="M6 0C6 0 0 8 0 12C0 14.76 2.69 17 6 17C9.31 17 12 14.76 12 12C12 8 6 0 6 0Z"
            fill={color}
          />
        </svg>
      );
    case "maple":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L9 7L4 6L6 11L2 14L7 14L6 19L12 15L18 19L17 14L22 14L18 11L20 6L15 7L12 2Z"
            fill={color}
          />
        </svg>
      );
  }
}

interface Particle {
  id: number;
  config: ParticleConfig;
  x: number;
  y: number;
  delay: number;
  duration: number;
  sway: number;
}

const FloatingSeasonalParticles = () => {
  const { season, isDark, timeOfDay } = useEnvironment();
  const isNight = timeOfDay === "night" || timeOfDay === "evening";
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

  const particles = useMemo(() => {
    const configs = SEASON_PARTICLES[season][isNight ? "night" : "day"];
    const count = 18;
    return Array.from({ length: count }, (_, i): Particle => {
      const config = configs[i % configs.length];
      return {
        id: i,
        config,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 12,
        sway: 15 + Math.random() * 35,
      };
    });
  }, [season, isNight]);

  // Track mouse position for parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
    // Apply parallax to particles via CSS custom properties
    const els = containerRef.current.querySelectorAll<HTMLElement>(".seasonal-particle");
    els.forEach((el, i) => {
      const depth = 0.3 + (i % 3) * 0.3; // varying depth
      const px = mouseRef.current.x * 20 * depth;
      const py = mouseRef.current.y * 15 * depth;
      el.style.setProperty("--parallax-x", `${px}px`);
      el.style.setProperty("--parallax-y", `${py}px`);
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Listen on the parent (hero section) or document
    const target = container.closest("section") || document;
    target.addEventListener("mousemove", handleMouseMove as EventListener);
    return () => target.removeEventListener("mousemove", handleMouseMove as EventListener);
  }, [handleMouseMove]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setVisible(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setVisible(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-[1]"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={`${season}-${p.id}`}
          className="seasonal-particle absolute animate-float-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: isDark ? 0.4 : 0.6,
            ["--sway" as string]: `${p.sway}px`,
            transform: `translate(var(--parallax-x, 0px), var(--parallax-y, 0px))`,
            transition: "transform 0.3s ease-out",
          }}
        >
          {renderShape(p.config.shape, p.config.size, p.config.color)}
        </div>
      ))}
    </div>
  );
};

export default FloatingSeasonalParticles;
