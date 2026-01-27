import { Navigate, Link } from 'react-router-dom';
import { ArrowRight, Check, Calendar, X, Users, Bot, Phone } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const comparisonFeatures = [
  {
    feature: "Personal 1:1 Coaching Calls",
    cfa: true,
    ncsa: false,
    generic: false,
    cfaNote: "Monthly calls with expert advisor",
    ncsaNote: "Self-service platform",
    genericNote: "Limited or no support"
  },
  {
    feature: "LPGA/PGA Pro Webinars",
    cfa: true,
    ncsa: false,
    generic: false,
    cfaNote: "Exclusive partnered sessions",
    ncsaNote: "Not available",
    genericNote: "Not available"
  },
  {
    feature: "College Coach Sessions",
    cfa: true,
    ncsa: false,
    generic: false,
    cfaNote: "Direct access to coaches",
    ncsaNote: "Coach database only",
    genericNote: "Rarely offered"
  },
  {
    feature: "College Database Access",
    cfa: true,
    ncsa: true,
    generic: true,
    cfaNote: "Golf-specific with rankings",
    ncsaNote: "Multi-sport database",
    genericNote: "Basic listings"
  },
  {
    feature: "Personalized Strategy",
    cfa: true,
    ncsa: false,
    generic: false,
    cfaNote: "Custom recruiting plan",
    ncsaNote: "Templated guidance",
    genericNote: "Generic advice"
  },
  {
    feature: "Scholarship Negotiation Help",
    cfa: true,
    ncsa: false,
    generic: false,
    cfaNote: "Expert negotiation tips",
    ncsaNote: "Not included",
    genericNote: "Not included"
  },
  {
    feature: "Highlight Video Review",
    cfa: true,
    ncsa: false,
    generic: false,
    cfaNote: "Professional feedback",
    ncsaNote: "DIY tools only",
    genericNote: "Not offered"
  },
  {
    feature: "Priority Support",
    cfa: true,
    ncsa: false,
    generic: false,
    cfaNote: "Direct email access",
    ncsaNote: "Ticket-based support",
    genericNote: "Limited availability"
  }
];

const Pricing = () => {
  const { user, loading, hasPaidAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If already paid, redirect to dashboard
  if (user && hasPaidAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            6-Month Consulting
          </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Get Personalized{' '}
              <span className="text-primary">Recruiting Guidance</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {user 
                ? "Upgrade to our 6-month consulting service for hands-on support."
                : "Partner with CFA for 6 months of expert recruiting guidance and industry connections."}
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
              <CardHeader className="text-center pb-4 pt-8">
              <CardTitle className="text-2xl font-display font-bold text-foreground">
                CFA 6-Month Consulting
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Complete hands-on recruiting guidance for junior golfers
              </CardDescription>
              <div className="pt-6">
                <span className="text-5xl font-bold text-foreground">$1,999</span>
                <p className="text-sm text-muted-foreground mt-2">6-month commitment • Monthly coaching calls included</p>
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

                {user ? (
                  <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
                    Start Consulting - $1,999
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
                    Get Started Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                )}

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
                  Have questions? Book a free 15-minute call with our team, or email us at{' '}
                  <a href="mailto:contact@cfa.golf" className="text-primary hover:underline">
                    contact@cfa.golf
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Table Section */}
          <div className="mt-24 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
                Why Choose CFA?
              </span>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                See How We <span className="text-primary">Compare</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Unlike automated platforms, CFA provides personalized, hands-on coaching from industry experts who know the college golf recruiting landscape.
              </p>
            </div>

            {/* Provider Headers */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div></div>
              <Card className="p-4 text-center border-2 border-primary bg-primary/5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-bold text-foreground">CFA Golf</span>
                </div>
                <p className="text-2xl font-bold text-primary">$1,999</p>
                <p className="text-xs text-muted-foreground">6 months</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-muted-foreground" />
                  <span className="font-bold text-foreground">NCSA</span>
                </div>
                <p className="text-2xl font-bold text-foreground">$2,000–$6,000</p>
                <p className="text-xs text-muted-foreground">Annual</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="font-bold text-foreground">Other Services</span>
                </div>
                <p className="text-2xl font-bold text-foreground">$1,200–$5,000</p>
                <p className="text-xs text-muted-foreground">Varies</p>
              </Card>
            </div>

            {/* Comparison Table */}
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[280px] font-semibold">Feature</TableHead>
                    <TableHead className="text-center font-semibold text-primary">CFA Golf</TableHead>
                    <TableHead className="text-center font-semibold">NCSA</TableHead>
                    <TableHead className="text-center font-semibold">Other Services</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonFeatures.map((item, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                      <TableCell className="font-medium">{item.feature}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-success" />
                          </div>
                          <span className="text-xs text-muted-foreground hidden md:block">{item.cfaNote}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          {item.ncsa ? (
                            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-success" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                              <X className="w-4 h-4 text-destructive" />
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground hidden md:block">{item.ncsaNote}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          {item.generic ? (
                            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-success" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                              <X className="w-4 h-4 text-destructive" />
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground hidden md:block">{item.genericNote}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Bottom CTA */}
            <div className="text-center mt-12">
              <p className="text-lg text-muted-foreground mb-6">
                Ready to get <span className="text-primary font-semibold">personalized guidance</span> instead of generic templates?
              </p>
              <Link to="/checkout">
                <Button size="lg" className="rounded-full font-semibold px-8 cfa-gradient hover:opacity-90 transition-opacity">
                  Get Started with CFA
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
