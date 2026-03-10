import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Microscope, LayoutDashboard, ShoppingCart, CloudSun,
  Users, Landmark, X, Shield,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

import farmAerial from "@/assets/farm-aerial.jpg";
import farmCrops from "@/assets/farm-crops.jpg";
import farmResearch from "@/assets/farm-research.jpg";
import farmSustainable from "@/assets/farm-sustainable.jpg";
import farmTech from "@/assets/farm-tech.jpg";
import heroFarm from "@/assets/hero-farm.jpg";

/* ── Nav items ──────────────────────────────────────────────── */
const BASE_NAV_ITEMS = [
  { label: "Marketplace", href: "/marketplace", icon: ShoppingCart, color: "#f59e0b", desc: "Buy & sell farm products", img: farmCrops },
  { label: "Weather", href: "/weather", icon: CloudSun, color: "#06b6d4", desc: "Real-time weather forecasts", img: farmAerial },
  { label: "Community", href: "/community", icon: Users, color: "#a855f7", desc: "Connect with other farmers", img: farmSustainable },
  { label: "AI Crop Doctor", href: "/disease-detection", icon: Microscope, color: "#22c55e", desc: "Detect crop diseases with AI", img: farmResearch },
  { label: "Gov Schemes", href: "/government-schemes", icon: Landmark, color: "#ef4444", desc: "Explore government benefits", img: farmTech },
];

const FARM_DASHBOARD = { label: "Farm Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "#3b82f6", desc: "Monitor your farm stats", img: heroFarm };
const ADMIN_DASHBOARD = { label: "Admin Panel", href: "/admin", icon: Shield, color: "#3b82f6", desc: "Manage platform & users", img: heroFarm };

const HIDDEN_ROUTES = ["/auth", "/forgot-password", "/reset-password"];

/* ── Ring geometry helpers ────────────────────────────────────── */
function getArcClipPath(
  startDeg: number, endDeg: number,
  innerR: number, outerR: number,
  cx: number, cy: number, size: number,
): string {
  const pts: string[] = [];
  const steps = 24;
  const toRad = (d: number) => (d - 90) * Math.PI / 180; // -90 so 0° = top

  // Outer arc
  for (let i = 0; i <= steps; i++) {
    const a = toRad(startDeg + (endDeg - startDeg) * (i / steps));
    const x = cx + outerR * Math.cos(a);
    const y = cy + outerR * Math.sin(a);
    pts.push(`${(x / size * 100).toFixed(2)}% ${(y / size * 100).toFixed(2)}%`);
  }
  // Inner arc (reversed)
  for (let i = steps; i >= 0; i--) {
    const a = toRad(startDeg + (endDeg - startDeg) * (i / steps));
    const x = cx + innerR * Math.cos(a);
    const y = cy + innerR * Math.sin(a);
    pts.push(`${(x / size * 100).toFixed(2)}% ${(y / size * 100).toFixed(2)}%`);
  }
  return `polygon(${pts.join(", ")})`;
}

function getCenterClipPath(r: number, cx: number, cy: number, size: number): string {
  const pts: string[] = [];
  const steps = 36;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    pts.push(`${(x / size * 100).toFixed(2)}% ${(y / size * 100).toFixed(2)}%`);
  }
  return `polygon(${pts.join(", ")})`;
}

