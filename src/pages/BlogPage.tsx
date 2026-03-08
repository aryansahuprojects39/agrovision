import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How AI is Revolutionizing Crop Disease Detection",
    excerpt: "Learn how machine learning models trained on millions of leaf images can identify diseases with 95% accuracy, saving crops and reducing pesticide usage.",
    category: "AI & Technology",
    date: "Feb 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
    content: `Artificial Intelligence is transforming agriculture at an unprecedented pace. Our crop disease detection system uses convolutional neural networks trained on over 2 million leaf images to identify diseases in real-time.\n\nThe model can detect over 50 different plant diseases across 20 crop types, providing farmers with instant diagnosis and treatment recommendations. Early detection means farmers can act before diseases spread, reducing crop losses by up to 40%.\n\nThe technology works on any smartphone — no special hardware required. Simply take a photo of a leaf, and our AI analyzes it within seconds, providing a confidence score along with detailed treatment plans.`,
  },
  {
    id: 2,
    title: "Sustainable Farming Practices for the Modern Era",
    excerpt: "Discover how integrating traditional wisdom with modern technology creates sustainable farming systems that benefit both farmers and the environment.",
    category: "Sustainability",
    date: "Feb 20, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop",
    content: `Sustainable farming is no longer a luxury — it's a necessity. With climate change affecting weather patterns and soil health declining globally, farmers need new approaches that maintain productivity while preserving natural resources.\n\nAt AgroVision AI, we combine precision agriculture with traditional knowledge. Our smart irrigation systems reduce water usage by 30%, while our soil health monitoring helps farmers maintain optimal nutrient levels without over-fertilizing.\n\nCover cropping, crop rotation, and integrated pest management are all enhanced through data-driven insights provided by our platform.`,
  },
  {
    id: 3,
    title: "Government Schemes Every Indian Farmer Should Know",
    excerpt: "A comprehensive guide to agricultural subsidies, loan programs, and insurance schemes available to farmers in India.",
    category: "Resources",
    date: "Feb 15, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
    content: `The Indian government offers numerous schemes to support farmers, but many remain unaware of the benefits available to them. Here's a comprehensive guide.\n\nPM-KISAN provides direct income support of ₹6,000 per year. The Pradhan Mantri Fasal Bima Yojana offers crop insurance at minimal premiums. The Soil Health Card Scheme provides free soil testing and recommendations.\n\nOur platform automatically matches farmers with eligible schemes based on their location, crop type, and farm size, ensuring no opportunity is missed.`,
  },
  {
    id: 4,
    title: "The Future of Smart Irrigation Systems",
    excerpt: "How IoT sensors and AI algorithms work together to optimize water usage and boost crop yields in water-scarce regions.",
    category: "AI & Technology",
    date: "Feb 8, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?w=600&h=400&fit=crop",
    content: `Water scarcity is one of the biggest challenges facing agriculture today. Smart irrigation systems combine soil moisture sensors, weather data, and AI predictions to deliver exactly the right amount of water at the right time.\n\nOur system monitors soil moisture at multiple depths, combines this with evapotranspiration models and weather forecasts, and automatically adjusts irrigation schedules. The result? Up to 40% water savings with improved crop yields.\n\nFarmers can monitor and control their irrigation remotely through our mobile app, making precision water management accessible to everyone.`,
  },
  {
    id: 5,
    title: "Building a Direct Farmer-to-Consumer Marketplace",
    excerpt: "How eliminating middlemen through technology can increase farmer income by 30-50% while reducing food prices for consumers.",
    category: "Marketplace",
    date: "Jan 30, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop",
    content: `The traditional agricultural supply chain involves multiple intermediaries, each taking a cut. By the time produce reaches consumers, farmers receive only 20-30% of the final price.\n\nOur marketplace connects farmers directly with buyers — restaurants, retailers, and consumers. This direct connection increases farmer income by 30-50% while offering consumers fresher produce at lower prices.\n\nThe platform includes quality verification, logistics support, and secure payments, making it easy for farmers to sell their produce without worrying about middlemen.`,
  },
  {
    id: 6,
    title: "Climate-Resilient Crops: Preparing for Tomorrow",
    excerpt: "Understanding which crop varieties can withstand changing climate conditions and how data helps farmers make better choices.",
    category: "Sustainability",
    date: "Jan 22, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
    content: `As climate patterns become increasingly unpredictable, choosing the right crop varieties becomes crucial. Climate-resilient crops are bred to withstand drought, floods, and temperature extremes.\n\nOur platform analyzes historical climate data, soil conditions, and market trends to recommend the best crop varieties for each farmer's specific conditions. This data-driven approach reduces crop failure risk significantly.\n\nWe partner with agricultural research institutions to continuously update our recommendations based on the latest scientific findings.`,
  },
];

const categories = ["All", "AI & Technology", "Sustainability", "Resources", "Marketplace"];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const filtered = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="py-20 lg:py-28 bg-primary/5">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Blog</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Insights & Stories
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay updated with the latest in agricultural technology, sustainable farming, and farmer success stories.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 80} direction="up">
                  <Card className="overflow-hidden border-border hover:border-primary/30 transition-all hover:shadow-lg group cursor-pointer h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {post.category}
                      </Badge>
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                      {expandedPost === post.id ? (
                        <div className="text-sm text-muted-foreground whitespace-pre-line mb-3">{post.content}</div>
                      ) : (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">{post.excerpt}</p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="self-start text-primary hover:text-primary/80 p-0 mt-auto"
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      >
                        {expandedPost === post.id ? "Show Less" : "Read More"} <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
};

export default BlogPage;
