import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
