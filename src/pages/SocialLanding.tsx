import { ArrowRight, Calendar, Star, Target, Users, BarChart3, GraduationCap, BookOpen, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import cfaLogo from '@/assets/cfa-logo.png';

const CALENDLY_URL = 'https://calendly.com/contact-cfa/30min?month=2025-12';

const features = [
  {
    icon: GraduationCap,
    title: '1,000+ College Programs',
    description: 'Search and filter every college golf program across D1, D2, D3, NAIA & JUCO.',
  },
  {
    icon: Target,
    title: 'Target School Builder',
    description: 'Build your personalized dream, reach, and safety school lists with expert guidance.',
  },
  {
    icon: Users,
    title: 'Coach Contact Tracker',
    description: 'Manage outreach to college coaches with follow-up reminders and status tracking.',
  },
  {
    icon: BarChart3,
    title: 'Scholarship Calculator',
    description: 'Compare financial aid offers side by side and negotiate with confidence.',
  },
  {
    icon: BookOpen,
    title: 'Campus Visit Planner',
    description: 'Log visits, rate programs, and compare schools with structured evaluation tools.',
  },
  {
    icon: Trophy,
    title: 'Tournament Log',
    description: 'Track your competitive results to build your recruiting resume automatically.',
  },
];

export default function SocialLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero with video */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            ref={(el) => { if (el) el.playbackRate = 0.75; }}
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/cfa-promo-clip.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32 text-center space-y-6">
          <img src={cfaLogo} alt="College Fairway Advisors" className="w-20 h-20 mx-auto object-contain" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm">
            <Star className="w-4 h-4 fill-cfa-gold text-cfa-gold" />
            Where swing coaches build your game, CFA builds your path to a roster spot.
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto">
            Your Path to{' '}
            <span className="text-cfa-gold">College Golf</span>{' '}
            Starts Here
          </h1>

          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
            The only all-in-one recruiting platform built specifically for junior golfers and their families. Expert guidance, powerful tools, proven results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/checkout">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 h-14 rounded-full shadow-lg">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 h-14 rounded-full">
                <Calendar className="mr-2 w-5 h-5" />
                Free Consultation
              </Button>
            </a>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 73C120 66 240 53 360 48C480 43 600 48 720 53C840 58 960 62 1080 58C1200 53 1320 40 1380 34L1440 27V80H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Feature Showcase - designed for screenshots */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              Your Recruiting Toolkit
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need in{' '}
              <span className="text-primary">One Platform</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Stop juggling spreadsheets, emails, and guesswork. CFA gives you a complete system to navigate the college golf recruiting process.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="group border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">1,000+</p>
              <p className="text-sm text-muted-foreground">College Programs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">D1–JUCO</p>
              <p className="text-sm text-muted-foreground">All Divisions Covered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">7</p>
              <p className="text-sm text-muted-foreground">Pro Recruiting Tools</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Coaching Modules</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 cfa-gradient" />
        <div className="relative container mx-auto px-4 text-center space-y-6">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Ready to Find Your{' '}
            <span className="text-cfa-gold">Perfect Program?</span>
          </h2>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
            Join CFA and get personalized, 12-module recruiting support for just $899 — less than a single tournament entry per module.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link to="/checkout">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 h-14 rounded-full shadow-lg">
                Join CFA Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 h-14 rounded-full">
                <Calendar className="mr-2 w-5 h-5" />
                Schedule Free Call
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="py-6 bg-foreground text-center">
        <p className="text-sm text-background/60">
          © {new Date().getFullYear()} College Fairway Advisors · <Link to="/" className="hover:underline text-background/80">cfagolf.com</Link>
        </p>
      </footer>
    </div>
  );
}
