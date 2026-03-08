import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";

const faqs = [
  {
    question: "What kind of farming solutions do you offer?",
    answer: "We offer AI-powered crop disease detection, smart irrigation monitoring, soil health analysis, weather intelligence, a farmer marketplace, and access to government schemes — all from one platform.",
  },
  {
    question: "How can I start using AgroVision's platform?",
    answer: "Simply sign up for free, set up your farm profile with your location and crop type, and start using our AI tools immediately. No special hardware required.",
  },
  {
    question: "Is your technology eco-friendly?",
    answer: "Absolutely! Our platform promotes sustainable farming practices, helps reduce water usage by up to 30%, and minimizes chemical use through precise disease detection and targeted treatment recommendations.",
  },
  {
    question: "How accurate is the AI disease detection?",
    answer: "Our AI model achieves 95% accuracy in detecting crop diseases from leaf images. It continuously improves as more data is collected from farmers across the platform.",
  },
  {
    question: "Is it free for small farmers?",
    answer: "Yes! AgroVision is free for small-scale farmers. We believe every farmer deserves access to modern agricultural technology regardless of farm size.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Got Questions? We've Got You Covered.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border bg-card rounded-lg px-6 data-[state=open]:bg-accent/30"
              >
                <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
