import { Navigate, Link } from 'react-router-dom';
import { ArrowRight, Check, Calendar, X, Users, Phone } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const comparisonFeatures = [
  { feature: "Personal 1:1 Coaching Calls", cfa: true, generic: false, cfaNote: "Monthly calls with expert advisor", genericNote: "Limited or no support" },
  { feature: "LPGA/PGA Pro Webinars", cfa: true, generic: false, cfaNote: "Exclusive partnered sessions", genericNote: "Not available" },
  { feature: "College Coach Sessions", cfa: true, generic: false, cfaNote: "Direct access to coaches", genericNote: "Rarely offered" },
  { feature: "College Database Access", cfa: true, generic: true, cfaNote: "Golf-specific with rankings", genericNote: "Basic listings" },
  { feature: "Personalized Strategy", cfa: true, generic: false, cfaNote: "Custom recruiting plan", genericNote: "Generic advice" },
  { feature: "Scholarship Negotiation Help", cfa: true, generic: false, cfaNote: "Expert negotiation tips", genericNote: "Not included" },
  { feature: "Highlight Video Review", cfa: true, generic: false, cfaNote: "Professional feedback", genericNote: "Not offered" },
  { feature: "Priority Support", cfa: true, generic: false, cfaNote: "Direct email access", genericNote: "Limited availability" },
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
              Consulting Programs
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Get Personalized{' '}
              <span className="text-primary">Recruiting Guidance</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {user 
                ? "Choose the program that fits your journey."
                : "Partner with CFA for expert recruiting guidance and industry connections."}
            </p>
          </div>

          {/* Two Program Cards */}
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
                  <span className="text-5xl font-bold text-foreground">$899</span><span className="text-primary">*</span>
                  <p className="text-sm text-muted-foreground mt-2">12 modules • Monthly coaching calls</p>
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
                    Get Started - $899
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
                  <span className="text-5xl font-bold text-foreground">$499</span><span className="text-primary">*</span>
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
                    Get Started - $499
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
              Not sure which program is right? Book a free 15-minute call, or email{' '}
              <a href="mailto:contact@cfa.golf" className="text-primary hover:underline">contact@cfa.golf</a>
            </p>
          </div>

          {/* Comparison Table */}
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

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div></div>
              <Card className="p-4 text-center border-2 border-primary bg-primary/5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-bold text-foreground">CFA Golf</span>
                </div>
                <p className="text-2xl font-bold text-primary">From $499</p>
                <p className="text-xs text-muted-foreground">Per program</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="font-bold text-foreground">Other Companies</span>
                </div>
                <p className="text-2xl font-bold text-foreground">$2,000+</p>
                <p className="text-xs text-muted-foreground">Varies</p>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[280px] font-semibold">Feature</TableHead>
                    <TableHead className="text-center font-semibold text-primary">CFA Golf</TableHead>
                    <TableHead className="text-center font-semibold">Other Companies</TableHead>
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

            <div className="text-center mt-12">
              <p className="text-lg text-muted-foreground mb-6">
                Ready to get <span className="text-primary font-semibold">personalized guidance</span> instead of generic templates?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/checkout">
                  <Button size="lg" className="rounded-full font-semibold px-8 cfa-gradient hover:opacity-90 transition-opacity">
                    12-Module Program - $899
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/checkout?plan=transfer">
                  <Button size="lg" variant="outline" className="rounded-full font-semibold px-8">
                    Transfer Program - $499
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
