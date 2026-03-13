import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const consultingHighlights = [
  "Everything in Digital Member",
  "Monthly 1-on-1 Coaching Calls (12 Sessions)",
  "Personalized Recruiting Roadmap",
  "Academic & Eligibility Evaluation",
  "Coach Communication Management",
  "Highlight Video Review & Feedback",
  "Scholarship Negotiation Strategy",
  "Campus Visit Preparation & Coaching",
  "Transfer Portal Guidance",
  "Priority Email Support"
];

const digitalHighlights = [
  "Full College Golf Database Access",
  "Target School List Builder",
  "Tournament Result Tracker",
  "Coach Contact Tracker",
  "Campus Visit Planner",
  "Scholarship Calculator",
  "LPGA & PGA Pro Webinars",
  "College Coach Q&A Sessions",
  "Recruiting Timeline & Worksheets"
];

export function PricingSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Pricing
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Personalized Guidance,{' '}
            <span className="text-primary">Proven Results</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your recruiting journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto relative">
          {/* 1-on-1 Consulting */}
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
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {consultingHighlights.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/checkout?plan=consulting" className="block">
                <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Digital Member */}
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
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {digitalHighlights.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/checkout?plan=digital" className="block">
                <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
                  Subscribe Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Link to full comparison */}
        <div className="text-center mt-10">
          <Link to="/pricing">
            <Button variant="ghost" size="lg" className="rounded-full font-semibold text-primary">
              See Full Feature Comparison
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
