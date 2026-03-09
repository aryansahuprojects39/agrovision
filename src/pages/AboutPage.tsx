import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ScrollReveal from "@/components/ScrollReveal";
import { Users, Target, Eye, Award, Globe, ArrowRight, Mail, Sprout, Heart, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const team = [
  { name: "Dr. Priya Sharma", role: "Founder & CEO", desc: "AI researcher with 15+ years in agricultural technology.", icon: Sprout },
  { name: "Rajesh Kumar", role: "CTO", desc: "Full-stack engineer specializing in machine learning systems.", icon: Shield },
  { name: "Ananya Patel", role: "Head of Research", desc: "Plant pathology expert driving disease detection models.", icon: Eye },
  { name: "Vikram Singh", role: "Lead Designer", desc: "UX specialist passionate about farmer-friendly interfaces.", icon: Heart },
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
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[hsl(var(--hero-dark))]" />
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-primary/30 blur-3xl"
                style={{
                  width: `${200 + i * 80}px`,
                  height: `${200 + i * 80}px`,
                  left: `${10 + i * 20}%`,
                  top: `${-20 + i * 15}%`,
                }}
              />
            ))}
          </div>
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <ScrollReveal>
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
                About Us
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--hero-dark-foreground))] mb-6 leading-tight">
                Empowering Farmers <br className="hidden sm:block" /> with AI
              </h1>
              <p className="text-lg text-[hsl(var(--hero-dark-foreground)/0.7)] max-w-2xl mx-auto leading-relaxed">
                We believe every farmer deserves access to cutting-edge technology. AgroVision AI bridges the gap between advanced agricultural science and the hands that feed the world.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 lg:py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">What Drives Us</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">Mission & Vision</h2>
              </div>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 gap-8">
              <ScrollReveal direction="left">
                <Card className="h-full border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <CardContent className="p-8 lg:p-10 flex flex-col items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Target className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To democratize agricultural technology by providing AI-powered tools that help farmers detect diseases early, optimize resources, access markets, and increase their income — all from a simple smartphone.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
              <ScrollReveal direction="right">
                <Card className="h-full border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <CardContent className="p-8 lg:p-10 flex flex-col items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Eye className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      A world where no crop is lost to preventable disease, where every farmer has real-time data at their fingertips, and where sustainable agriculture feeds the growing global population.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 lg:py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-primary-foreground blur-3xl"
                style={{
                  width: `${150 + i * 60}px`,
                  height: `${150 + i * 60}px`,
                  right: `${i * 25}%`,
                  top: `${-30 + i * 20}%`,
                }}
              />
            ))}
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((s, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="text-center group">
                    <p className="text-4xl sm:text-5xl font-bold text-primary-foreground group-hover:scale-110 transition-transform duration-300 inline-block">{s.value}</p>
                    <p className="text-sm text-primary-foreground/70 mt-2">{s.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 lg:py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">Our Journey</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">From Idea to Impact</h2>
              </div>
            </ScrollReveal>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />
              {timeline.map((item, i) => (
                <ScrollReveal key={i} delay={i * 80} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="hidden md:block flex-1" />
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-background">
                      <span className="text-xs font-bold text-primary-foreground">{item.year.slice(-2)}</span>
                    </div>
                    <div className="flex-1 bg-card rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300">
                      <p className="text-xs font-semibold text-primary">{item.year}</p>
                      <h4 className="text-lg font-bold text-foreground mt-0.5">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 lg:py-24 bg-accent/20">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">Our Team</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">Meet the Minds Behind AgroVision</h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => {
                const Icon = member.icon;
                return (
                  <ScrollReveal key={i} delay={i * 100} direction="up">
                    <Card className="text-center border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group">
                      <CardContent className="p-8">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="font-bold text-foreground text-lg">{member.name}</h4>
                        <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{member.desc}</p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partners & Awards */}
        <section className="py-20 lg:py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">Partners & Recognition</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">Trusted By Industry Leaders</h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {partners.map((p, i) => (
                <ScrollReveal key={i} delay={i * 60} direction="scale">
                  <Card className="border-border hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                    <CardContent className="p-5 flex items-center justify-center h-28">
                      <div className="text-center">
                        <Globe className="h-7 w-7 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-medium text-foreground">{p}</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={200}>
              <div className="mt-14 flex flex-wrap justify-center gap-4">
                {["National AgriTech Innovation Award 2025", "Top 50 AI Startups - NASSCOM", "Best Social Impact Startup - TiE"].map((award, i) => (
                  <div key={i} className="flex items-center gap-2 bg-primary/10 rounded-full px-5 py-2.5 hover:bg-primary/20 transition-colors cursor-default">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">{award}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[hsl(var(--hero-dark))]" />
          <div className="absolute inset-0 opacity-15">
            <div className="absolute rounded-full bg-primary blur-[120px] w-[500px] h-[500px] -left-40 -top-40" />
            <div className="absolute rounded-full bg-secondary blur-[120px] w-[400px] h-[400px] -right-20 -bottom-20" />
          </div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <ScrollReveal>
              <Sprout className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[hsl(var(--hero-dark-foreground))] mb-4">
                Ready to Transform Your Farm?
              </h2>
              <p className="text-lg text-[hsl(var(--hero-dark-foreground)/0.7)] max-w-xl mx-auto mb-10 leading-relaxed">
                Join 50,000+ farmers already using AgroVision AI to grow smarter, detect diseases early, and connect with markets.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="text-base px-8 gap-2">
                  <Link to="/auth">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base px-8 gap-2 border-[hsl(var(--hero-dark-foreground)/0.2)] text-[hsl(var(--hero-dark-foreground))] hover:bg-[hsl(var(--hero-dark-foreground)/0.1)]">
                  <Link to="/contact">
                    <Mail className="h-4 w-4" /> Contact Us
                  </Link>
                </Button>
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