/* ── Ring segment component ──────────────────────────────────── */
function RingSegment({
  item, clipPath, isActive, isOpen, delay, onClose, midAngle,
}: {
  item: typeof FARM_DASHBOARD;
  clipPath: string;
  isActive: boolean;
  isOpen: boolean;
  delay: number;
  onClose: () => void;
  midAngle: number;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  // Position label at the midpoint of the segment arc
  const labelR = 37; // % from center
  const rad = (midAngle - 90) * Math.PI / 180;
  const labelX = 50 + labelR * Math.cos(rad);
  const labelY = 50 + labelR * Math.sin(rad);

  return (
    <Link
      to={item.href}
      onClick={onClose}
      className="absolute inset-0 transition-all duration-500"
      style={{
        clipPath,
        transform: isOpen ? "scale(1)" : "scale(0.3)",
        opacity: isOpen ? 1 : 0,
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url(${item.img})`,
          filter: hovered ? "brightness(0.6) saturate(1.3)" : isActive ? "brightness(0.5) saturate(1.2)" : "brightness(0.35) saturate(0.8)",
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }}
      />

      {/* Color overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${labelX}% ${labelY}%, ${item.color}44 0%, transparent 60%)`,
          opacity: hovered || isActive ? 1 : 0.3,
        }}
      />

      {/* Active ring glow */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 40px ${item.color}55`,
          }}
        />
      )}

      {/* Icon & Label */}
      <div
        className="absolute flex flex-col items-center gap-1 pointer-events-none transition-transform duration-300"
        style={{
          left: `${labelX}%`,
          top: `${labelY}%`,
          transform: `translate(-50%, -50%) ${hovered ? "scale(1.15)" : "scale(1)"}`,
        }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-all duration-300"
          style={{
            background: hovered ? `${item.color}55` : "hsl(0 0% 0% / 0.5)",
            border: `2px solid ${hovered || isActive ? item.color : "hsl(0 0% 100% / 0.2)"}`,
            boxShadow: hovered ? `0 0 20px ${item.color}66` : "none",
          }}
        >
          <Icon className="h-5 w-5" style={{ color: hovered || isActive ? item.color : "white" }} />
        </div>
        <span
          className="text-[10px] font-bold text-center leading-tight whitespace-nowrap"
          style={{
            color: hovered || isActive ? item.color : "white",
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
          }}
        >
          {item.label}
        </span>
      </div>
    </Link>
  );
}

/* ── Mobile tile (kept simple) ───────────────────────────────── */
function MobileNavTile({
  item, isOpen, isActive, delay, onClose,
}: {
  item: typeof FARM_DASHBOARD;
  isOpen: boolean; isActive: boolean;
  delay: number; onClose: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      onClick={onClose}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 py-3 px-2 relative overflow-hidden"
      style={{
        borderColor: isActive ? item.color : `${item.color}40`,
        transform: isOpen ? "translateY(0) scale(1)" : "translateY(30px) scale(0.85)",
        opacity: isOpen ? 1 : 0,
        transition: `transform 0.44s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
        minHeight: 90,
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${item.img})`,
          filter: "brightness(0.25) saturate(0.7)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${item.color}22, transparent)` }}
      />
      <div
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: `${item.color}30`, border: `1px solid ${item.color}50` }}
      >
        <Icon className="h-5 w-5" style={{ color: item.color }} />
      </div>
      <span
        className="relative z-10 text-[9px] font-bold text-center leading-tight"
        style={{ color: item.color, textShadow: "0 1px 4px #000" }}
      >
        {item.label}
      </span>
    </Link>
  );
}

