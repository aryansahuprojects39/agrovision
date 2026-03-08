import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

type TransitionType = "cube" | "slide" | "zoom" | "fade";

const ROUTE_TRANSITIONS: Record<string, TransitionType> = {
  "/dashboard": "cube",
  "/marketplace": "slide",
  "/disease-detection": "zoom",
  "/admin": "cube",
  "/weather": "slide",
  "/government-schemes": "slide",
  "/community": "slide",
};
const TRANSITION_COLORS: Record<TransitionType, { gradient: string; glow: string }> = {
  cube: {
    gradient: "linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)",
    glow: "0 0 12px rgba(59, 130, 246, 0.6), 0 0 24px rgba(59, 130, 246, 0.3)",
  },
  slide: {
    gradient: "linear-gradient(90deg, #22c55e, #4ade80, #86efac)",
    glow: "0 0 12px rgba(34, 197, 94, 0.6), 0 0 24px rgba(34, 197, 94, 0.3)",
  },
  zoom: {
    gradient: "linear-gradient(90deg, #a855f7, #c084fc, #d8b4fe)",
    glow: "0 0 12px rgba(168, 85, 247, 0.6), 0 0 24px rgba(168, 85, 247, 0.3)",
  },
  fade: {
    gradient: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))",
    glow: "0 0 12px hsl(var(--primary) / 0.5)",
  },
};

function getTransition(pathname: string): TransitionType {
  return ROUTE_TRANSITIONS[pathname] || "fade";
}

// True 3D cube: old face rotates away, new face rotates in from the side
const exitKeyframes: Record<TransitionType, Keyframe[]> = {
  cube: [
    { transform: "perspective(1500px) rotateY(0deg)", opacity: 1, offset: 0 },
    { transform: "perspective(1500px) rotateY(-90deg)", opacity: 0, offset: 1 },
  ],
  slide: [
    { transform: "translateX(0%) scale(1)", opacity: 1, offset: 0 },
    { transform: "translateX(-40%) scale(0.92)", opacity: 0, offset: 1 },
  ],
  zoom: [
    { transform: "scale(1)", opacity: 1, offset: 0 },
    { transform: "scale(1.5)", opacity: 0, offset: 1 },
  ],
  fade: [
    { opacity: 1, transform: "translateY(0)", offset: 0 },
    { opacity: 0, transform: "translateY(-16px)", offset: 1 },
  ],
};

const enterKeyframes: Record<TransitionType, Keyframe[]> = {
  cube: [
    { transform: "perspective(1500px) rotateY(90deg)", opacity: 0, offset: 0 },
    { transform: "perspective(1500px) rotateY(0deg)", opacity: 1, offset: 1 },
  ],
  slide: [
    { transform: "translateX(60%) scale(0.92)", opacity: 0, offset: 0 },
    { transform: "translateX(0%) scale(1)", opacity: 1, offset: 1 },
  ],
  zoom: [
    { transform: "scale(0.5)", opacity: 0, offset: 0 },
    { transform: "scale(1)", opacity: 1, offset: 1 },
  ],
  fade: [
    { opacity: 0, transform: "translateY(16px)", offset: 0 },
    { opacity: 1, transform: "translateY(0)", offset: 1 },
  ],
};

const DURATION_EXIT = 300;
const DURATION_ENTER = 400;
const EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<{ children: ReactNode; pathname: string }>({
    children,
    pathname: location.pathname,
  });
  const animatingRef = useRef(false);
  const isFirst = useRef(true);

  const animateProgress = (show: boolean) => {
    const bar = progressRef.current;
    if (!bar) return;
    if (show) {
      bar.style.opacity = "1";
      bar.animate(
        [
          { transform: "scaleX(0)", transformOrigin: "left" },
          { transform: "scaleX(0.7)", transformOrigin: "left" },
        ],
        { duration: DURATION_EXIT + DURATION_ENTER, easing: "ease-out", fill: "forwards" }
      );
    } else {
      const finish = bar.animate(
        [
          { transform: "scaleX(0.7)", transformOrigin: "left" },
          { transform: "scaleX(1)", transformOrigin: "left" },
        ],
        { duration: 150, easing: "ease-in", fill: "forwards" }
      );
      finish.onfinish = () => {
        bar.style.opacity = "0";
        bar.getAnimations().forEach((a) => a.cancel());
      };
    }
  };

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      setCurrent({ children, pathname: location.pathname });
      return;
    }

    if (location.pathname === current.pathname) {
      setCurrent({ children, pathname: location.pathname });
      return;
    }

    if (animatingRef.current) {
      setCurrent({ children, pathname: location.pathname });
      return;
    }

    const el = wrapperRef.current;
    if (!el) {
      setCurrent({ children, pathname: location.pathname });
      return;
    }

    animatingRef.current = true;
    const transition = getTransition(location.pathname);
    animateProgress(true);

    const exit = el.animate(exitKeyframes[transition], {
      duration: DURATION_EXIT,
      easing: EASING,
      fill: "forwards",
    });

    exit.onfinish = () => {
      setCurrent({ children, pathname: location.pathname });

      requestAnimationFrame(() => {
        window.scrollTo(0, 0);

        const enter = el.animate(enterKeyframes[transition], {
          duration: DURATION_ENTER,
          easing: EASING,
          fill: "forwards",
        });

        enter.onfinish = () => {
          el.style.transform = "";
          el.style.opacity = "";
          animatingRef.current = false;
          animateProgress(false);
        };
      });
    };

    return () => {
      exit.cancel();
      animatingRef.current = false;
      animateProgress(false);
    };
  }, [location.pathname]);

  return (
    <div className="relative">
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-[3px] z-[9999] opacity-0"
        style={{
          background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))",
          transform: "scaleX(0)",
          transformOrigin: "left",
          borderRadius: "0 2px 2px 0",
          boxShadow: "0 0 8px hsl(var(--primary) / 0.4)",
        }}
      />
      <div
        ref={wrapperRef}
        className="min-h-screen overflow-hidden"
        style={{
          transformOrigin: "center center",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
        }}
      >
        {current.children}
      </div>
    </div>
  );
};

export default PageTransition;
