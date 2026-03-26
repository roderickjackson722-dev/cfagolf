import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 cfa-gradient" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="relative container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Start Your{' '}
          <span className="text-cfa-gold">College Golf Journey?</span>
        </h2>
        <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-8">
          Join hundreds of junior golfers and their families who are navigating the recruiting process with confidence using CFA's proven system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 h-14 rounded-full shadow-lg">
              Join CFA Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 h-14 rounded-full">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
