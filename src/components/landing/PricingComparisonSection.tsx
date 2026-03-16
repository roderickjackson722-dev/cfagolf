import { Check, ArrowRight, Package, Monitor, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const toolkitFeatures = [
  "Recruiting Roadmap Guide",
  "Coach Email Templates",
  "Athlete Resume Builder",
  "The Recruiting Timeline (Written Masterclass)",
  "Lifetime Access",
];

const digitalFeatures = [
  "Full College Golf Database Access",
  "Target School List Builder",
  "Tournament Result Tracker",
  "Coach Contact Tracker",
  "Campus Visit Planner",
  "Scholarship Calculator",
  "Recruiting Timeline & Worksheets",
  "LPGA & PGA Pro Webinars",
  "Free Toolkit after 6 months",
];

const consultingFeatures = [
  "Everything in Digital Member",
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
  "Free Toolkit included",
];

type PricingCard = {
  title: string;
  description: string;
  price: string;
  priceSuffix?: string;
  priceNote: string;
  features: string[];
  ctaLabel: string;
  ctaLink: string;
  icon: typeof Package;
  badge?: string;
  highlighted?: boolean;
};

const cards: PricingCard[] = [
  {
    title: "Recruiting Toolkit",
    description: "Guides, templates & masterclass",
    price: "$99",
    priceNote: "One-time purchase • Lifetime access",
    features: toolkitFeatures,
    ctaLabel: "Buy the Toolkit",
    ctaLink: "/toolkit",
    icon: Package,
  },
  {
    title: "Digital Member",
    description: "DIY recruiting tools & resources",
    price: "$24.99",
    priceSuffix: "/mo",
    priceNote: "Monthly subscription • Cancel anytime",
    features: digitalFeatures,
    ctaLabel: "Subscribe Now",
    ctaLink: "/checkout?plan=digital",
    icon: Monitor,
    badge: "Self-Service",
  },
  {
    title: "1-on-1 Consulting",
    description: "Full-service personalized guidance",
    price: "$2,499",
    priceNote: "One-time • 12 consulting calls included",
    features: consultingFeatures,
    ctaLabel: "Get Started",
    ctaLink: "/checkout?plan=consulting",
    icon: Handshake,
    badge: "Most Comprehensive",
    highlighted: true,
  },
];

export function PricingComparisonSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            Choose Your Path
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Three Ways to{' '}
            <span className="text-primary">Get Recruited</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From DIY guides to full-service consulting — pick the option that fits your recruiting journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className={`relative overflow-hidden shadow-xl flex flex-col ${
                  card.highlighted
                    ? 'border-2 border-primary md:-mt-2 md:mb-0 md:scale-[1.02]'
                    : 'border-2 border-border'
                }`}
              >
                {card.badge && (
                  <div className="absolute top-0 right-0">
                    <Badge
                      className={`rounded-none rounded-bl-lg ${
                        card.highlighted
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }`}
                      variant={card.highlighted ? 'default' : 'secondary'}
                    >
                      {card.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-display font-bold text-foreground">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {card.description}
                  </CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-foreground">{card.price}</span>
                    {card.priceSuffix && (
                      <span className="text-lg text-muted-foreground">{card.priceSuffix}</span>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">{card.priceNote}</p>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 space-y-5">
                  <div className="space-y-2.5 flex-1">
                    {card.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                          <Check className="w-2.5 h-2.5 text-success" />
                        </div>
                        <span className="text-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to={card.ctaLink} className="block">
                    <Button
                      size="lg"
                      className={`w-full h-12 font-semibold rounded-full ${
                        card.highlighted
                          ? 'cfa-gradient hover:opacity-90 transition-opacity'
                          : ''
                      }`}
                      variant={card.highlighted ? 'default' : 'outline'}
                    >
                      {card.ctaLabel}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
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
