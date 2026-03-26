import { 
  GraduationCap, 
  Target, 
  Video, 
  Calendar, 
  Users, 
  FileText, 
  Calculator,
  ClipboardList,
  ArrowRight,
  Check,
  Monitor,
  Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const digitalFeatures = [
  "Full College Golf Database Access",
  "Target School List Builder",
  "Tournament Result Tracker",
  "Coach Contact Tracker",
  "Campus Visit Planner",
  "Scholarship Calculator",
  "Recruiting Timeline & Worksheets",
  "LPGA & PGA Pro Webinars",
];

const consultingExtras = [
  "College Coach Q&A Sessions",
  "12 One-on-One Consulting Calls",
  "Personalized Recruiting Roadmap",
  "Academic & Eligibility Evaluation",
  "Coach Communication Management",
  "Highlight Video Review & Feedback",
  "Scholarship Negotiation Strategy",
  "Campus Visit Preparation & Coaching",
  "Transfer Portal Guidance",
  "Priority Email Support",
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Service Packages
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Three Ways to{' '}
            <span className="text-primary">Get Recruited</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you want hands-on consulting or self-guided digital tools, CFA Golf has a plan for your recruiting journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 1-on-1 Consulting */}
          <Card className="relative overflow-hidden border-2 border-primary shadow-xl group card-hover">
            <div className="absolute top-0 right-0">
              <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">Most Comprehensive</Badge>
            </div>
            <CardHeader className="text-center pb-4 pt-8">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <Handshake className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <CardTitle className="text-2xl font-display font-bold text-foreground">
                1-on-1 Consulting
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Full-service personalized recruiting guidance
              </CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold text-foreground">$2,499</span>
                <p className="text-sm text-muted-foreground mt-1">One-time • 12 consulting calls included</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground text-center font-medium uppercase tracking-wide">
                Everything in Digital, plus:
              </p>
              <div className="space-y-2">
                {consultingExtras.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                      <Check className="w-2.5 h-2.5 text-success" />
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/checkout?plan=consulting" className="block">
                <Button size="lg" className="w-full h-12 font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Mobile divider */}
          <div className="flex items-center justify-center md:hidden -my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Digital Member */}
          <Card className="relative overflow-hidden border-2 border-border shadow-xl group card-hover">
            <div className="absolute top-0 right-0">
              <Badge variant="secondary" className="rounded-none rounded-bl-lg">Self-Service</Badge>
            </div>
            <CardHeader className="text-center pb-4 pt-8">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                <Monitor className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <CardTitle className="text-2xl font-display font-bold text-foreground">
                Annual Portal Membership
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Full platform access & recruiting tools
              </CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold text-foreground">$24.99</span>
                <span className="text-lg text-muted-foreground">/mo</span>
                <p className="text-sm text-muted-foreground mt-1">Cancel anytime</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground text-center font-medium uppercase tracking-wide">
                Includes:
              </p>
              <div className="space-y-2">
                {digitalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                      <Check className="w-2.5 h-2.5 text-success" />
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/checkout?plan=digital" className="block">
                <Button size="lg" variant="outline" className="w-full h-12 font-semibold rounded-full">
                  Subscribe Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/pricing">
            <Button variant="ghost" size="lg" className="rounded-full font-semibold text-primary">
              Compare All Features
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
