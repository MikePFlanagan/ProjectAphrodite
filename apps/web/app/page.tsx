import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { CharacterShowcase } from '@/components/marketing/CharacterShowcase';
import { FeatureSection } from '@/components/marketing/FeatureSection';
import { Hero } from '@/components/marketing/Hero';
import { PricingPreview } from '@/components/marketing/PricingPreview';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0c0910] text-white selection:bg-fuchsia-300/30">
      <Navbar />
      <Hero />
      <CharacterShowcase />
      <FeatureSection />
      <PricingPreview />
      <Footer />
    </div>
  );
}
