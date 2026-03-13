import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CALENDLY_URL = 'https://calendly.com/contact-cfa/30min?month=2025-12';

export function PricingTierCards() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* 1-on-1 Consulting Program */}
      <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
        <div className="absolute top-0 right-0">
          <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">Most Comprehensive</Badge>
        </div>
        <CardHeader className="text-center pb-4 pt-8">
          <CardTitle className="text-2xl font-display font-bold text-foreground">
            1-on-1 Consulting
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Full-service personalized recruiting guidance
          </CardDescription>
          <div className="pt-6">
            <span className="text-5xl font-bold text-foreground">$2,499</span>
            <p className="text-sm text-muted-foreground mt-2">One-time • 12 monthly coaching sessions</p>
            <p className="text-xs text-muted-foreground mt-1">Payment plans available</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Everything in Digital, plus dedicated 1-on-1 expert guidance through every step of the recruiting journey.
          </p>
          <Link to="/checkout?plan=consulting" className="block">
            <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-primary">
                <Calendar className="mr-1 w-4 h-4" />
                Schedule Free Consultation
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Digital Membership */}
      <Card className="relative overflow-hidden border-2 border-border shadow-xl">
        <div className="absolute top-0 right-0">
          <Badge variant="secondary" className="rounded-none rounded-bl-lg">Self-Service</Badge>
        </div>
        <CardHeader className="text-center pb-4 pt-8">
          <CardTitle className="text-2xl font-display font-bold text-foreground">
            Digital Member
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            DIY recruiting tools & resources
          </CardDescription>
          <div className="pt-6">
            <span className="text-5xl font-bold text-foreground">$24.99</span>
            <span className="text-lg text-muted-foreground">/mo</span>
            <p className="text-sm text-muted-foreground mt-2">Monthly subscription • Cancel anytime</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Access our full suite of digital recruiting tools, college database, and self-paced resources.
          </p>
          <Link to="/checkout?plan=digital" className="block">
            <Button size="lg" variant="outline" className="w-full h-14 text-lg font-semibold rounded-full">
              Subscribe Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
