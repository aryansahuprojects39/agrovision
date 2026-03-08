import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ScrollReveal from "@/components/ScrollReveal";
import { Users, Target, Eye, Award, Globe, Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const team = [
  { name: "Dr. Priya Sharma", role: "Founder & CEO", desc: "AI researcher with 15+ years in agricultural technology." },
  { name: "Rajesh Kumar", role: "CTO", desc: "Full-stack engineer specializing in machine learning systems." },
  { name: "Ananya Patel", role: "Head of Research", desc: "Plant pathology expert driving disease detection models." },
  { name: "Vikram Singh", role: "Lead Designer", desc: "UX specialist passionate about farmer-friendly interfaces." },
];

const timeline = [
  { year: "2021", title: "Founded", desc: "AgroVision AI was born from a mission to empower small farmers with technology." },
  { year: "2022", title: "AI Launch", desc: "Released our first crop disease detection model with 90% accuracy." },
  { year: "2023", title: "10K Farmers", desc: "Reached 10,000 active farmers across 5 states in India." },
  { year: "2024", title: "Marketplace", desc: "Launched the farmer marketplace connecting producers directly with buyers." },
  { year: "2025", title: "Awards", desc: "Won the National AgriTech Innovation Award and expanded to 15 states." },
  { year: "2026", title: "Global", desc: "Expanding internationally with partnerships across Southeast Asia and Africa." },
];

const stats = [
  { value: "50K+", label: "Active Farmers" },
  { value: "95%", label: "Detection Accuracy" },
  { value: "15+", label: "States Covered" },
  { value: "₹2Cr+", label: "Marketplace Volume" },
];

const partners = ["ICAR", "NABARD", "Microsoft for Startups", "Google.org", "Bill & Melinda Gates Foundation", "FAO"];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-primary/5">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">About Us</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Empowering Farmers with AI
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We believe every farmer deserves access to cutting-edge technology. AgroVision AI bridges the gap between advanced agricultural science and the hands that feed the world.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-8">
            <ScrollReveal direction="left">
              <Card className="h-full border-primary/20">
                <CardContent className="p-8 flex flex-col items-start gap-4">
                  <Target className="h-10 w-10 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To democratize agricultural technology by providing AI-powered tools that help farmers detect diseases early, optimize resources, access markets, and increase their income — all from a simple smartphone.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <Card className="h-full border-primary/20">
                <CardContent className="p-8 flex flex-col items-start gap-4">
                  <Eye className="h-10 w-10 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                  <p className="text-muted-foreground">
                    A world where no crop is lost to preventable disease, where every farmer has real-time data at their fingertips, and where sustainable agriculture feeds the growing global population.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold text-primary-foreground">{s.value}</p>
                    <p className="text-sm text-primary-foreground/70 mt-1">{s.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Our Journey</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">From Idea to Impact</h2>
              </div>
            </ScrollReveal>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
              {timeline.map((item, i) => (
                <ScrollReveal key={i} delay={i * 80} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className={`relative flex items-start gap-6 mb-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} md:text-${i % 2 === 0 ? "right" : "left"}`}>
                    <div className="hidden md:block flex-1" />
                    <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">{item.year.slice(-2)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-primary">{item.year}</p>
                      <h4 className="text-lg font-bold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-accent/20">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Our Team</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Meet the Minds Behind AgroVision</h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <ScrollReveal key={i} delay={i * 100} direction="up">
                  <Card className="text-center border-border hover:border-primary/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-bold text-foreground">{member.name}</h4>
                      <p className="text-sm text-primary font-medium">{member.role}</p>
                      <p className="text-xs text-muted-foreground mt-2">{member.desc}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Partners & Awards */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Partners & Recognition</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Trusted By Industry Leaders</h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {partners.map((p, i) => (
                <ScrollReveal key={i} delay={i * 60} direction="scale">
                  <Card className="border-border hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 flex items-center justify-center h-24">
                      <div className="text-center">
                        <Globe className="h-6 w-6 text-primary mx-auto mb-1" />
                        <p className="text-xs font-medium text-foreground">{p}</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={200}>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {["National AgriTech Innovation Award 2025", "Top 50 AI Startups - NASSCOM", "Best Social Impact Startup - TiE"].map((award, i) => (
                  <div key={i} className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">{award}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
};

export default AboutPage;
