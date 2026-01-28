import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { US_STATES } from '@/types/college';
import { ArrowLeft, ArrowRight, CreditCard, Loader2, Tag, Check, Users } from 'lucide-react';

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i - 1);

const MEMBERSHIP_PRICE = 1999.99;

export function AuthForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Sign in state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign up state - Step tracking
  const [signUpStep, setSignUpStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Account credentials
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Step 2: Golf profile
  const [graduationYear, setGraduationYear] = useState<string>('');
  const [highSchool, setHighSchool] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [handicap, setHandicap] = useState('');
  
  // Step 3: Payment
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ discount: number; name: string } | null>(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  
  // Referral code support
  const [referralCode, setReferralCode] = useState('');
  const [referralApplied, setReferralApplied] = useState<{ discount: number } | null>(null);
  const [isCheckingReferral, setIsCheckingReferral] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      checkReferralCode(refCode);
    }
  }, [searchParams]);

  const handleSignIn = async () => {
    if (!signInEmail || !signInPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(signInEmail, signInPassword);
      if (error) {
        toast.error(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep1Next = () => {
    if (!signUpEmail || !signUpPassword || !fullName) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (signUpPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSignUpStep(2);
  };

  const handleStep2Next = () => {
    setSignUpStep(3);
  };

  const handleStep2Back = () => {
    setSignUpStep(1);
  };

  const handleStep3Back = () => {
    setSignUpStep(2);
  };

  const checkPromoCode = () => {
    const code = promoCode.toUpperCase().trim();
    setIsCheckingPromo(true);
    
    // Simulate checking - these match the edge function
    setTimeout(() => {
      if (code === 'FOUNDERS50') {
        setPromoApplied({ discount: 50, name: 'Founders Fee - 50% Off' });
        setReferralApplied(null); // Clear referral if promo is applied
        toast.success('Promo code applied! 50% off');
      } else if (code === 'CFAADMIN2025') {
        setPromoApplied({ discount: 100, name: 'Admin Access - Free' });
        setReferralApplied(null);
        toast.success('Promo code applied! Free access');
      } else if (code) {
        setPromoApplied(null);
        toast.error('Invalid promo code');
      }
      setIsCheckingPromo(false);
    }, 500);
  };

  const checkReferralCode = async (code?: string) => {
    const codeToCheck = (code || referralCode).toUpperCase().trim();
    if (!codeToCheck) return;
    
    setIsCheckingReferral(true);
    
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('discount_percent, is_active')
        .eq('referral_code', codeToCheck)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setReferralApplied({ discount: data.discount_percent });
        if (!promoApplied) {
          toast.success(`Referral code applied! ${data.discount_percent}% off`);
        }
      } else {
        setReferralApplied(null);
        if (code) {
          // Only show error if manually entered (not from URL)
        } else {
          toast.error('Invalid referral code');
        }
      }
    } catch (error) {
      console.error('Error checking referral:', error);
      setReferralApplied(null);
    } finally {
      setIsCheckingReferral(false);
    }
  };

  const getDiscountedPrice = () => {
    if (promoApplied && promoApplied.discount > 0) {
      return MEMBERSHIP_PRICE * (1 - promoApplied.discount / 100);
    }
    if (referralApplied && referralApplied.discount > 0) {
      return MEMBERSHIP_PRICE * (1 - referralApplied.discount / 100);
    }
    return MEMBERSHIP_PRICE;
  };

  const getActiveDiscount = () => {
    if (promoApplied) return promoApplied.discount;
    if (referralApplied) return referralApplied.discount;
    return 0;
  };

  const handlePayAndSignUp = async () => {
    if (!signUpEmail || !signUpPassword || !fullName) {
      toast.error('Please complete all required fields');
      setSignUpStep(1);
      return;
    }

    setIsLoading(true);
    try {
      // First create the account
      const profileData = {
        full_name: fullName,
        graduation_year: graduationYear ? parseInt(graduationYear) : undefined,
        high_school: highSchool || undefined,
        state: state || undefined,
        city: city || undefined,
        phone: phone || undefined,
        handicap: handicap ? parseFloat(handicap) : undefined,
      };

      const { error: signUpError } = await signUp(signUpEmail, signUpPassword, profileData);
      if (signUpError) {
        toast.error(signUpError.message);
        setIsLoading(false);
        return;
      }

      // Sign in immediately after signup
      const { error: signInError } = await signIn(signUpEmail, signUpPassword);
      if (signInError) {
        toast.error('Account created but failed to sign in. Please try signing in.');
        setIsLoading(false);
        return;
      }

      // Now proceed with checkout
      const { data, error } = await supabase.functions.invoke('create-membership-checkout', {
        body: { 
          promoCode: promoApplied ? promoCode : null,
          referralCode: referralApplied && !promoApplied ? referralCode : null,
        },
      });

      if (error) throw error;

      if (data.freeAccess) {
        toast.success('Account created with free access!');
        navigate('/dashboard');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Signup/payment error:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSignUpStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name *</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="John Smith"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email *</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={signUpEmail}
          onChange={(e) => setSignUpEmail(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password *</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
        />
      </div>

      <Button onClick={handleStep1Next} className="w-full rounded-pill">
        Continue
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );

  const renderSignUpStep2 = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-3">Golf Profile (optional - can edit later)</p>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="signup-graduation">HS Graduation Year</Label>
          <Select value={graduationYear} onValueChange={setGraduationYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {graduationYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-handicap">Avg 18-Hole Score</Label>
          <Input
            id="signup-handicap"
            type="number"
            step="1"
            placeholder="e.g., 75"
            value={handicap}
            onChange={(e) => setHandicap(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-highschool">High School</Label>
        <Input
          id="signup-highschool"
          type="text"
          placeholder="Your high school name"
          value={highSchool}
          onChange={(e) => setHighSchool(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="signup-state">State</Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-city">City</Label>
          <Input
            id="signup-city"
            type="text"
            placeholder="Your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-phone">Phone Number</Label>
        <Input
          id="signup-phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleStep2Back} variant="outline" className="flex-1">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleStep2Next} className="flex-1">
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderSignUpStep3 = () => (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-lg p-4 border">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <span className="font-semibold">CFA Annual Consulting Membership</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Full access to recruiting tools, monthly coaching calls, and expert guidance.
        </p>
        
        <div className="flex items-baseline gap-2">
          {getActiveDiscount() > 0 && (
            <span className="text-lg line-through text-muted-foreground">
              ${MEMBERSHIP_PRICE.toLocaleString()}
            </span>
          )}
          <span className="text-2xl font-bold text-primary">
            ${getDiscountedPrice().toLocaleString()}
          </span>
          {getActiveDiscount() > 0 && (
            <span className="text-sm text-primary font-medium">
              ({getActiveDiscount()}% off)
            </span>
          )}
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="space-y-2">
        <Label htmlFor="referral-code" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Referral Code
        </Label>
        <div className="flex gap-2">
          <Input
            id="referral-code"
            type="text"
            placeholder="Enter referral code"
            value={referralCode}
            onChange={(e) => {
              setReferralCode(e.target.value);
              setReferralApplied(null);
            }}
            className="flex-1"
            disabled={!!promoApplied}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => checkReferralCode()}
            disabled={!referralCode || isCheckingReferral || !!promoApplied}
          >
            {isCheckingReferral ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : referralApplied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              'Apply'
            )}
          </Button>
        </div>
        {referralApplied && !promoApplied && (
          <p className="text-sm text-primary font-medium flex items-center gap-1">
            <Check className="w-4 h-4" />
            Referral Discount - {referralApplied.discount}% Off
          </p>
        )}
      </div>

      {/* Promo Code Section */}
      <div className="space-y-2">
        <Label htmlFor="promo-code" className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Promo Code
        </Label>
        <div className="flex gap-2">
          <Input
            id="promo-code"
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value);
              setPromoApplied(null);
            }}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={checkPromoCode}
            disabled={!promoCode || isCheckingPromo}
          >
            {isCheckingPromo ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : promoApplied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              'Apply'
            )}
          </Button>
        </div>
        {promoApplied && (
          <p className="text-sm text-primary font-medium flex items-center gap-1">
            <Check className="w-4 h-4" />
            {promoApplied.name}
          </p>
        )}
        <p className="text-xs text-muted-foreground">Promo codes override referral discounts</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleStep3Back} variant="outline" className="flex-1" disabled={isLoading}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handlePayAndSignUp} className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : promoApplied?.discount === 100 ? (
            'Complete Sign Up'
          ) : (
            <>
              <CreditCard className="mr-2 w-4 h-4" />
              Pay ${getDiscountedPrice().toLocaleString()}
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Secure payment powered by Stripe. Your card will be charged ${getDiscountedPrice().toLocaleString()}.
      </p>
    </div>
  );

  const getStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            signUpStep >= step
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto shadow-card border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-display">Welcome to CFA Golf</CardTitle>
        <CardDescription>
          Sign in or create an account to access recruiting tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin" onClick={() => setSignUpStep(1)}>Sign In</TabsTrigger>
            <TabsTrigger value="signup" onClick={() => setSignUpStep(1)}>Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSignIn} 
              className="w-full rounded-pill"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </TabsContent>

          <TabsContent value="signup">
            {getStepIndicator()}
            {signUpStep === 1 && renderSignUpStep1()}
            {signUpStep === 2 && renderSignUpStep2()}
            {signUpStep === 3 && renderSignUpStep3()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
