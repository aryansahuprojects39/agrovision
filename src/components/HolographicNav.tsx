import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Microscope, LayoutDashboard, ShoppingCart, CloudSun, Users, Landmark, X } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { label: "Marketplace", href: "/marketplace", icon: ShoppingCart, color: "#f59e0b", desc: "Buy & sell farm products" },
  { label: "Weather", href: "/weather", icon: CloudSun, color: "#06b6d4", desc: "Real-time weather forecasts" },
  { label: "Farm Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "#3b82f6", desc: "Monitor your farm stats" },
  { label: "Community", href: "/community", icon: Users, color: "#a855f7", desc: "Connect with other farmers" },
  { label: "AI Crop Doctor", href: "/disease-detection", icon: Microscope, color: "#22c55e", desc: "Detect crop diseases with AI" },
  { label: "Gov Schemes", href: "/government-schemes", icon: Landmark, color: "#ef4444", desc: "Explore government benefits" },
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
    <Tooltip>
      <TooltipTrigger asChild>
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
            className="relative flex flex-col items-center gap-2.5 px-5 py-4 rounded-2xl border cursor-pointer"
            style={{
              background: `linear-gradient(145deg, ${item.color}50, ${item.color}25 40%, hsl(0 0% 4% / 0.97))`,
              borderColor: isActive ? item.color : `${item.color}80`,
              borderWidth: "2px",
              boxShadow: isActive
                ? `0 8px 36px ${item.color}50, 0 0 60px ${item.color}25, inset 0 1px 0 ${item.color}50`
                : `0 8px 28px hsl(0 0% 0% / 0.5), 0 0 30px ${item.color}25, inset 0 1px 0 ${item.color}35`,
              width: "115px",
              transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
              backdropFilter: "blur(20px)",
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
              className="h-7 w-7 relative z-10"
              style={{ color: item.color, filter: `drop-shadow(0 0 12px ${item.color}) drop-shadow(0 0 24px ${item.color}) brightness(1.3)` }}
            />
            <span
              className="text-sm font-extrabold whitespace-nowrap relative z-10"
              style={{ color: item.color, textShadow: `0 0 8px ${item.color}, 0 0 20px ${item.color}, 0 0 40px ${item.color}90, 0 0 60px ${item.color}50`, filter: "brightness(1.3)", WebkitTextStroke: "0.5px hsl(0 0% 0%)" }}
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
      </TooltipTrigger>
      <TooltipContent side="bottom" className="font-semibold text-xs">
        {item.desc}
      </TooltipContent>
    </Tooltip>
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

  // Adaptive arc layout: semicircle at edges, full circle when centered
  const getItemPositions = () => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vh = typeof window !== "undefined" ? window.innerHeight : 720;
    const cx = vw / 2 + position.x;
    const cy = vh - 24 - 28 + position.y;

    const count = NAV_ITEMS.length;
    const margin = 60;
    const itemHalfW = 55;
    const itemHalfH = 42;

    // How centered is the button? (0 = edge, 1 = perfect center)
    const edgeMargin = 120;
    const centerX = Math.max(0, Math.min(1, 1 - Math.abs(cx - vw / 2) / (vw / 2 - edgeMargin)));
    const centerY = Math.max(0, Math.min(1, 1 - Math.abs(cy - vh / 2) / (vh / 2 - edgeMargin)));
    const centeredness = Math.min(centerX, centerY);

    const radius = 300;
    const innerRadius = 180;

    // Detect position zones
    const distTop = cy;
    const distBottom = vh - cy;
    const distLeft = cx;
    const distRight = vw - cx;
    const cornerThreshold = 200;
    const isCorner =
      Math.min(distTop, distBottom) < cornerThreshold &&
      Math.min(distLeft, distRight) < cornerThreshold;

    if (isCorner) {
      // Quadrant: 90° arc, two rings (outer 3 + inner 3)
      const nearTop = distTop < distBottom;
      const nearLeft = distLeft < distRight;
      // Base angle points diagonally away from corner
      const baseAngle = nearTop
        ? nearLeft ? -Math.PI / 4 : -3 * Math.PI / 4  // bottom-right / bottom-left
        : nearLeft ? Math.PI / 4 : 3 * Math.PI / 4;    // top-right / top-left

      const quadSpread = Math.PI / 2; // 90°

      return NAV_ITEMS.map((_, i) => {
        const isOuter = i < 3;
        const r = isOuter ? radius : innerRadius;
        const idx = isOuter ? i : i - 3;
        const angle = baseAngle - quadSpread / 2 + (idx / 2) * quadSpread;
        let x = Math.cos(angle) * r;
        let y = -Math.sin(angle) * r;

        // Clamp
        if (cx + x - itemHalfW < margin) x = margin - cx + itemHalfW;
        if (cx + x + itemHalfW > vw - margin) x = vw - margin - cx - itemHalfW;
        if (cy + y - itemHalfH < margin) y = margin - cy + itemHalfH;
        if (cy + y + itemHalfH > vh - margin) y = vh - margin - cy - itemHalfH;

        return { x, y };
      });
    }

    const isCircle = centeredness > 0.5;
    const spreadAngle = isCircle ? 2 * Math.PI : Math.PI;

    const minDist = Math.min(distTop, distBottom, distLeft, distRight);
    let baseAngle: number;
    let yOffset = 0;
    let xOffset = 0;

    if (isCircle) {
      baseAngle = Math.PI / 2;
    } else if (minDist === distBottom) {
      baseAngle = Math.PI / 2;
      yOffset = -50;
    } else if (minDist === distTop) {
      baseAngle = -Math.PI / 2;
      yOffset = 50;
    } else if (minDist === distLeft) {
      baseAngle = 0;
      xOffset = 50;
    } else {
      baseAngle = Math.PI;
      xOffset = -50;
    }

    return NAV_ITEMS.map((_, i) => {
      const angle = isCircle
        ? baseAngle + spreadAngle / 2 - (i / count) * spreadAngle
        : baseAngle + spreadAngle / 2 - (i / (count - 1)) * spreadAngle;
      let x = Math.cos(angle) * radius + xOffset;
      let y = -Math.sin(angle) * radius + yOffset;

      if (cx + x - itemHalfW < margin) x = margin - cx + itemHalfW;
      if (cx + x + itemHalfW > vw - margin) x = vw - margin - cx - itemHalfW;
      if (cy + y - itemHalfH < margin) y = margin - cy + itemHalfH;
      if (cy + y + itemHalfH > vh - margin) y = vh - margin - cy - itemHalfH;

      return { x, y };
    });
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
