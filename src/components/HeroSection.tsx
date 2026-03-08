import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import heroImage from "@/assets/hero-farm.jpg";

const FloatingElements3D = lazy(() => import("@/components/FloatingElements3D"));

const HeroSection = () => {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallaxOffset = scrollY * 0.4;
  const textParallax = scrollY * 0.15;
  const opacity = Math.max(0, 1 - scrollY / 700);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Parallax background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Smart farming landscape"
          className="w-full h-[120%] object-cover will-change-transform"
          style={{ transform: `translateY(-${parallaxOffset}px) scale(1.05)` }}
        />
        <div className="absolute inset-0 bg-hero-dark/60 dark:bg-hero-dark/75" />
      </div>

      {/* 3D Floating Elements */}
      <Suspense fallback={null}>
        <FloatingElements3D />
      </Suspense>

      <div
        className="relative z-10 container mx-auto px-4 lg:px-8 py-20 pt-28 will-change-transform"
        style={{ transform: `translateY(${textParallax}px)`, opacity }}
      >
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/15 px-4 py-1.5 text-sm text-hero-dark-foreground backdrop-blur-sm animate-fade-in">
            <Leaf className="h-4 w-4" />
            <span>Sustainable Farming</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-hero-dark-foreground leading-tight animate-fade-in [animation-delay:200ms]">
            Grow the Future with{" "}
            <span className="text-secondary">Sustainable Agriculture</span>
          </h1>

          <p className="text-lg sm:text-xl text-hero-dark-foreground/80 max-w-xl animate-fade-in [animation-delay:400ms]">
            We empower farmers with AI, modern technology, and smart practices to grow smarter, naturally and sustainably.
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-fade-in [animation-delay:600ms]">
              <Button size="lg" className="text-base bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8" asChild>
                <Link to="/auth">
                  Explore Our Farms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-fade-in [animation-delay:600ms]">
              <Button size="lg" className="text-base bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
