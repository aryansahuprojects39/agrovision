import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-farm.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Smart farming landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-20 pt-28">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground backdrop-blur-sm">
            <Leaf className="h-4 w-4" />
            <span>Smart Farming & Crop Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground leading-tight">
            AI-Powered Agriculture for a{" "}
            <span className="text-secondary">Smarter Future</span>
          </h1>

          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-xl">
            Detect crop diseases, monitor soil health, optimize irrigation, and connect directly with buyers — all from one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button size="lg" className="text-base" asChild>
              <Link to="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent" asChild>
              <a href="/#features">Watch Demo</a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 text-sm text-primary-foreground/70">
            <span>✓ Free for Small Farmers</span>
            <span>✓ AI Disease Detection</span>
            <span>✓ Real-time Monitoring</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
