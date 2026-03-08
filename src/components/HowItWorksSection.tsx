import { UserPlus, ScanLine, BarChart3, Store } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  {
    icon: UserPlus,
    title: "Register & Setup",
    description: "Sign up and set up your farm profile with location, crop type, and soil information.",
  },
  {
    icon: ScanLine,
    title: "AI Diagnosis",
    description: "Upload a crop leaf photo. Our AI instantly detects diseases and suggests treatments.",
  },
  {
    icon: BarChart3,
    title: "Monitor & Optimize",
    description: "Track soil health, irrigation, and weather data on your personalized dashboard.",
  },
  {
    icon: Store,
    title: "Sell & Earn",
    description: "List your produce on the marketplace and connect directly with buyers.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Simple Steps to Smarter Farming
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ScrollReveal key={step.title} delay={index * 150} direction="up">
              <div className="text-center space-y-4 relative group">
                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="relative mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <step.icon className="h-7 w-7 text-primary" />
                  <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
