import { Check, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CALENDLY_URL = 'https://calendly.com/contact-cfa/30min?month=2025-12';

const hsFeatures = [
  "Monthly One-on-One Coaching Calls",
  "Partnered Webinars with LPGA and PGA Pros",
  "Sessions with Current & Former College Coaches",
  "Full College Golf Database Access",
  "Personalized Target School List Building",
  "Tournament Result Tracking & Resume Building",
  "Coach Contact Strategy & Follow-up Support",
  "Campus Visit Preparation & Comparison",
  "Scholarship Offer Analysis & Negotiation Tips",
  "Recruiting Timeline & Action Plans (by grade)",
  "Highlight Video Review & Feedback",
  "Priority Email Support"
];

const transferFeatures = [
  "Transfer Portal Strategy & Timing",
  "Credit Audit & Transfer Planning",
  "NCAA Eligibility Verification",
  "Collegiate Resume 2.0 Building",
  "Scholarship Negotiation & NIL Guidance",
  "Coach Contact Strategy for Transfers",
  "Campus Visit Preparation",
  "Full College Golf Database Access",
  "Interactive Transfer Checklist",
  "Priority Email Support"
];

export function PricingSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Consulting Programs
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Personalized Guidance,{' '}
            <span className="text-primary">Proven Results</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the program that fits your recruiting journey — whether you're a high school prospect or a college transfer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* High School Program */}
          <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
            <div className="absolute top-0 right-0">
              <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">Most Popular</Badge>
            </div>
            <CardHeader className="text-center pb-4 pt-8">
              <CardTitle className="text-2xl font-display font-bold text-foreground">
                12-Module Program
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                For high school junior golfers
              </CardDescription>
              <div className="pt-6">
                <span className="text-5xl font-bold text-foreground">$899</span>
                <p className="text-sm text-muted-foreground mt-2">12 modules • One-on-one coaching calls included</p>
                <p className="text-xs text-muted-foreground mt-1">*Payment plans available</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {hsFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/checkout" className="block">
                <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Transfer Program */}
          <Card className="relative overflow-hidden border-2 border-border shadow-xl">
            <div className="absolute top-0 right-0">
              <Badge variant="secondary" className="rounded-none rounded-bl-lg">Transfer Students</Badge>
            </div>
            <CardHeader className="text-center pb-4 pt-8">
              <CardTitle className="text-2xl font-display font-bold text-foreground">
                6-Module Transfer Program
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                For college athletes in the transfer portal
              </CardDescription>
              <div className="pt-6">
                <span className="text-5xl font-bold text-foreground">$499</span>
                <p className="text-sm text-muted-foreground mt-2">6 modules • Transfer-specific coaching</p>
                <p className="text-xs text-muted-foreground mt-1">*Payment plans available</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {transferFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/checkout?plan=transfer" className="block">
                <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Consultation CTA */}
        <div className="text-center mt-10">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="rounded-full font-semibold">
              <Calendar className="mr-2 w-5 h-5" />
              Schedule Free Consultation
            </Button>
          </a>
          <p className="text-sm text-muted-foreground mt-3">
            Not sure which program is right? Book a free 15-minute call with our team
          </p>
        </div>
      </div>
    </section>
  );
}
