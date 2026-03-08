import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const [current, setCurrent] = useState<{ children: ReactNode; pathname: string }>({
    children,
    pathname: location.pathname,
  });
  const animatingRef = useRef(false);
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip animation on first mount
    if (isFirst.current) {
      isFirst.current = false;
      setCurrent({ children, pathname: location.pathname });
      return;
    }

    // Same page — just update children
    if (location.pathname === current.pathname) {
      setCurrent({ children, pathname: location.pathname });
      return;
    }

    // Don't stack animations
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

    // Exit old content
    const exit = el.animate(exitKeyframes[transition], {
      duration: DURATION_EXIT,
      easing: EASING,
      fill: "forwards",
    });

    exit.onfinish = () => {
      // Swap content
      setCurrent({ children, pathname: location.pathname });

      // Small frame delay to let React render
      requestAnimationFrame(() => {
        // Scroll to top for new page
        window.scrollTo(0, 0);

        // Enter new content
        const enter = el.animate(enterKeyframes[transition], {
          duration: DURATION_ENTER,
          easing: EASING,
          fill: "forwards",
        });

        enter.onfinish = () => {
          // Clear the fill so element returns to normal flow
          el.style.transform = "";
          el.style.opacity = "";
          animatingRef.current = false;
        };
      });
    };

    return () => {
      exit.cancel();
      animatingRef.current = false;
    };
  }, [location.pathname, location.key]);

  return (
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
  );
};

export default PageTransition;
