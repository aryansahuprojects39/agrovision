import { Leaf, Droplets, FlaskConical, ShoppingCart, CloudSun, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from "@/components/ScrollReveal";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Leaf,
    title: "AI Crop Disease Detection",
    description: "Upload a leaf photo and get instant AI-powered disease diagnosis with treatment recommendations.",
    link: "/disease-detection",
  },
  {
    icon: Droplets,
    title: "Smart Irrigation",
    description: "Monitor soil moisture in real-time and receive intelligent irrigation scheduling alerts.",
    link: "/dashboard",
  },
  {
    icon: FlaskConical,
    title: "Soil Health Monitoring",
    description: "Analyze soil nutrients, get fertilizer suggestions, and track soil improvement over time.",
    link: "/dashboard",
  },
  {
    icon: ShoppingCart,
    title: "Farmer Marketplace",
    description: "Sell crops directly to buyers, cutting out middlemen and increasing your profits.",
    link: "/marketplace",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    description: "Real-time forecasts, rain alerts, and pest outbreak warnings to protect your crops.",
    link: "/weather",
  },
  {
    icon: Landmark,
    title: "Government Schemes",
    description: "Discover relevant subsidies and government programs personalized to your farm profile.",
    link: "/government-schemes",
  },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    const x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 2;
    setStyle({
      transform: `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.02)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleLeave = () => {
    setStyle({ transform: "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)", transition: "transform 0.4s ease-out" });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchEnd={handleLeave}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-muted/50 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything Your Farm Needs
            </h2>
            <p className="mt-4 text-muted-foreground">
              From AI diagnostics to marketplace access, AgroVision AI brings modern technology to every farmer.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 100} direction={i % 2 === 0 ? "up" : "scale"}>
              <Link to={feature.link}>
                <TiltCard>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-border/60 hover:border-primary/30 h-full cursor-pointer">
                    <CardContent className="p-6 space-y-4">
                      <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
