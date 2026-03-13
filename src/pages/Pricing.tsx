import { Navigate, Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { PricingTierCards } from '@/components/pricing/PricingTierCards';
import { PricingFeatureAccordion } from '@/components/pricing/PricingFeatureAccordion';

const CALENDLY_URL = 'https://calendly.com/contact-cfa/30min?month=2025-12';

const Pricing = () => {
  const { user, loading, hasPaidAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && hasPaidAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              Service Packages
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Choose Your{' '}
              <span className="text-primary">Recruiting Path</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {user
                ? "Select the package that fits your journey."
                : "Whether you want hands-on consulting or self-guided digital tools, CFA Golf has you covered."}
            </p>
          </div>

          {/* Tier Cards */}
          <PricingTierCards />

          {/* Consultation CTA */}
          <div className="text-center mt-10">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="rounded-full font-semibold">
                <Calendar className="mr-2 w-5 h-5" />
                Not Sure? Schedule a Free Consultation
              </Button>
            </a>
            <p className="text-sm text-muted-foreground mt-3">
              Book a free 15-minute call, or email{' '}
              <a href="mailto:contact@cfa.golf" className="text-primary hover:underline">contact@cfa.golf</a>
            </p>
          </div>

          {/* Accordion Feature Comparison */}
          <PricingFeatureAccordion />

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-lg text-muted-foreground mb-6">
              Ready to start your <span className="text-primary font-semibold">recruiting journey</span>?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout?plan=consulting">
                <Button size="lg" className="rounded-full font-semibold px-8 cfa-gradient hover:opacity-90 transition-opacity">
                  1-on-1 Consulting — $2,499
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/checkout?plan=digital">
                <Button size="lg" variant="outline" className="rounded-full font-semibold px-8">
                  Digital Member — $24.99/mo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
