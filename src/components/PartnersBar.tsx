import { Leaf, Droplets, Sun, Sprout, Tractor, TreePine } from "lucide-react";

const partners = [
  { name: "GreenField", icon: Leaf },
  { name: "AquaSmart", icon: Droplets },
  { name: "SolarGrow", icon: Sun },
  { name: "SeedTech", icon: Sprout },
  { name: "FarmMech", icon: Tractor },
  { name: "EcoForest", icon: TreePine },
];

const PartnersBar = () => {
  return (
    <section className="py-6 bg-hero-dark border-y border-primary/20 overflow-hidden">
      <div className="relative">
        <div className="flex marquee">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center gap-2 px-8 shrink-0"
            >
              <partner.icon className="h-4 w-4 text-hero-dark-foreground/50" />
              <span className="text-sm font-medium text-hero-dark-foreground/50 whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersBar;
