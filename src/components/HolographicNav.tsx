import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Microscope, LayoutDashboard, ShoppingCart, CloudSun, Users, Landmark, X, Shield } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const BASE_NAV_ITEMS = [
  { label: "Marketplace", href: "/marketplace", icon: ShoppingCart, color: "#f59e0b", desc: "Buy & sell farm products" },
  { label: "Weather", href: "/weather", icon: CloudSun, color: "#06b6d4", desc: "Real-time weather forecasts" },
  { label: "Community", href: "/community", icon: Users, color: "#a855f7", desc: "Connect with other farmers" },
  { label: "AI Crop Doctor", href: "/disease-detection", icon: Microscope, color: "#22c55e", desc: "Detect crop diseases with AI" },
  { label: "Gov Schemes", href: "/government-schemes", icon: Landmark, color: "#ef4444", desc: "Explore government benefits" },
];

const FARM_DASHBOARD = { label: "Farm Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "#3b82f6", desc: "Monitor your farm stats" };
const ADMIN_DASHBOARD = { label: "Admin Panel", href: "/admin", icon: Shield, color: "#3b82f6", desc: "Manage platform & users" };

/* ── Responsive card dimensions ─────────────────────────────── */
function getCardSize(vw: number) {
  if (vw < 360) return { w: 80, h: 72 };
  if (vw < 480) return { w: 90, h: 78 };
  if (vw < 640) return { w: 100, h: 84 };
  return { w: 112, h: 92 };
}

/*
 * ══════════════════════════════════════════════════════════════════
 * DESKTOP POSITION ENGINE  —  circular · arc · quadrant
 *
 * 9-zone spatial logic:
 *   4 corners → 90° quadrant fan (opens toward viewport interior)
 *   4 edges   → 162° arc (opens away from the wall)
 *   centre    → 360° full circle
 *
 * Guarantees:
 *   • Radius auto-expands sweep if cards would otherwise overlap.
 *   • Radius is capped at 48% of the smaller safe dimension so cards
 *     never fly off screen and get clamped onto each other.
 *   • AABB collision resolver runs as a safety-net after clamping.
 * ══════════════════════════════════════════════════════════════════
 */
function desktopPositions(
  count: number,
  vw: number,
  vh: number,
  cx: number,
  cy: number,
): { x: number; y: number }[] {
  if (count === 0) return [];
  const { w: cW, h: cH } = getCardSize(vw);

  const NAVBAR_H = 72;
  const safe = { top: NAVBAR_H + 10, bottom: 26, left: 14, right: 14 };
  const availW = vw - safe.left - safe.right;
  const availH = vh - safe.top - safe.bottom;

  // Hard cap: cards must stay within 48 % of the smaller available dimension
  const MAX_R = Math.min(availW, availH) * 0.48;
  const diag     = Math.sqrt(cW * cW + cH * cH);
  const CARD_GAP = 22; // guaranteed visual gap between neighbouring card bboxes

  /** Absolute pos → relative-to-button, clamped to safe zone */
  const clampAbs = (ax: number, ay: number) => ({
    x: Math.max(safe.left  + cW / 2, Math.min(vw - safe.right  - cW / 2, ax)) - cx,
    y: Math.max(safe.top   + cH / 2, Math.min(vh - safe.bottom - cH / 2, ay)) - cy,
  });

  if (count === 1) {
    // Single item: place directly above the button
    return [clampAbs(cx, cy - Math.max(160, MAX_R * 0.6))];
  }

  const PI = Math.PI;
  const Q  = PI / 2;

  const nx = cx / vw;   // 0 = left edge …  1 = right edge
  const ny = cy / vh;   // 0 = top  edge …  1 = bottom edge
  const T  = 0.26;      // zone threshold (26 % from each edge)

  const onL = nx < T;
  const onR = nx > 1 - T;
  const onT = ny < T;
  const onB = ny > 1 - T;
  const isCorner = (onL || onR) && (onT || onB);
  const isCenter = !onL && !onR && !onT && !onB;

  /*
   * mid = the angle the arc CENTER points toward.
   * Convention: math coords (right = 0°, CCW positive, up = 90°).
   * On screen:  dx = cos(mid)·R   (positive → right)
   *             dy = -sin(mid)·R  (negative → upward on screen)
   *
   * Correct corner directions (fan toward the open interior):
   *   top-left     → SE (right + down on screen) = -45°
   *   top-right    → SW (left  + down)           = -135°
   *   bottom-left  → NE (right + up)             = +45°
   *   bottom-right → NW (left  + up)             = +135°
   */
  let mid: number;
  if      (onL && onT) mid = -PI / 4;        // top-left    → SE
  else if (onR && onT) mid = -(3 * PI / 4);  // top-right   → SW
  else if (onL && onB) mid =  PI / 4;        // bottom-left → NE
  else if (onR && onB) mid =  3 * PI / 4;    // bottom-right→ NW
  else if (onL)        mid =  0;             // left edge   → rightward arc
  else if (onR)        mid =  PI;            // right edge  → leftward arc
  else if (onT)        mid = -Q;             // top edge    → downward arc
  else                 mid =  Q;             // bottom/centre → upward arc

  /*
   * baseSweep:
   *   corner → 90°  (quadrant)
   *   edge   → 162° (0.9π — endpoints not exactly horizontal so they clear
   *                   the button-level boundary without clamping)
   *   centre → 360° (full circle)
   */
  const baseSweep = isCorner ? Q : isCenter ? 2 * PI : PI * 0.9;

  /*
   * Adaptive sweep expansion:
   * If baseSweep is so narrow that minR(baseSweep) > MAX_R, widen sweep
   * until minR fits within MAX_R.
   *   minR(step) = (diag+GAP)/(2·sin(step/2)) ≤ MAX_R
   *   ↔  step ≥ 2·arcsin((diag+GAP) / (2·MAX_R))
   */
  const sinArg   = Math.min(0.98, (diag + CARD_GAP) / (2 * MAX_R));
  const minStep  = 2 * Math.asin(sinArg);
  const minSweep = (count - 1) * minStep;
  const sweep    = Math.max(baseSweep, minSweep);

  // Determine R from the finalised sweep
  const isFullCircle = sweep >= 2 * PI - 0.01;
  const stepAngle    = isFullCircle ? sweep / count : sweep / (count - 1);
  const minR  = (diag + CARD_GAP) / (2 * Math.sin(stepAngle / 2));
  const baseR = vw < 1024 ? 196 : 252;
  const R     = Math.min(MAX_R, Math.max(baseR, minR));

  // Place items on the arc
  const positions: { x: number; y: number }[] = Array.from({ length: count }, (_, i) => {
    // Full circle: use i/count so start ≠ end (no duplicate positions)
    const t = isFullCircle ? i / count : i / (count - 1);
    const a = isFullCircle
      ? mid + 2 * PI * t
      : mid - sweep / 2 + sweep * t;
    return clampAbs(cx + Math.cos(a) * R, cy - Math.sin(a) * R);
  });

  /*
   * ── AABB overlap resolver ────────────────────────────────────────
   * Clamping can push cards from different arc positions to the same
   * boundary point. This iterative pass separates any overlapping pair
   * by nudging them apart along their smaller overlap axis.
   */
  const minDX = cW + 8;   // minimum required horizontal separation
  const minDY = cH + 8;   // minimum required vertical separation
  for (let iter = 0; iter < 20; iter++) {
    let moved = false;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const ox = minDX - Math.abs(dx);
        const oy = minDY - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          // Push apart along the axis with the smaller overlap
          if (ox <= oy) {
            const push = ox / 2 + 1;
            const sign = dx >= 0 ? 1 : -1;
            positions[i].x -= sign * push;
            positions[j].x += sign * push;
          } else {
            const push = oy / 2 + 1;
            const sign = dy >= 0 ? 1 : -1;
            positions[i].y -= sign * push;
            positions[j].y += sign * push;
          }
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  // Re-clamp after collision resolution so no card exits the safe zone
  return positions.map(({ x, y }) => clampAbs(cx + x, cy + y));
}

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * MOBILE LAYOUT: shape-based geometry
 *
 * The sheet is fixed, so mobile positions aren't actually used for rendering —
 * the sheet handles placement. But we compute the "shape name" so the sheet
 * header label can show it, and the tile animation can match the shape.
 *
 * Shape selection by item count & button zone:
 *
 *  count=1  → single centred card (dot)
 *  count=2  → LINE (horizontal)
 *  count=3  → TRIANGLE (equilateral pointing up/down based on space)
 *  count=4  → SQUARE (2×2 grid)
 *  count=5  → RHOMBUS (diamond: 1-2-1-1 or pentagon-like 1-3-1)
 *  count=6  → RECTANGLE (2×3 or 3×2 depending on orientation)
 *  count≥7  → RECTANGLE (fill rows)
 * ─────────────────────────────────────────────────────────────────────────────
 */
export type MobileShape = "dot" | "line" | "triangle" | "square" | "rhombus" | "rectangle";

export function getMobileShape(count: number): MobileShape {
  if (count <= 1) return "dot";
  if (count === 2) return "line";
  if (count === 3) return "triangle";
  if (count === 4) return "square";
  if (count === 5) return "rhombus";
  return "rectangle";
}

/*
 * Returns a grid layout descriptor: array of row arrays, each row is an array
 * of item indices. Determines the visual pattern shown in the bottom sheet.
 */
export function getMobileGrid(count: number, shape: MobileShape): number[][] {
  switch (shape) {
    case "dot":     return [[0]];
    case "line":    return [Array.from({ length: count }, (_, i) => i)];
    case "triangle":
      // 1 on top, 2 on bottom (pointing down) — reads top-to-bottom
      return [[0], [1, 2]];
    case "square":
      return [[0, 1], [2, 3]];
    case "rhombus":
      // Diamond: 1 – 2 – 1 – 1 → but 5 items: top 1, mid 3, bot 1
      return [[0], [1, 2, 3], [4]];
    case "rectangle": {
      // Prefer landscape (fewer rows) when count fits cleanly
      const cols = count <= 6 ? 3 : count <= 8 ? 4 : 3;
      const rows: number[][] = [];
      for (let r = 0; r < Math.ceil(count / cols); r++) {
        const row: number[] = [];
        for (let c = 0; c < cols && r * cols + c < count; c++) row.push(r * cols + c);
        rows.push(row);
      }
      return rows;
    }
    default:
      return [Array.from({ length: count }, (_, i) => i)];
  }
}

/* ── Shared position engine (desktop only — mobile uses bottom sheet) ── */
function computeItemPositions(
  count: number,
  vw: number,
  vh: number,
  cx: number,
  cy: number,
): { x: number; y: number }[] {
  if (vw >= 640) return desktopPositions(count, vw, vh, cx, cy);
  // Mobile: not used for rendering but return zeroes to keep array length consistent
  return Array.from({ length: count }, () => ({ x: 0, y: 0 }));
}


const HIDDEN_ROUTES = ["/auth", "/forgot-password", "/reset-password"];

/* ── Desktop arc card ────────────────────────────────────────── */
function NavCard({
  item, isOpen, isActive, x, y, delay, onClose, vw, index, total,
}: {
  item: typeof FARM_DASHBOARD;
  isOpen: boolean;
  isActive: boolean;
  x: number; y: number; delay: number;
  onClose: () => void;
  vw: number;
  index: number; total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;
  const { w: cW, h: cH } = getCardSize(vw);
  // Fan burst: each card starts at a unique rotation offset around the button
  const burstAngle = ((index - (total - 1) / 2) / Math.max(total - 1, 1)) * 60;

  const tilt = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    cardRef.current.style.transform = `perspective(400px) rotateY(${mx * 12}deg) rotateX(${-my * 12}deg) scale(1.08)`;
  };

  const resetTilt = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={item.href}
          onClick={onClose}
          className="absolute"
          style={{
            left: 0, top: 0,
            marginLeft: `-${cW / 2}px`,
            marginTop: `-${cH / 2}px`,
            transform: isOpen
              ? `translate(${x}px,${y}px) scale(1) rotate(0deg)`
              : `translate(0,0) scale(0) rotate(${burstAngle}deg)`,
            opacity: isOpen ? 1 : 0,
            transition: `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
          }}
        >
          <div
            ref={cardRef}
            className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 cursor-pointer overflow-hidden"
            style={{
              width: cW, height: cH,
              background: `linear-gradient(145deg, ${item.color}55 0%, ${item.color}20 45%, hsl(0 0% 5% / 0.96))`,
              borderColor: isActive ? item.color : `${item.color}70`,
              boxShadow: isActive
                ? `0 6px 32px ${item.color}55, inset 0 1px 0 ${item.color}50`
                : `0 6px 24px hsl(0 0% 0% / 0.55), 0 0 28px ${item.color}20, inset 0 1px 0 ${item.color}30`,
              backdropFilter: "blur(18px)",
              transformStyle: "preserve-3d",
              transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
            }}
            onMouseMove={tilt}
            onMouseLeave={resetTilt}
          >
            {/* Holographic scan lines */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl opacity-20"
              style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${item.color}15 2px, ${item.color}15 3px)` }}
            />
            {/* Glow orb */}
            <div
              className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full blur-xl pointer-events-none"
              style={{ background: item.color, opacity: 0.2 }}
            />
            <Icon
              className={cn("relative z-10", cW < 100 ? "h-5 w-5" : "h-6 w-6")}
              style={{ color: item.color, filter: `drop-shadow(0 0 5px ${item.color})` }}
            />
            <span
              className={cn(
                "relative z-10 font-bold text-center leading-tight px-1",
                cW < 95 ? "text-[8px]" : cW < 108 ? "text-[10px]" : "text-[11px]",
              )}
              style={{
                color: item.color,
                textShadow: "0 1px 3px #000, -1px 0 2px #000, 1px 0 2px #000",
                maxWidth: cW - 8,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                display: "block",
              }}
            >
              {item.label}
            </span>
            <div
              className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full"
              style={{ background: item.color, boxShadow: `0 0 6px ${item.color}`, opacity: isActive ? 1 : 0.4 }}
            />
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs font-semibold">
        {item.desc}
      </TooltipContent>
    </Tooltip>
  );
}

/* ── Mobile bottom-sheet tile ────────────────────────────────── */
function MobileNavTile({
  item, isOpen, isActive, delay, onClose, animOriginY,
}: {
  item: typeof FARM_DASHBOARD;
  isOpen: boolean; isActive: boolean;
  delay: number; onClose: () => void;
  /** translateY start for entrance animation, varies by shape row */
  animOriginY: number;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      onClick={onClose}
      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 py-3 px-2"
      style={{
        background: `linear-gradient(145deg, ${item.color}35 0%, ${item.color}12 55%, hsl(0 0% 6%/0.98))`,
        borderColor: isActive ? item.color : `${item.color}45`,
        boxShadow: isActive
          ? `0 4px 20px ${item.color}45, inset 0 1px 0 ${item.color}40`
          : `0 2px 12px hsl(0 0% 0%/0.4), inset 0 1px 0 ${item.color}18`,
        transform: isOpen
          ? "translateY(0) scale(1)"
          : `translateY(${animOriginY}px) scale(0.82)`,
        opacity: isOpen ? 1 : 0,
        transition: `transform 0.44s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.3s ease ${delay}ms`,
        minHeight: 84,
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: `${item.color}22`, boxShadow: `0 0 16px ${item.color}28` }}
      >
        <Icon className="h-5 w-5" style={{ color: item.color, filter: `drop-shadow(0 0 5px ${item.color})` }} />
      </div>
      <span
        className="text-[9px] font-bold text-center leading-tight"
        style={{ color: item.color, textShadow: "0 1px 4px #000", wordBreak: "break-word" }}
      >
        {item.label}
      </span>
      {isActive && (
        <div className="h-1 w-1 rounded-full" style={{ background: item.color, boxShadow: `0 0 5px ${item.color}` }} />
      )}
    </Link>
  );
}

/* Shape badge label */
const SHAPE_LABEL: Record<MobileShape, string> = {
  dot: "Single",
  line: "Line",
  triangle: "Triangle",
  square: "Square",
  rhombus: "Rhombus",
  rectangle: "Grid",
};

/* ── HolographicNav ──────────────────────────────────────────── */
const HolographicNav = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [vw, setVw] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1280));
  const [vh, setVh] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 720));
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isHidden = HIDDEN_ROUTES.some((r) => location.pathname.startsWith(r));

  /* Track viewport size so positions recompute on resize / orientation change */
  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
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

  /* Dragging */
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
      const EDGE_PAD = 12;
      const NAVBAR_H = 72;
      // Max horizontal offset so button stays within viewport
      const maxX = vw / 2 - BTN_R - EDGE_PAD;
      // Max upward offset so button stays below navbar
      //   default bottom centre = vh - 52; must stay ≥ NAVBAR_H + BTN_R
      //   → position.y ≥ -(vh - 52 - NAVBAR_H - BTN_R)
      const maxUp = vh - 52 - NAVBAR_H - BTN_R - EDGE_PAD;
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

  /*
   * Button sits at bottom:24px, height 56px → centre Y = vh - 24 - 28 = vh - 52.
   * position.y is a drag offset (clamped ≤ 0 so button never goes below its resting place).
   */
  const BTN_CY = vh - 52 + position.y;
  const BTN_CX = vw / 2 + position.x;

  /* Compute item positions (memoised — updates on viewport / button move / item count change) */
  const itemPositions = useMemo(
    () => computeItemPositions(NAV_ITEMS.length, vw, vh, BTN_CX, BTN_CY),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [NAV_ITEMS.length, vw, vh, position.x, position.y],
  );

  if (isHidden || !user) return null;

  const isMobile = vw < 640;

  // Mobile shape layout (computed even on desktop to keep hook order stable)
  const mobileShape = getMobileShape(NAV_ITEMS.length);
  const mobileGrid  = getMobileGrid(NAV_ITEMS.length, mobileShape);
  // Flat map: for each item index return which row it lives in (for stagger/animation)
  const itemRowMap: number[] = [];
  mobileGrid.forEach((row, ri) => row.forEach((idx) => { itemRowMap[idx] = ri; }));
  const totalRows = mobileGrid.length;

  return (
    <>
      {/* ── Shared backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55]"
          style={{
            background: isMobile
              ? "hsl(0 0% 0%/0.65)"
              : "radial-gradient(ellipse at bottom, hsl(var(--primary)/0.08), hsl(0 0% 0%/0.68))",
            backdropFilter: isMobile ? "blur(4px)" : "blur(5px)",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ════════════════════════════════════════════════════════════
          MOBILE — shape-aware slide-up bottom sheet
          Shape: dot | line | triangle | square | rhombus | rectangle
          ════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div
          className="fixed inset-x-0 bottom-0 z-[57]"
          style={{
            transform: isOpen ? "translateY(0)" : "translateY(108%)",
            transition: "transform 0.44s cubic-bezier(0.32,0.72,0,1)",
            background: "hsl(0 0% 7%/0.97)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            borderTop: "1px solid hsl(var(--primary)/0.2)",
            borderRadius: "24px 24px 0 0",
            paddingBottom: "96px",
            boxShadow: "0 -16px 56px hsl(0 0% 0%/0.75), 0 -1px 0 hsl(var(--primary)/0.15)",
          }}
        >
          {/* Pull handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full" style={{ background: "hsl(0 0% 100%/0.18)" }} />
          </div>

          {/* Header: label + shape badge */}
          <div className="flex items-center justify-between px-5 py-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/30">
                Navigate
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                style={{
                  background: "hsl(var(--primary)/0.18)",
                  color: "hsl(var(--primary)/0.7)",
                  border: "1px solid hsl(var(--primary)/0.25)",
                }}
              >
                {SHAPE_LABEL[mobileShape]}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: "hsl(0 0% 100%/0.07)" }}
              aria-label="Close menu"
            >
              <X className="h-3.5 w-3.5 text-white/50" />
            </button>
          </div>

          {/* Shape-based tile grid — each row centred */}
          <div className="flex flex-col gap-3 px-4 pb-4">
            {mobileGrid.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-3">
                {row.map((itemIdx) => {
                  const item = NAV_ITEMS[itemIdx];
                  // Animation: rows enter from bottom staggered; each item within row staggered too
                  const rowDelay = ri * 60;
                  const colDelay = row.indexOf(itemIdx) * 40;
                  // animOriginY: bottom rows travel further up (feels like they spring from below)
                  const originY = 20 + (totalRows - 1 - ri) * 12;
                  return (
                    <div
                      key={item.href}
                      style={{ width: `calc((100% - ${(row.length - 1) * 12}px) / ${row.length})`, maxWidth: 130 }}
                    >
                      <MobileNavTile
                        item={item}
                        isOpen={isOpen}
                        isActive={location.pathname === item.href}
                        delay={rowDelay + colDelay}
                        onClose={() => setIsOpen(false)}
                        animOriginY={originY}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          FAB trigger  +  desktop arc cards
          ════════════════════════════════════ */}
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
        {/* Desktop-only: arc cards burst out from button */}
        {!isMobile && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 0, height: 0 }}
          >
            {NAV_ITEMS.map((item, i) => (
              <NavCard
                key={item.href}
                item={item}
                isOpen={isOpen}
                isActive={location.pathname === item.href}
                x={itemPositions[i]?.x ?? 0}
                y={itemPositions[i]?.y ?? 0}
                delay={i * 55}
                onClose={() => setIsOpen(false)}
                vw={vw}
                index={i}
                total={NAV_ITEMS.length}
              />
            ))}
          </div>
        )}

        {/* FAB button */}
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
                  ? "linear-gradient(135deg, hsl(var(--primary)/0.92), hsl(var(--primary)/0.72))"
                  : "linear-gradient(135deg, hsl(var(--primary)/0.78), hsl(var(--primary)/0.55))",
                boxShadow: isOpen
                  ? "0 0 30px hsl(var(--primary)/0.5), 0 0 60px hsl(var(--primary)/0.2)"
                  : "0 4px 18px hsl(var(--primary)/0.38), 0 0 36px hsl(var(--primary)/0.1)",
                transform: isOpen ? "scale(0.88)" : "scale(1)",
                backdropFilter: "blur(8px)",
              }}
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
            >
              {/* Desktop: spinning dashed orbit ring */}
              {!isMobile && (
                <div
                  className="absolute inset-[-3px] rounded-full border-2 border-dashed pointer-events-none"
                  style={{
                    borderColor: "hsl(var(--primary)/0.35)",
                    animation: isOpen ? "holo-spin 8s linear infinite" : "none",
                  }}
                />
              )}

              {/* Mobile: pulsing ring when open */}
              {isMobile && (
                <div
                  className="absolute inset-[-4px] rounded-full pointer-events-none border-2"
                  style={{
                    borderColor: "hsl(var(--primary)/0.55)",
                    animation: isOpen ? "holo-ping 1.6s cubic-bezier(0,0,0.2,1) infinite" : "none",
                    opacity: isOpen ? 1 : 0,
                  }}
                />
              )}

              {/* Outer ping ring */}
              <div
                className="absolute inset-[-8px] rounded-full pointer-events-none border border-primary/15"
                style={{ animation: isOpen && !isMobile ? "holo-ping 2s cubic-bezier(0,0,0.2,1) infinite" : "none" }}
              />

              {/* Hint dots (closed state) */}
              {!isOpen && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-40">
                  {[0, 1, 2].map((d) => (
                    <div key={d} className="h-1 w-1 rounded-full bg-primary-foreground" />
                  ))}
                </div>
              )}

              {/* Icon rotates on open */}
              <div
                className="transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(135deg)" : "none" }}
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-primary-foreground" />
                ) : (
                  <svg
                    className="h-6 w-6 text-primary-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
          @keyframes holo-spin { to { transform: rotate(360deg); } }
          @keyframes holo-ping { 75%, 100% { transform: scale(1.5); opacity: 0; } }
        `}</style>
      </div>
    </>
  );
};

export default HolographicNav;
