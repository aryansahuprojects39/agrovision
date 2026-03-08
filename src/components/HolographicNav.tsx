import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Microscope, LayoutDashboard, ShoppingCart, CloudSun, Users, X } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { label: "AI Crop Doctor", href: "/disease-detection", icon: Microscope, color: "#22c55e" },
  { label: "Farm Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "#3b82f6" },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingCart, color: "#f59e0b" },
  { label: "Weather", href: "/weather", icon: CloudSun, color: "#06b6d4" },
  { label: "Community", href: "/community", icon: Users, color: "#a855f7" },
];

const HolographicNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const totalItems = NAV_ITEMS.length;
  const arcSpread = 180; // degrees
  const startAngle = -90 - arcSpread / 2; // center the arc upward
  const radius = 140;

  return (
    <div ref={containerRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
      {/* Backdrop glow */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1] pointer-events-none transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.08) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Menu items - arranged in arc above button */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4" style={{ width: 0, height: 0 }}>
        {NAV_ITEMS.map((item, i) => {
          const angle = startAngle + (arcSpread / (totalItems - 1)) * i;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="absolute group"
              style={{
                transform: isOpen
                  ? `translate(${x}px, ${y}px) scale(1)`
                  : `translate(0px, 0px) scale(0)`,
                opacity: isOpen ? 1 : 0,
                transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 60}ms`,
                left: "-32px",
                top: "-32px",
              }}
            >
              {/* Holographic card */}
              <div
                className="relative flex flex-col items-center gap-1.5 p-3 rounded-2xl backdrop-blur-xl border cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${item.color}15, ${item.color}08, transparent)`,
                  borderColor: isActive ? item.color : `${item.color}40`,
                  boxShadow: isActive
                    ? `0 0 20px ${item.color}50, 0 0 40px ${item.color}20, inset 0 1px 0 ${item.color}30`
                    : `0 4px 20px ${item.color}15, inset 0 1px 0 ${item.color}20`,
                  minWidth: "72px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.boxShadow = `0 0 24px ${item.color}60, 0 0 48px ${item.color}30, inset 0 1px 0 ${item.color}40`;
                  el.style.borderColor = item.color;
                  el.style.transform = "scale(1.1) translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.boxShadow = isActive
                    ? `0 0 20px ${item.color}50, 0 0 40px ${item.color}20, inset 0 1px 0 ${item.color}30`
                    : `0 4px 20px ${item.color}15, inset 0 1px 0 ${item.color}20`;
                  el.style.borderColor = isActive ? item.color : `${item.color}40`;
                  el.style.transform = "scale(1) translateY(0)";
                }}
              >
                {/* Scan line effect */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
                  style={{ opacity: isOpen ? 1 : 0, transition: "opacity 0.5s" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${item.color}06 3px, ${item.color}06 4px)`,
                    }}
                  />
                </div>

                <Icon
                  className="h-5 w-5 relative z-10"
                  style={{ color: item.color, filter: `drop-shadow(0 0 6px ${item.color}80)` }}
                />
                <span
                  className="text-[10px] font-semibold whitespace-nowrap relative z-10"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}`,
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Central button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 group"
        style={{
          background: isOpen
            ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))"
            : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.9))",
          boxShadow: isOpen
            ? "0 0 30px hsl(var(--primary) / 0.5), 0 0 60px hsl(var(--primary) / 0.2), inset 0 2px 0 hsl(var(--primary) / 0.3)"
            : "0 4px 20px hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.1)",
          transform: isOpen ? "scale(0.9)" : "scale(1)",
        }}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
      >
        {/* Rotating ring */}
        <div
          className="absolute inset-[-3px] rounded-full border-2 border-dashed pointer-events-none"
          style={{
            borderColor: "hsl(var(--primary) / 0.4)",
            animation: isOpen ? "spin 8s linear infinite" : "none",
          }}
        />
        {/* Pulsing ring */}
        <div
          className="absolute inset-[-8px] rounded-full pointer-events-none"
          style={{
            border: "1px solid hsl(var(--primary) / 0.2)",
            animation: isOpen ? "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" : "none",
          }}
        />
        {/* Icon */}
        <div
          className="transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-primary-foreground" />
          ) : (
            <svg className="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
            </svg>
          )}
        </div>
      </button>

      {/* CSS animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HolographicNav;
