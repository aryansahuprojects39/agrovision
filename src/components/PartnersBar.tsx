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
    <section className="py-8 bg-muted/50 border-y border-border overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
        Trusted by leading agri-tech partners
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none" />
        <div className="flex marquee">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center gap-2.5 px-10 shrink-0"
            >
              <partner.icon className="h-5 w-5 text-primary/60" />
              <span className="text-sm font-semibold text-foreground/60 whitespace-nowrap tracking-wide">
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
