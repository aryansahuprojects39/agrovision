import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { useEffect, useRef, useState, useMemo } from "react";
import FloatingSeasonalParticles from "@/components/FloatingSeasonalParticles";

import heroSpring from "@/assets/hero-spring.jpg";
import heroSummer from "@/assets/hero-summer.jpg";
import heroMonsoon from "@/assets/hero-monsoon.jpg";
import heroAutumn from "@/assets/hero-autumn.jpg";
import heroWinter from "@/assets/hero-winter.jpg";
import heroSpringNight from "@/assets/hero-spring-night.jpg";
import heroSummerNight from "@/assets/hero-summer-night.jpg";
import heroMonsoonNight from "@/assets/hero-monsoon-night.jpg";
import heroAutumnNight from "@/assets/hero-autumn-night.jpg";
import heroWinterNight from "@/assets/hero-winter-night.jpg";
import heroFarm from "@/assets/hero-farm.jpg";

const SEASON_IMAGES: Record<string, { day: string; night: string }> = {
  spring: { day: heroSpring, night: heroSpringNight },
  summer: { day: heroSummer, night: heroSummerNight },
  monsoon: { day: heroMonsoon, night: heroMonsoonNight },
  autumn: { day: heroAutumn, night: heroAutumnNight },
  winter: { day: heroWinter, night: heroWinterNight },
};

const HeroSection = () => {
  const { user } = useAuth();
  const { season, climate, timeOfDay } = useEnvironment();
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

  const isNight = timeOfDay === "night" || timeOfDay === "evening";
  const seasonData = SEASON_IMAGES[season];
  const heroImage = seasonData ? (isNight ? seasonData.night : seasonData.day) : heroFarm;

  // Overlay opacity based on time of day & climate
  const overlayOpacity = useMemo(() => {
    let base = 0.5;
    if (timeOfDay === "night") base = 0.75;
    else if (timeOfDay === "evening" || timeOfDay === "dawn") base = 0.65;
    if (climate === "stormy" || climate === "foggy") base = Math.min(base + 0.1, 0.85);
    else if (climate === "rainy" || climate === "cloudy") base = Math.min(base + 0.05, 0.8);
    return base;
  }, [timeOfDay, climate]);

  const seasonLabel = season.charAt(0).toUpperCase() + season.slice(1);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Parallax background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt={`${seasonLabel} farming landscape`}
          className="w-full h-[120%] object-cover will-change-transform transition-opacity duration-1000"
          style={{ transform: `translateY(-${parallaxOffset}px) scale(1.05)` }}
        />
        <div
          className="absolute inset-0 bg-hero-dark transition-opacity duration-1000"
          style={{ opacity: overlayOpacity }}
        />
      </div>


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
              <Button size="lg" className="text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 font-semibold" asChild>
                <Link to="/auth">
                  Explore Our Farms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-fade-in [animation-delay:600ms]">
              <Button size="lg" className="text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 font-semibold" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
