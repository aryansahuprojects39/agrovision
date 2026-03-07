import { Leaf, Droplets, FlaskConical, ShoppingCart, CloudSun, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Leaf,
    title: "AI Crop Disease Detection",
    description: "Upload a leaf photo and get instant AI-powered disease diagnosis with treatment recommendations.",
  },
  {
    icon: Droplets,
    title: "Smart Irrigation",
    description: "Monitor soil moisture in real-time and receive intelligent irrigation scheduling alerts.",
  },
  {
    icon: FlaskConical,
    title: "Soil Health Monitoring",
    description: "Analyze soil nutrients, get fertilizer suggestions, and track soil improvement over time.",
  },
  {
    icon: ShoppingCart,
    title: "Farmer Marketplace",
    description: "Sell crops directly to buyers, cutting out middlemen and increasing your profits.",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    description: "Real-time forecasts, rain alerts, and pest outbreak warnings to protect your crops.",
  },
  {
    icon: Landmark,
    title: "Government Schemes",
    description: "Discover relevant subsidies and government programs personalized to your farm profile.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything Your Farm Needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            From AI diagnostics to marketplace access, AgroVision AI brings modern technology to every farmer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/30"
            >
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