/* ── Main HolographicNav ─────────────────────────────────────── */
const HolographicNav = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [vw, setVw] = useState(() => window.innerWidth);
  const [vh, setVh] = useState(() => window.innerHeight);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isHidden = HIDDEN_ROUTES.some((r) => location.pathname.startsWith(r));

  useEffect(() => {
    const update = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Admin role check */
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { setIsAdmin(false); return; }
      const { data } = await supabase.rpc("has_role", { _user_id: u.id, _role: "admin" as const });
      setIsAdmin(data === true);
    };
    checkAdmin();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.user) checkAdmin();
      else setIsAdmin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const NAV_ITEMS = useMemo(() => {
    const dash = isAdmin ? ADMIN_DASHBOARD : FARM_DASHBOARD;
    const items = [...BASE_NAV_ITEMS];
    items.splice(2, 0, dash);
    return items;
  }, [isAdmin]);

  /* Close on route change */
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen]);

  /* 3D tilt on mouse move over ring */
  const handleRingMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ringRef.current) return;
    const rect = ringRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: my * -12, y: mx * 12 });
  }, []);

  const handleRingMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  /* Dragging (FAB button) */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isOpen) return;
      dragStartRef.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
      hasDraggedRef.current = false;
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isOpen, position],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDraggedRef.current = true;
      const BTN_R = 28;
      const maxX = vw / 2 - BTN_R - 12;
      const maxUp = vh - 52 - 82 - BTN_R;
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, dragStartRef.current.posX + dx)),
        y: Math.max(-maxUp, Math.min(0, dragStartRef.current.posY + dy)),
      });
    },
    [vw, vh],
  );

  const handlePointerUp = useCallback(() => {
    dragStartRef.current = null;
    setIsDragging(false);
  }, []);

  const handleButtonClick = useCallback(() => {
    if (!hasDraggedRef.current) setIsOpen((p) => !p);
  }, []);

  /* Ring geometry */
  const RING_SIZE = Math.min(460, Math.min(vw - 40, vh - 120));
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;
  const outerR = RING_SIZE * 0.48;
  const innerR = RING_SIZE * 0.26;
  const centerR = RING_SIZE * 0.22;
  const GAP_DEG = 5;
  const segDeg = (360 - GAP_DEG * NAV_ITEMS.length) / NAV_ITEMS.length;

  const segments = useMemo(() => {
    return NAV_ITEMS.map((item, i) => {
      const startDeg = i * (segDeg + GAP_DEG) + GAP_DEG / 2;
      const endDeg = startDeg + segDeg;
      const midAngle = (startDeg + endDeg) / 2;
      const clipPath = getArcClipPath(startDeg, endDeg, innerR, outerR, cx, cy, RING_SIZE);
      return { item, clipPath, midAngle };
    });
  }, [NAV_ITEMS, segDeg, innerR, outerR, cx, cy, RING_SIZE]);

  const centerClipPath = useMemo(
    () => getCenterClipPath(centerR, cx, cy, RING_SIZE),
    [centerR, cx, cy, RING_SIZE],
  );

  if (isHidden || !user) return null;

  const isMobile = vw < 640;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55]"
          style={{
            background: "radial-gradient(ellipse at center, hsl(0 0% 0% / 0.82), hsl(0 0% 0% / 0.92))",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ═══ MOBILE bottom sheet ═══ */}
      {isMobile && (
        <div
          className="fixed inset-x-0 bottom-0 z-[57]"
          style={{
            transform: isOpen ? "translateY(0)" : "translateY(108%)",
            transition: "transform 0.44s cubic-bezier(0.32,0.72,0,1)",
            background: "hsl(0 0% 5% / 0.98)",
            backdropFilter: "blur(28px)",
            borderTop: "1px solid hsl(var(--primary) / 0.2)",
            borderRadius: "24px 24px 0 0",
            paddingBottom: "96px",
            boxShadow: "0 -16px 56px hsl(0 0% 0% / 0.75)",
          }}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-white/15" />
          </div>
          <div className="flex items-center justify-between px-5 py-2">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/30">Navigate</span>
            <button onClick={() => setIsOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5" aria-label="Close">
              <X className="h-3.5 w-3.5 text-white/50" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 px-4 pb-4">
            {NAV_ITEMS.map((item, i) => (
              <MobileNavTile
                key={item.href}
                item={item}
                isOpen={isOpen}
                isActive={location.pathname === item.href}
                delay={i * 50}
                onClose={() => setIsOpen(false)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══ DESKTOP: 3D Ring Navigation ═══ */}
      {!isMobile && isOpen && (
        <div
          className="fixed inset-0 z-[58] flex items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={ringRef}
            className="relative"
            style={{
              width: RING_SIZE,
              height: RING_SIZE,
              perspective: "1000px",
              pointerEvents: "auto",
            }}
            onMouseMove={handleRingMouseMove}
            onMouseLeave={handleRingMouseLeave}
          >
            <div
              className="relative w-full h-full"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: "transform 0.15s ease-out",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Outer ring segments */}
              {segments.map(({ item, clipPath, midAngle }, i) => (
                <RingSegment
                  key={item.href}
                  item={item}
                  clipPath={clipPath}
                  isActive={location.pathname === item.href}
                  isOpen={isOpen}
                  delay={i * 80}
                  onClose={() => setIsOpen(false)}
                  midAngle={midAngle}
                />
              ))}

              {/* Center circle — decorative tree/farm image */}
              <div
                className="absolute inset-0 transition-all duration-700 overflow-hidden"
                style={{
                  clipPath: centerClipPath,
                  transform: isOpen ? "scale(1)" : "scale(0)",
                  opacity: isOpen ? 1 : 0,
                  transitionDelay: `${NAV_ITEMS.length * 80 + 100}ms`,
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${heroFarm})`,
                    filter: "brightness(0.5) saturate(1.1) sepia(0.15)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="h-10 w-10 mx-auto mb-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="1.5"
                    >
                      <path d="M12 22V8" strokeLinecap="round" />
                      <path d="M9 12c-3-1-5 1-6 3 2 0 4-1 6-1" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 12c3-1 5 1 6 3-2 0-4-1-6-1" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 8c-2-3 0-6 2-7-1 3 1 5 0 7" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 8c2-3 0-6-2-7 1 3-1 5 0 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest"
                      style={{ color: "hsl(var(--primary))", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
                    >
                      AgroVision
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtle ring border lines */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{ opacity: isOpen ? 0.15 : 0, transitionDelay: "200ms" }}
              >
                <svg className="w-full h-full" viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
                  <circle
                    cx={cx} cy={cy} r={outerR}
                    fill="none" stroke="white" strokeWidth="1"
                  />
                  <circle
                    cx={cx} cy={cy} r={innerR}
                    fill="none" stroke="white" strokeWidth="1"
                  />
                  <circle
                    cx={cx} cy={cy} r={centerR}
                    fill="none" stroke="hsl(142, 64%, 38%)" strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FAB trigger button ═══ */}
      <div
        ref={containerRef}
        className="fixed z-[60]"
        style={{
          bottom: 24,
          left: "50%",
          transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
          touchAction: "none",
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={handleButtonClick}
              className="relative h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 touch-none select-none"
              style={{
                background: isOpen
                  ? "linear-gradient(135deg, hsl(var(--primary) / 0.95), hsl(var(--primary) / 0.7))"
                  : "linear-gradient(135deg, hsl(var(--primary) / 0.8), hsl(var(--primary) / 0.55))",
                boxShadow: isOpen
                  ? "0 0 30px hsl(var(--primary) / 0.5), 0 0 60px hsl(var(--primary) / 0.2)"
                  : "0 4px 18px hsl(var(--primary) / 0.38), 0 0 36px hsl(var(--primary) / 0.1)",
                transform: isOpen ? "scale(0.88)" : "scale(1)",
              }}
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
            >
              {/* Spinning orbit ring */}
              <div
                className="absolute inset-[-3px] rounded-full border-2 border-dashed pointer-events-none"
                style={{
                  borderColor: "hsl(var(--primary) / 0.35)",
                  animation: isOpen ? "ring-spin 8s linear infinite" : "none",
                }}
              />

              {/* Outer pulse */}
              <div
                className="absolute inset-[-8px] rounded-full pointer-events-none border border-primary/15"
                style={{ animation: isOpen ? "ring-ping 2s cubic-bezier(0,0,0.2,1) infinite" : "none" }}
              />

              {/* Hint dots */}
              {!isOpen && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-40">
                  {[0, 1, 2].map((d) => (
                    <div key={d} className="h-1 w-1 rounded-full bg-primary-foreground" />
                  ))}
                </div>
              )}

              <div className="transition-transform duration-300" style={{ transform: isOpen ? "rotate(135deg)" : "none" }}>
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
            <TooltipContent side="top" className="font-semibold text-xs">
              {isMobile ? "Tap to navigate" : "Drag to move · Click to open"}
            </TooltipContent>
          )}
        </Tooltip>

        <style>{`
          @keyframes ring-spin { to { transform: rotate(360deg); } }
          @keyframes ring-ping { 75%, 100% { transform: scale(1.5); opacity: 0; } }
        `}</style>
      </div>
    </>
  );
};

export default HolographicNav;
