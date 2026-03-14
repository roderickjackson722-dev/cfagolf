import { Lock, CreditCard, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const CALENDLY_URL = 'https://calendly.com/contact-cfa/30min?month=2025-12';

export function PaywallGate() {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-lg shadow-xl border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-display">
            Join CFA Golf
          </CardTitle>
          <CardDescription className="text-base">
            Get full access to our college golf database and recruiting tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Full College Database Access</p>
                <p className="text-sm text-muted-foreground">Search and filter 1,000+ golf programs</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Complete Recruiting Toolkit</p>
                <p className="text-sm text-muted-foreground">Target schools, coach tracker, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Monthly Coaching Calls</p>
                <p className="text-sm text-muted-foreground">One-on-one guidance from experts</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/pricing" className="block">
              <Button className="w-full rounded-full h-12 text-base cfa-gradient hover:opacity-90" size="lg">
                <CreditCard className="w-5 h-5 mr-2" />
                View Membership Options
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full rounded-full h-12 text-base" size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Free Consultation
              </Button>
            </a>
            
            <p className="text-center text-sm text-muted-foreground">
              Have questions? Book a free 15-minute call with our team
            </p>
          </div>

          {!user && (
            <div className="pt-4 border-t">
              <p className="text-center text-sm text-muted-foreground">
                Already a member?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
