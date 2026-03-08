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
    <section className="py-6 bg-card border-y border-border overflow-hidden">
      <div className="relative">
        <div className="flex marquee">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center gap-2 px-8 shrink-0"
            >
              <partner.icon className="h-4 w-4 text-foreground/40" />
              <span className="text-sm font-medium text-foreground/40 whitespace-nowrap">
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
