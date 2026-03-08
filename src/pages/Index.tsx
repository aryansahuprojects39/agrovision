import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PartnersBar from "@/components/PartnersBar";
import InnovatingSection from "@/components/InnovatingSection";
import FeaturesSection from "@/components/FeaturesSection";
import ImageGridSection from "@/components/ImageGridSection";
import FAQSection from "@/components/FAQSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PartnersBar />
      <InnovatingSection />
      <FeaturesSection />
      <ImageGridSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
};

export default Index;
