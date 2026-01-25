import { Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

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
            Premium Access Required
          </CardTitle>
          <CardDescription className="text-base">
            Unlock the full college golf database with a CFA Golf membership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Full College Database Access</p>
                <p className="text-sm text-muted-foreground">Search and filter 500+ golf programs</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Save Favorite Colleges</p>
                <p className="text-sm text-muted-foreground">Build your recruiting list</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Academic & Cost Filters</p>
                <p className="text-sm text-muted-foreground">Find programs that match your profile</p>
              </div>
            </div>
          </div>

          {user ? (
            <div className="space-y-3">
              <Button className="w-full rounded-pill h-12 text-base" size="lg">
                <CreditCard className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Contact support to activate your membership
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Link to="/login" className="block">
                <Button className="w-full rounded-pill h-12 text-base" size="lg">
                  Sign In to Continue
                </Button>
              </Link>
              <p className="text-center text-sm text-muted-foreground">
                Already a member? Sign in to access the database
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
