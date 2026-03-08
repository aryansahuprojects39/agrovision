import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Microscope, LayoutDashboard, ShoppingCart, CloudSun, Users, Landmark, X } from "lucide-react";
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

// 3D tilt card for nav items
function NavCard({
  item,
  isOpen,
  isActive,
  x,
  y,
  delay,
  onClose,
}: {
  item: (typeof NAV_ITEMS)[0];
  isOpen: boolean;
  isActive: boolean;
  x: number;
  y: number;
  delay: number;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    cardRef.current.style.transform = `perspective(400px) rotateY(${mx * 12}deg) rotateX(${-my * 12}deg) scale(1.08)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(400px) rotateY(0deg) rotateX(0deg) scale(1)";
  };

  return (
    <Link
      to={item.href}
      onClick={onClose}
      className="absolute group"
      style={{
        transform: isOpen
          ? `translate(${x}px, ${y}px) scale(1)`
          : `translate(0px, 0px) scale(0)`,
        opacity: isOpen ? 1 : 0,
        transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
        left: "0px",
        top: "0px",
        marginLeft: "-50px",
        marginTop: "-35px",
      }}
    >
      <div
        ref={cardRef}
        className="relative flex flex-col items-center gap-2 px-4 py-3.5 rounded-2xl border cursor-pointer"
        style={{
          background: `linear-gradient(145deg, ${item.color}30, ${item.color}12 40%, hsl(0 0% 8% / 0.85))`,
          borderColor: isActive ? item.color : `${item.color}50`,
          boxShadow: isActive
            ? `0 8px 32px ${item.color}40, 0 0 48px ${item.color}15, inset 0 1px 0 ${item.color}40`
            : `0 8px 24px hsl(0 0% 0% / 0.4), 0 0 20px ${item.color}15, inset 0 1px 0 ${item.color}25`,
          width: "100px",
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
          backdropFilter: "blur(16px)",
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Holographic scan lines */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-30">
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${item.color}10 2px, ${item.color}10 3px)`,
            }}
          />
        </div>

        {/* Glow orb behind icon */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full blur-xl pointer-events-none"
          style={{ background: item.color, opacity: 0.25 }}
        />

        <Icon
          className="h-6 w-6 relative z-10"
          style={{ color: item.color, filter: `drop-shadow(0 0 8px ${item.color})` }}
        />
        <span
          className="text-xs font-bold whitespace-nowrap relative z-10"
          style={{ color: item.color, textShadow: `0 0 12px ${item.color}60` }}
        >
          {item.label}
        </span>

        {isActive && (
          <div
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full"
            style={{
              backgroundColor: item.color,
              boxShadow: `0 0 10px ${item.color}, 0 0 20px ${item.color}60`,
            }}
          />
        )}
      </div>
    </Link>
  );
}

const HolographicNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isHidden = HIDDEN_ROUTES.some((r) => location.pathname.startsWith(r));

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

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
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDraggedRef.current = true;
    const newX = dragStartRef.current.posX + dx;
    const newY = dragStartRef.current.posY + dy;
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
    if (!hasDraggedRef.current) setIsOpen((prev) => !prev);
  }, []);

  const totalItems = NAV_ITEMS.length;

  // Arc layout that adapts direction and clamps to viewport
  const getItemPositions = () => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vh = typeof window !== "undefined" ? window.innerHeight : 720;
    const cx = vw / 2 + position.x; // button X in viewport
    const cy = vh - 24 - 28 + position.y; // button Y in viewport

    // Point arc toward viewport center
    const toCenterX = vw / 2 - cx;
    const toCenterY = vh / 2 - cy;
    let centerAngle = (Math.atan2(toCenterY, toCenterX) * 180) / Math.PI;
    if (Math.abs(toCenterX) < 100 && Math.abs(toCenterY) < 100) {
      centerAngle = -90;
    }

    // Scale radius down when near edges so items fit
    const margin = 60; // min distance from viewport edge
    const itemHalfW = 50;
    const itemHalfH = 40;
    const maxReachRight = vw - cx - margin - itemHalfW;
    const maxReachLeft = cx - margin - itemHalfW;
    const maxReachUp = cy - margin - itemHalfH;
    const maxReachDown = vh - cy - margin - itemHalfH;
    const maxReach = Math.max(120, Math.min(maxReachRight, maxReachLeft, maxReachUp, maxReachDown, 220));
    const radius = Math.min(220, maxReach);

    const arcSpread = 140;
    const startAngle = centerAngle - arcSpread / 2;

    const positions = [];
    for (let i = 0; i < totalItems; i++) {
      const angle = startAngle + (arcSpread / (totalItems - 1)) * i;
      const rad = (angle * Math.PI) / 180;
      let ix = Math.cos(rad) * radius;
      let iy = Math.sin(rad) * radius;

      // Clamp each item to stay within viewport
      const itemLeft = cx + ix - itemHalfW;
      const itemRight = cx + ix + itemHalfW;
      const itemTop = cy + iy - itemHalfH;
      const itemBottom = cy + iy + itemHalfH;

      if (itemLeft < margin) ix += margin - itemLeft;
      if (itemRight > vw - margin) ix -= itemRight - (vw - margin);
      if (itemTop < margin) iy += margin - itemTop;
      if (itemBottom > vh - margin) iy -= itemBottom - (vh - margin);

      positions.push({ x: ix, y: iy });
    }
    return positions;
  };

  const itemPositions = getItemPositions();

  if (isHidden) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99] transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.12) 0%, hsl(0 0% 0% / 0.7) 100%)",
            backdropFilter: "blur(6px)",
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: 0, height: 0 }}>
          {NAV_ITEMS.map((item, i) => {
            const { x, y } = itemPositions[i];
            const isActive = location.pathname === item.href;
            return (
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
                  ? "0 0 30px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.15)"
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
          @keyframes holo-spin { to { transform: rotate(360deg); } }
          @keyframes holo-ping { 75%, 100% { transform: scale(1.5); opacity: 0; } }
        `}</style>
      </div>
    </>
  );
};

export default HolographicNav;
