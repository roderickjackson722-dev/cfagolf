import { ArrowRight, Star, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Dark overlay for text visibility */}
      <div className="absolute inset-0 bg-primary/75" />
      
      <div className="relative container mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm">
              <Star className="w-4 h-4 fill-cfa-gold text-cfa-gold" />
              Trusted by 500+ Golf Families
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Path to{' '}
              <span className="text-cfa-gold">College Golf</span>{' '}
              Starts Here
            </h1>
            
            <p className="text-lg md:text-xl text-white/85 max-w-xl mx-auto lg:mx-0">
              Expert guidance for junior golfers and their families navigating the college golf recruiting process. Build your recruiting plan, track your progress, and find your perfect fit.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 h-14 rounded-full shadow-lg">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/database">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 h-14 rounded-full">
                  Explore Colleges
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Users className="w-5 h-5 text-cfa-gold" />
                  <span className="text-2xl font-bold text-white">1,500+</span>
                </div>
                <span className="text-white/70 text-sm">College Programs</span>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Trophy className="w-5 h-5 text-cfa-gold" />
                  <span className="text-2xl font-bold text-white">D1-NAIA</span>
                </div>
                <span className="text-white/70 text-sm">All Divisions</span>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Star className="w-5 h-5 text-cfa-gold" />
                  <span className="text-2xl font-bold text-white">7</span>
                </div>
                <span className="text-white/70 text-sm">Pro Tools Included</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
}
