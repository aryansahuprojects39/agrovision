import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const videos = [
  {
    id: 1,
    title: "Seeds of Change: The AI Farming Revolution",
    desc: "How artificial intelligence is transforming small-scale farming across rural India.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "24 min",
    category: "Technology",
    thumbnail: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=340&fit=crop",
  },
  {
    id: 2,
    title: "Water is Life: Smart Irrigation Stories",
    desc: "Documenting farmers who transformed water-scarce land into thriving fields using technology.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "18 min",
    category: "Sustainability",
    thumbnail: "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?w=600&h=340&fit=crop",
  },
  {
    id: 3,
    title: "From Farm to Fork: The Direct Market Journey",
    desc: "Following produce from harvest to consumer, exploring how technology eliminates middlemen.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "21 min",
    category: "Marketplace",
    thumbnail: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=340&fit=crop",
  },
  {
    id: 4,
    title: "The Soil Whisperers: Regenerative Farming",
    desc: "Meet the farmers who are healing the earth through regenerative agricultural practices.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "30 min",
    category: "Sustainability",
    thumbnail: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=340&fit=crop",
  },
  {
    id: 5,
    title: "Monsoon Diaries: Farming Through the Rains",
    desc: "An intimate look at how Indian farmers navigate the critical monsoon season.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "27 min",
    category: "Culture",
    thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=340&fit=crop",
  },
  {
    id: 6,
    title: "Women in Agriculture: Breaking New Ground",
    desc: "Celebrating the women who are leading innovation in farming communities.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "22 min",
    category: "Culture",
    thumbnail: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=340&fit=crop",
  },
];

const categories = ["All", "Technology", "Sustainability", "Marketplace", "Culture"];

const DocumentaryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState<typeof videos[0] | null>(null);

  const filtered = selectedCategory === "All"
    ? videos
    : videos.filter((v) => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="py-20 lg:py-28 bg-primary/5">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Documentaries</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Stories from the Fields
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Watch inspiring documentaries about the intersection of technology, nature, and the farmers who feed our world.
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
              {filtered.map((video, i) => (
                <ScrollReveal key={video.id} delay={i * 80} direction="up">
                  <Card
                    className="overflow-hidden border-border hover:border-primary/30 transition-all hover:shadow-lg group cursor-pointer"
                    onClick={() => setActiveVideo(video)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-6 w-6 text-primary-foreground ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {video.category}
                      </Badge>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-foreground/70 text-background text-xs px-2 py-1 rounded">
                        <Clock className="h-3 w-3" /> {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold text-foreground mb-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">{video.desc}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <DialogTitle className="sr-only">{activeVideo?.title}</DialogTitle>
            <div className="aspect-video">
              {activeVideo && (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        <FooterSection />
      </div>
    </div>
  );
};

export default DocumentaryPage;
