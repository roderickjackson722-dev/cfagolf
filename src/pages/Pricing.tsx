import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Check, X, Package, Monitor, Handshake } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CALENDLY_URL = 'https://calendly.com/contact-cfa/30min?month=2025-12';

/* ── Tier card data ── */
const toolkitFeatures = [
  "4 Copy-and-Paste Email Templates",
  "Golf Resume Template",
  "60-Second Highlight Reel Formula",
  "How to Build a Target School List",
  "4-Year Recruiting Timeline",
  "Instant Download • Lifetime Access",
];

const portalFeatures = [
  "Full College Golf Database Access",
  "Target School List Builder",
  "Tournament Result Tracker",
  "Coach Contact Tracker",
  "Campus Visit Planner",
  "Scholarship Calculator",
  "Recruiting Timeline & Worksheets",
  "LPGA & PGA Pro Webinars",
];

const consultingFeatures = [
  "Everything in Annual Portal Membership",
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
  "Ebook included",
];

type TierCard = {
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

const tiers: TierCard[] = [
  {
    title: "Want to Play College Golf?",
    description: "The complete recruiting playbook ebook",
    price: "$25",
    priceNote: "One-time purchase • Instant download",
    features: toolkitFeatures,
    ctaLabel: "Get the Ebook",
    ctaLink: "/toolkit",
    icon: Package,
  },
  {
    title: "Annual Portal Membership",
    description: "Full platform access & recruiting tools",
    price: "$299",
    priceNote: "One-time annual purchase",
    features: portalFeatures,
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

/* ── Feature comparison data ── */
type CompareFeature = {
  title: string;
  description: string;
  toolkit: boolean;
  portal: boolean;
  consulting: boolean;
};

type CompareCategory = { category: string; features: CompareFeature[] };

const compareCategories: CompareCategory[] = [
  {
    category: "Digital Tools & Platform Access",
    features: [
      { title: "Full College Golf Database Access", description: "Search and filter 1,000+ college golf programs.", toolkit: false, portal: true, consulting: true },
      { title: "Target School List Builder", description: "Create a strategic shortlist of colleges.", toolkit: false, portal: true, consulting: true },
      { title: "Tournament Result Tracker", description: "Log competitive results and build a playing resume.", toolkit: false, portal: true, consulting: true },
      { title: "Coach Contact Tracker", description: "Organize all coach communications in one place.", toolkit: false, portal: true, consulting: true },
      { title: "Campus Visit Planner", description: "Plan, track, and compare campus visits.", toolkit: false, portal: true, consulting: true },
      { title: "Scholarship Calculator", description: "Analyze and compare scholarship offers.", toolkit: false, portal: true, consulting: true },
      { title: "Recruiting Timeline & Worksheets", description: "Grade-specific action plans and checklists.", toolkit: false, portal: true, consulting: true },
    ],
  },
  {
    category: "Guides & Templates",
    features: [
      { title: "Recruiting Roadmap Guide", description: "Step-by-step guide through the recruiting process.", toolkit: true, portal: false, consulting: true },
      { title: "Coach Email Templates", description: "Proven email templates for reaching out to coaches.", toolkit: true, portal: false, consulting: true },
      { title: "Athlete Resume Builder", description: "Create a professional athletic resume.", toolkit: true, portal: false, consulting: true },
      { title: "The Recruiting Timeline (Masterclass)", description: "Written masterclass covering the full timeline.", toolkit: true, portal: false, consulting: true },
    ],
  },
  {
    category: "Webinars & Educational Content",
    features: [
      { title: "LPGA & PGA Pro Webinars", description: "Exclusive partnered webinars with golf professionals.", toolkit: false, portal: true, consulting: true },
      { title: "College Coach Q&A Sessions", description: "Learn directly from current and former college coaches.", toolkit: false, portal: false, consulting: true },
      { title: "Recruiting Strategy Workshops", description: "Self-paced workshops on recruiting best practices.", toolkit: false, portal: true, consulting: true },
    ],
  },
  {
    category: "Personalized 1-on-1 Consulting",
    features: [
      { title: "12 One-on-One Consulting Calls", description: "Personal guidance tailored to your journey.", toolkit: false, portal: false, consulting: true },
      { title: "Personalized Recruiting Roadmap", description: "Custom strategy plan for your profile.", toolkit: false, portal: false, consulting: true },
      { title: "Academic & Eligibility Evaluation", description: "In-depth assessment of your eligibility.", toolkit: false, portal: false, consulting: true },
      { title: "Coach Communication Management", description: "Expert guidance on coach outreach.", toolkit: false, portal: false, consulting: true },
      { title: "Highlight Video Review & Feedback", description: "Professional review of your highlight videos.", toolkit: false, portal: false, consulting: true },
      { title: "Scholarship Negotiation Strategy", description: "Evaluate and negotiate scholarship offers.", toolkit: false, portal: false, consulting: true },
      { title: "Campus Visit Preparation & Coaching", description: "Personalized preparation for campus visits.", toolkit: false, portal: false, consulting: true },
    ],
  },
  {
    category: "Ongoing Support",
    features: [
      { title: "Priority Email Support", description: "Direct access for quick questions between calls.", toolkit: false, portal: false, consulting: true },
      { title: "Transfer Portal Guidance", description: "Expert guidance on navigating the transfer portal.", toolkit: false, portal: false, consulting: true },
    ],
  },
];

function AvailIcon({ available }: { available: boolean }) {
  return available ? (
    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
      <Check className="w-4 h-4 text-success" />
    </div>
  ) : (
    <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
      <X className="w-4 h-4 text-destructive" />
    </div>
  );
}

const Pricing = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              Choose Your Path
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Three Ways to{' '}
              <span className="text-primary">Get Recruited</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              From DIY guides to full-service consulting — pick the option that fits your recruiting journey.
            </p>
          </div>

          {/* 3 Tier Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card
                  key={tier.title}
                  className={`relative overflow-hidden shadow-xl flex flex-col ${
                    tier.highlighted
                      ? 'border-2 border-primary md:-mt-2 md:mb-0 md:scale-[1.02]'
                      : 'border-2 border-border'
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute top-0 right-0">
                      <Badge
                        className={`rounded-none rounded-bl-lg ${
                          tier.highlighted ? 'bg-primary text-primary-foreground' : ''
                        }`}
                        variant={tier.highlighted ? 'default' : 'secondary'}
                      >
                        {tier.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-display font-bold text-foreground">
                      {tier.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {tier.description}
                    </CardDescription>
                    <div className="pt-4">
                      <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                      {tier.priceSuffix && (
                        <span className="text-lg text-muted-foreground">{tier.priceSuffix}</span>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">{tier.priceNote}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 space-y-5">
                    <div className="space-y-2.5 flex-1">
                      {tier.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 w-4 h-4 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                            <Check className="w-2.5 h-2.5 text-success" />
                          </div>
                          <span className="text-foreground text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Link to={tier.ctaLink} className="block">
                      <Button
                        size="lg"
                        className={`w-full h-12 font-semibold rounded-full ${
                          tier.highlighted ? 'cfa-gradient hover:opacity-90 transition-opacity' : ''
                        }`}
                        variant={tier.highlighted ? 'default' : 'outline'}
                      >
                        {tier.ctaLabel}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

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

          {/* ── Feature Comparison Accordion ── */}
          <div className="max-w-6xl mx-auto mt-20">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
                What's Included
              </span>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Compare <span className="text-primary">All Features</span>
              </h2>
            </div>

            {/* Sticky column headers */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center mb-2 px-4 py-3 bg-muted/50 rounded-lg sticky top-0 z-10">
              <span className="font-semibold text-foreground text-sm">Feature</span>
              <div className="text-center w-20 sm:w-28">
                <Badge variant="outline">Toolkit</Badge>
                <p className="text-[10px] text-muted-foreground mt-1">$99</p>
              </div>
              <div className="text-center w-20 sm:w-28">
                <Badge variant="secondary">Portal</Badge>
                <p className="text-[10px] text-muted-foreground mt-1">$299/yr</p>
              </div>
              <div className="text-center w-20 sm:w-28">
                <Badge className="bg-primary text-primary-foreground">Consulting</Badge>
                <p className="text-[10px] text-muted-foreground mt-1">$2,499</p>
              </div>
            </div>

            <Accordion type="multiple" defaultValue={["Digital Tools & Platform Access", "Guides & Templates"]} className="space-y-2">
              {compareCategories.map((cat) => (
                <AccordionItem key={cat.category} value={cat.category} className="border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline">
                    {cat.category}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      ({cat.features.length} features)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {cat.features.map((f, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-start py-3 border-b border-border/50 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-foreground text-sm">{f.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.description}</p>
                          </div>
                          <div className="w-20 sm:w-28 flex justify-center"><AvailIcon available={f.toolkit} /></div>
                          <div className="w-20 sm:w-28 flex justify-center"><AvailIcon available={f.portal} /></div>
                          <div className="w-20 sm:w-28 flex justify-center"><AvailIcon available={f.consulting} /></div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

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
                  Annual Portal Membership — $299
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/toolkit">
                <Button size="lg" variant="outline" className="rounded-full font-semibold px-8">
                  Recruiting Toolkit — $99
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
