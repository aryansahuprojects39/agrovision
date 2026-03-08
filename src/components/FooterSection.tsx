import { Leaf } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const FooterSection = () => {
  return (
    <footer id="contact" className="bg-foreground/5 border-t border-border py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ScrollReveal delay={0} direction="up">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="font-bold text-foreground">AgroVision AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering farmers with AI-driven insights for sustainable and profitable agriculture.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} direction="up">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="/community" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300} direction="up">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@agrovision.ai</li>
                <li>+91 98765 43210</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 AgroVision AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
