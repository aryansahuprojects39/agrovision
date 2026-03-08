import { useEffect, useState, useRef, type ReactNode } from "react";
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

function getTransition(pathname: string): TransitionType {
  return ROUTE_TRANSITIONS[pathname] || "fade";
}

// Keyframe definitions for each transition type
const enterKeyframes: Record<TransitionType, Keyframe[]> = {
  cube: [
    { transform: "perspective(1200px) rotateY(90deg)", opacity: 0 },
    { transform: "perspective(1200px) rotateY(0deg)", opacity: 1 },
  ],
  slide: [
    { transform: "translateX(100%) scale(0.95)", opacity: 0 },
    { transform: "translateX(0%) scale(1)", opacity: 1 },
  ],
  zoom: [
    { transform: "scale(0.3) rotate3d(0,1,0.2,30deg)", opacity: 0 },
    { transform: "scale(1) rotate3d(0,0,0,0deg)", opacity: 1 },
  ],
  fade: [
    { transform: "translateY(24px)", opacity: 0 },
    { transform: "translateY(0)", opacity: 1 },
  ],
};

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionKey, setTransitionKey] = useState(location.key);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setTransitionKey(location.key);
      setDisplayChildren(children);
      return;
    }

    const el = containerRef.current;
    if (!el) {
      setDisplayChildren(children);
      setTransitionKey(location.key);
      return;
    }

    const transition = getTransition(location.pathname);
    const keyframes = enterKeyframes[transition];

    // Exit animation (reverse of enter)
    const exitAnim = el.animate(
      [...keyframes].reverse(),
      { duration: 250, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
    );

    exitAnim.onfinish = () => {
      setDisplayChildren(children);
      setTransitionKey(location.key);

      // Enter animation
      el.animate(keyframes, {
        duration: 400,
        easing: "cubic-bezier(0.0, 0, 0.2, 1)",
        fill: "forwards",
      });
    };

    return () => exitAnim.cancel();
  }, [location.pathname, location.key]);

  return (
    <div
      ref={containerRef}
      key={transitionKey}
      className="min-h-screen"
      style={{ transformOrigin: "center center", willChange: "transform, opacity" }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
