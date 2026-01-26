import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReferrals } from '@/hooks/useReferrals';
import { Copy, Gift, Link, Users, DollarSign, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function ReferralCard() {
  const { 
    referral, 
    referralUses, 
    isLoading, 
    createReferralCode, 
    copyReferralLink, 
    copyReferralCode,
    totalEarnings 
  } = useReferrals();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCode = async () => {
    setIsCreating(true);
    await createReferralCode();
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!referral) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Referral Program
          </CardTitle>
          <CardDescription>
            Share CFA Golf with friends and earn rewards when they sign up!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Create your unique referral code to start sharing. Friends who sign up with your code get 10% off their membership!
            </p>
            <Button onClick={handleCreateCode} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Gift className="mr-2 w-4 h-4" />
                  Create My Referral Code
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Referral Program
        </CardTitle>
        <CardDescription>
          Share your code and earn when friends join CFA Golf
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Code Section */}
        <div className="bg-muted/50 rounded-lg p-4 border">
          <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-bold text-primary">
              {referral.referral_code}
            </span>
            <Badge variant="secondary">{referral.discount_percent}% off</Badge>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={copyReferralCode}>
              <Copy className="mr-2 w-4 h-4" />
              Copy Code
            </Button>
            <Button variant="outline" size="sm" onClick={copyReferralLink}>
              <Link className="mr-2 w-4 h-4" />
              Copy Link
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{referral.uses_count}</p>
            <p className="text-sm text-muted-foreground">Referrals</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <DollarSign className="w-6 h-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">${(totalEarnings / 100).toFixed(0)}</p>
            <p className="text-sm text-muted-foreground">Saved by Friends</p>
          </div>
        </div>

        {/* Recent Referrals */}
        {referralUses.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Recent Referrals</h4>
            <div className="space-y-2">
              {referralUses.slice(0, 5).map((use) => (
                <div 
                  key={use.id} 
                  className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg text-sm"
                >
                  <span className="text-muted-foreground">
                    {format(new Date(use.created_at), 'MMM d, yyyy')}
                  </span>
                  <span className="font-medium text-primary">
                    ${(use.discount_applied / 100).toFixed(0)} saved
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">How it works</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Share your unique referral code or link with friends</li>
            <li>They enter your code during checkout</li>
            <li>They get {referral.discount_percent}% off their membership</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
