import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import farmer1 from "@/assets/farmer1.jpg";
import farmer2 from "@/assets/farmer2.jpg";
import farmer3 from "@/assets/farmer3.jpg";

const testimonials = [
  {
    name: "Rajinder Singh",
    location: "Punjab, India",
    image: farmer1,
    quote: "AgroVision's AI detected leaf blight in my wheat crop early. The 3D visualization made it so easy to understand where the disease was spreading. I saved 40% of my harvest!",
    rating: 5,
    crop: "Wheat Farmer",
  },
  {
    name: "Amina Osei",
    location: "Kumasi, Ghana",
    image: farmer2,
    quote: "The marketplace feature changed my life. I now sell directly to buyers at fair prices instead of relying on middlemen. My income has doubled in just one season.",
    rating: 5,
    crop: "Vegetable Farmer",
  },
  {
    name: "Nguyen Van Minh",
    location: "Mekong Delta, Vietnam",
    image: farmer3,
    quote: "Weather intelligence and smart irrigation alerts helped me optimize water usage for my rice paddies. I've reduced water consumption by 30% while increasing my yield.",
    rating: 5,
    crop: "Rice Farmer",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Trusted by Farmers Worldwide
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hear from real farmers who transformed their farming with AgroVision AI.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 200} direction="up">
              <Card className="h-full border-border/60 hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                    "{t.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.crop} • {t.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
