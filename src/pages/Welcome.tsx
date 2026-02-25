import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Calendar, ExternalLink, CheckCircle2, GraduationCap, Users, Target, BarChart3 } from 'lucide-react';
import cfaLogo from '@/assets/cfa-logo.png';

const CALENDLY_LINK = "https://calendly.com/contact-cfa/30min";

const Welcome = () => {
  const { user, loading, hasPaidAccess } = useAuth();

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  const handleScheduleClick = () => {
    window.open(CALENDLY_LINK, '_blank', 'noopener,noreferrer');
  };

  const benefits = [
    { icon: GraduationCap, title: 'College Database', description: 'Search 800+ golf programs across all divisions' },
    { icon: Target, title: 'Recruiting Tools', description: 'Target school builder, coach tracker, and campus visit logs' },
    { icon: BarChart3, title: 'Scholarship Calculator', description: 'Compare financial aid offers side by side' },
    { icon: Users, title: 'Expert Coaching', description: 'Monthly strategy calls and personalized guidance' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container max-w-3xl mx-auto px-4 relative text-center space-y-6">
            <img src={cfaLogo} alt="CFA Golf" className="w-20 h-20 mx-auto object-contain" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Welcome to the CFA Family!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              You've taken the first step toward your college golf journey. We're excited to help you find the perfect program and navigate the recruiting process with confidence.
            </p>
          </div>
        </section>

        {/* What's Included */}
        <section className="pb-12 md:pb-16">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-display font-semibold text-center mb-8 text-foreground">
              What's Included in Your Membership
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b) => (
                <Card key={b.title} className="border-border/50">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2.5 flex-shrink-0">
                      <b.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{b.title}</h3>
                      <p className="text-sm text-muted-foreground">{b.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Book Onboarding Call */}
        <section className="pb-16 md:pb-24">
          <div className="container max-w-2xl mx-auto px-4">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
              <CardContent className="p-8 md:p-10 text-center space-y-6">
                <div className="mx-auto bg-primary/15 w-16 h-16 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    Your Next Step: Book Your Onboarding Call
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Schedule a 30-minute call with your advisor to get a personalized walkthrough of all your tools and create your recruiting game plan.
                  </p>
                </div>

                <div className="space-y-2 text-left max-w-sm mx-auto">
                  {[
                    'Personalized tool walkthrough',
                    'Recruiting strategy session',
                    'Goal-setting & timeline planning',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleScheduleClick}
                  size="lg"
                  className="gap-2 text-base px-8"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Your Onboarding Call
                  <ExternalLink className="w-4 h-4" />
                </Button>

                <p className="text-xs text-muted-foreground">
                  Free 30-minute call · No obligation · Get started right away
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Welcome;
