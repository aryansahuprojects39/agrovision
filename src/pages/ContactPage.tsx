import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject || null,
      message: result.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to send. Please try again.");
    } else {
      setSent(true);
      toast.success("Message sent successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="py-20 lg:py-28 bg-primary/5">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Contact</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Get in Touch</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions or need support? We're here to help you grow.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <ScrollReveal direction="left">
                  <Card className="border-border">
                    <CardContent className="p-6 flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">Email</h4>
                        <p className="text-sm text-muted-foreground">support@agrovision.ai</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
                <ScrollReveal direction="left" delay={100}>
                  <Card className="border-border">
                    <CardContent className="p-6 flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">Phone</h4>
                        <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
                <ScrollReveal direction="left" delay={200}>
                  <Card className="border-border">
                    <CardContent className="p-6 flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">Address</h4>
                        <p className="text-sm text-muted-foreground">AgriTech Hub, Pune, Maharashtra, India</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </div>

              {/* Form */}
              <div className="md:col-span-2">
                <ScrollReveal direction="right">
                  <Card className="border-border">
                    <CardContent className="p-6 sm:p-8">
                      {sent ? (
                        <div className="text-center py-12">
                          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                          <p className="text-muted-foreground mb-6">Your message has been sent. We'll get back to you soon.</p>
                          <Button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                            Send Another
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-foreground">Name *</Label>
                              <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-foreground">Email *</Label>
                              <Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject" className="text-foreground">Subject</Label>
                            <Input id="subject" placeholder="What's this about?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={200} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message" className="text-foreground">Message *</Label>
                            <Textarea id="message" placeholder="Tell us how we can help..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required maxLength={2000} />
                          </div>
                          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            <Send className="mr-2 h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
};

export default ContactPage;
