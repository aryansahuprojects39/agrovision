import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Microscope, LayoutDashboard, ShoppingCart, CloudSun, Users, Landmark, X, GripVertical } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { label: "AI Crop Doctor", href: "/disease-detection", icon: Microscope, color: "#22c55e" },
  { label: "Farm Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "#3b82f6" },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingCart, color: "#f59e0b" },
  { label: "Weather", href: "/weather", icon: CloudSun, color: "#06b6d4" },
  { label: "Community", href: "/community", icon: Users, color: "#a855f7" },
  { label: "Gov Schemes", href: "/government-schemes", icon: Landmark, color: "#ef4444" },
];

const HIDDEN_ROUTES = ["/auth", "/admin", "/forgot-password", "/reset-password"];

const HolographicNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isHidden = HIDDEN_ROUTES.some((r) => location.pathname.startsWith(r));

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isOpen) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
    hasDraggedRef.current = false;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isOpen, position]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDraggedRef.current = true;
    }
    const newX = dragStartRef.current.posX + dx;
    const newY = dragStartRef.current.posY + dy;
    // Clamp to viewport
    const halfW = 28;
    const maxX = window.innerWidth / 2 - halfW;
    const maxY = window.innerHeight / 2 - halfW - 24;
    setPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragStartRef.current = null;
    setIsDragging(false);
  }, []);

  const handleButtonClick = useCallback(() => {
    if (!hasDraggedRef.current) {
      setIsOpen((prev) => !prev);
    }
  }, []);

  const totalItems = NAV_ITEMS.length;
  const arcSpread = 180;
  const startAngle = -90 - arcSpread / 2;
  const radius = 200;

  if (isHidden) return null;

  return (
    <>
      {/* Dark backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99] transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.12) 0%, hsl(0 0% 0% / 0.6) 100%)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        ref={containerRef}
        className="fixed z-[100]"
        style={{
          bottom: "24px",
          left: "50%",
          transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
        }}
      >
        {/* Menu items */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4" style={{ width: 0, height: 0 }}>
          {NAV_ITEMS.map((item, i) => {
            const angle = startAngle + (arcSpread / (totalItems - 1)) * i;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

              <NavCard
                key={item.href}
                item={item}
                isOpen={isOpen}
                isActive={isActive}
                x={x}
                y={y}
                delay={i * 60}
                onClose={() => setIsOpen(false)}
              />
                      }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Central button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={handleButtonClick}
              className="relative h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 group touch-none select-none"
              style={{
                background: isOpen
                  ? "linear-gradient(135deg, hsl(var(--primary) / 0.85), hsl(var(--primary) / 0.65))"
                  : "linear-gradient(135deg, hsl(var(--primary) / 0.7), hsl(var(--primary) / 0.55))",
                boxShadow: isOpen
                  ? "0 0 30px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.15), inset 0 2px 0 hsl(var(--primary) / 0.2)"
                  : "0 4px 20px hsl(var(--primary) / 0.3), 0 0 40px hsl(var(--primary) / 0.08)",
                transform: isOpen ? "scale(0.9)" : "scale(1)",
                backdropFilter: "blur(8px)",
              }}
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
            >
              <div
                className="absolute inset-[-3px] rounded-full border-2 border-dashed pointer-events-none"
                style={{
                  borderColor: "hsl(var(--primary) / 0.3)",
                  animation: isOpen ? "holo-spin 8s linear infinite" : "none",
                }}
              />
              <div
                className="absolute inset-[-8px] rounded-full pointer-events-none"
                style={{
                  border: "1px solid hsl(var(--primary) / 0.15)",
                  animation: isOpen ? "holo-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" : "none",
                }}
              />
              {/* Drag indicator dots */}
              {!isOpen && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-40">
                  <div className="h-1 w-1 rounded-full bg-primary-foreground" />
                  <div className="h-1 w-1 rounded-full bg-primary-foreground" />
                  <div className="h-1 w-1 rounded-full bg-primary-foreground" />
                </div>
              )}
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
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="top" className="font-semibold">
              Drag to move • Click to open
            </TooltipContent>
          )}
        </Tooltip>

        <style>{`
          @keyframes holo-spin {
            to { transform: rotate(360deg); }
          }
          @keyframes holo-ping {
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default HolographicNav;
