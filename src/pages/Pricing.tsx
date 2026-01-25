import { Navigate, Link } from 'react-router-dom';
import { ArrowRight, Check, Star } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  "Full College Golf Database Access",
  "Target School List Builder",
  "Swing Video Shot List & Specs",
  "Tournament Result Log Template",
  "Coach Contact Tracker",
  "Pre-Call Question Prep Sheet",
  "Campus Visit Comparison Worksheet",
  "Scholarship Offer Analysis Calculator",
  "12-Month Recruiting Timeline (by grade)",
  "Highlight Video Review Tips",
  "Save Favorite Schools",
  "Compare Colleges Side-by-Side"
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
              Unlock Full Access
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Get the Complete{' '}
              <span className="text-primary">Recruiting Toolkit</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {user 
                ? "Upgrade your account to access all tools and features."
                : "Join CFA to access the full suite of recruiting tools and college database."}
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
              {/* Popular badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-bl-lg flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Best Value
                </div>
              </div>

              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-2xl font-display font-bold text-foreground">
                  CFA Membership
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Complete recruiting toolkit for junior golfers
                </CardDescription>
                <div className="pt-6">
                  <span className="text-5xl font-bold text-foreground">$299</span>
                  <span className="text-xl text-muted-foreground">.99</span>
                  <p className="text-sm text-muted-foreground mt-2">One-time payment • Lifetime access</p>
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
                    Upgrade Now - $299.99
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <Link to="/login" className="block">
                    <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90 transition-opacity">
                      Sign Up & Purchase
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                )}

                <p className="text-center text-sm text-muted-foreground">
                  Questions? Email us at{' '}
                  <a href="mailto:info@cfa.golf" className="text-primary hover:underline">
                    info@cfa.golf
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
