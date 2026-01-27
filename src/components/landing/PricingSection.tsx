import { Check, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CALENDLY_URL = 'https://calendly.com/contact-cfa/30min?month=2025-12';

const features = [
  "Monthly One-on-One Coaching Calls",
  "Partnered Webinars with LPGA and PGA Pros",
  "Sessions with Current & Former College Coaches",
  "Full College Golf Database Access",
  "Personalized Target School List Building",
  "Tournament Result Tracking & Resume Building",
  "Coach Contact Strategy & Follow-up Support",
  "Campus Visit Preparation & Comparison",
  "Scholarship Offer Analysis & Negotiation Tips",
  "12-Month Recruiting Timeline (by grade)",
  "Highlight Video Review & Feedback",
  "Priority Email Support"
];

export function PricingSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
          Annual Consulting
        </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Personalized Guidance,{' '}
            <span className="text-primary">Proven Results</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Partner with our expert team for a full year of hands-on recruiting support and industry connections.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
            <CardHeader className="text-center pb-4 pt-8">
            <CardTitle className="text-2xl font-display font-bold text-foreground">
              CFA Annual Consulting
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Complete hands-on recruiting guidance for junior golfers
            </CardDescription>
            <div className="pt-6">
              <span className="text-5xl font-bold text-foreground">$1,999</span>
              <p className="text-sm text-muted-foreground mt-2">Annual commitment • Monthly coaching calls included</p>
            </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to="/checkout" className="block">
                <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" size="lg" className="w-full h-14 text-lg font-semibold rounded-full">
                  <Calendar className="mr-2 w-5 h-5" />
                  Schedule Free Consultation
                </Button>
              </a>

              <p className="text-center text-sm text-muted-foreground">
                Have questions? Book a free 15-minute call with our team
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
