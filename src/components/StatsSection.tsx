import ScrollReveal from "@/components/ScrollReveal";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 50000, label: "Farmers Onboarded", suffix: "+", prefix: "" },
  { value: 95, label: "Disease Detection Accuracy", suffix: "%", prefix: "" },
  { value: 30, label: "Water Savings", suffix: "%", prefix: "" },
  { value: 2, label: "Income Increase", suffix: "x", prefix: "" },
];

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        } else if (!entry.isIntersecting && started) {
          setStarted(false);
          setCount(0);
        }
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
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  const display = value >= 1000
    ? `${prefix}${Math.floor(count / 1000)}K${suffix}`
    : `${prefix}${count}${suffix}`;

  return (
    <p ref={ref} className="text-3xl sm:text-4xl font-bold text-primary-foreground">
      {display}
    </p>
  );
}

const StatsSection = () => {
  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Decorative floating dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-primary-foreground/10 animate-pulse"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 150} direction="scale">
              <div className="text-center space-y-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
