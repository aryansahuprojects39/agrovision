import ScrollReveal from "@/components/ScrollReveal";
import farmAerial from "@/assets/farm-aerial.jpg";
import farmTech from "@/assets/farm-tech.jpg";
import farmCrops from "@/assets/farm-crops.jpg";
import farmResearch from "@/assets/farm-research.jpg";
import farmSustainable from "@/assets/farm-sustainable.jpg";

const articles = [
  {
    image: farmAerial,
    title: "Sustainable Farming in the Face of Climate Change",
    large: true,
  },
  {
    image: farmTech,
    title: "How Smart Tools Shape Modern Agriculture",
  },
  {
    image: farmCrops,
    title: "Building a Greener Future Through Regenerative Farming",
  },
  {
    image: farmResearch,
    title: "Sustainable Farming in the Modern Era",
  },
  {
    image: farmSustainable,
    title: "Solar-Powered Agriculture for a Sustainable Tomorrow",
  },
];

const ImageGridSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary mb-2">Insights</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
              Where Technology Meets the Roots of Nature
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large featured card */}
          <ScrollReveal delay={0} direction="scale" className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={articles[0].image}
                alt={articles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-hero-dark/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-sm text-primary-foreground font-medium">{articles[0].title}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Smaller cards */}
          {articles.slice(1).map((article, i) => (
            <ScrollReveal key={article.title} delay={(i + 1) * 100} direction="scale">
              <div className="relative h-52 rounded-lg overflow-hidden group cursor-pointer">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hero-dark/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs text-primary-foreground font-medium">{article.title}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGridSection;
