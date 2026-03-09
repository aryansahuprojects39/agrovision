import ScrollReveal from "@/components/ScrollReveal";
import { useEffect, useRef, useState } from "react";
import farmAerial from "@/assets/farm-aerial.jpg";
import farmCrops from "@/assets/farm-crops.jpg";

function AnimatedCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
        else if (!entry.isIntersecting && started) { setStarted(false); setCount(0); }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  return (
    <div ref={ref} className="space-y-1">
      <p className="text-4xl sm:text-5xl font-bold text-[hsl(var(--hero-dark-foreground))]">{count}{suffix}</p>
      <p className="text-sm text-[hsl(var(--hero-dark-foreground)/0.7)]">{label}</p>
    </div>
  );
}

const InnovatingSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Images */}
          <ScrollReveal direction="left">
            <div className="grid grid-cols-2 gap-4">
              <img
                src={farmAerial}
                alt="Aerial farm view"
                className="w-full h-64 object-cover rounded-lg"
              />
              <img
                src={farmCrops}
                alt="Fresh crops"
                className="w-full h-64 object-cover rounded-lg mt-8"
              />
            </div>
          </ScrollReveal>

          {/* Right: Content + Stats */}
          <div className="space-y-8">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">About Us</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Innovating the Future of Agriculture
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                AgroVision combines modern technology and sustainable methods to help farmers grow smarter, faster, and greener. Our AI-powered platform brings precision agriculture to every farmer.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-6 rounded-xl p-8" style={{ backgroundColor: 'hsl(var(--hero-dark))' }}>
              <ScrollReveal delay={100}>
                <AnimatedCounter value={100} suffix="%" label="Customer Satisfaction" />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <AnimatedCounter value={20} suffix="+" label="Years of Experience" />
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <AnimatedCounter value={50} suffix="K+" label="Farmers Onboarded" />
              </ScrollReveal>
              <ScrollReveal delay={400}>
                <AnimatedCounter value={95} suffix="%" label="Detection Accuracy" />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovatingSection;
