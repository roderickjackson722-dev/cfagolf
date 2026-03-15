import { useState, useEffect } from 'react';
import { Navigate, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight, CreditCard, Loader2, Tag, Users, Calendar, Phone, Database, Target, Trophy, MapPin, DollarSign, Clock, Award, MessageCircle, Presentation } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { US_STATES } from '@/types/college';
import { OnboardingBookingDialog } from '@/components/OnboardingBookingDialog';

const CALENDLY_URL = 'https://calendly.com/contact-cfa/30min?month=2025-12';

const PROGRAMS = {
  consulting: {
    price: 2499,
    label: '1-on-1 Consulting Program',
    shortLabel: 'CFA 1-on-1 Consulting',
    description: 'Full-service personalized recruiting guidance with monthly coaching',
    programType: 'consulting',
    isSubscription: false,
  },
  digital: {
    price: 24.99,
    label: 'Digital Membership',
    shortLabel: 'CFA Digital Member',
    description: 'Self-service recruiting tools & resources',
    programType: 'digital',
    isSubscription: true,
  },
} as const;

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i - 1);

const consultingFeatures = [
  { icon: Phone, title: "12 One-on-One Consulting Calls", description: "Personal guidance tailored to your recruiting journey" },
  { icon: Presentation, title: "Partnered Webinars with LPGA and PGA Pros", description: "Learn from the best in the golf industry" },
  { icon: Award, title: "Sessions with Current & Former College Coaches", description: "Get insider perspectives on what coaches look for" },
  { icon: Database, title: "Full College Golf Database Access", description: "Search and filter 1,000+ college golf programs" },
  { icon: Target, title: "Personalized Target School List Building", description: "Build your dream list with expert guidance" },
  { icon: Trophy, title: "Tournament Result Tracking & Resume Building", description: "Showcase your competitive accomplishments" },
  { icon: MessageCircle, title: "Coach Contact Strategy & Follow-up Support", description: "Learn how to communicate effectively with coaches" },
  { icon: MapPin, title: "Campus Visit Preparation & Comparison", description: "Make the most of your official and unofficial visits" },
  { icon: DollarSign, title: "Scholarship Offer Analysis & Negotiation Tips", description: "Understand and compare financial aid packages" },
  { icon: Clock, title: "Recruiting Timeline & Action Plans (by grade)", description: "Know exactly what to do and when" },
  { icon: Award, title: "Highlight Review & Feedback", description: "Get expert feedback on your recruiting materials" },
  { icon: MessageCircle, title: "Priority Email Support", description: "Get answers to your questions within 24 hours" },
];

const digitalFeatures = [
  { icon: Database, title: "Full College Golf Database Access", description: "Search and filter 1,000+ college golf programs" },
  { icon: Target, title: "Target School List Builder", description: "Build and organize your dream school list" },
  { icon: Trophy, title: "Tournament Result Tracker", description: "Log and showcase your competitive results" },
  { icon: MessageCircle, title: "Coach Contact Tracker", description: "Manage outreach to college coaches" },
  { icon: MapPin, title: "Campus Visit Planner", description: "Plan and compare your campus visits" },
  { icon: DollarSign, title: "Scholarship Calculator", description: "Compare financial aid packages side by side" },
  { icon: Video, title: "LPGA & PGA Pro Webinars", description: "Learn from industry professionals" },
  { icon: Clock, title: "Recruiting Timeline & Worksheets", description: "Stay on track with guided action plans" },
  { icon: Clock, title: "Recruiting Timeline & Worksheets", description: "Stay on track with guided action plans" },
];

const transferFeatures = [
  { icon: Target, title: "Transfer Portal Strategy & Timing", description: "Navigate NCAA transfer windows and rules" },
  { icon: Award, title: "Credit Audit & Transfer Planning", description: "Map your credits for a smooth transition" },
  { icon: Clock, title: "NCAA Eligibility Verification", description: "Ensure you meet all eligibility requirements" },
  { icon: Trophy, title: "Collegiate Resume 2.0 Building", description: "Showcase your college-level experience" },
  { icon: DollarSign, title: "Scholarship Negotiation & NIL Guidance", description: "Maximize your financial package" },
  { icon: MessageCircle, title: "Coach Contact Strategy for Transfers", description: "Approach new programs effectively" },
  { icon: MapPin, title: "Campus Visit Preparation", description: "Evaluate your next school with confidence" },
  { icon: Database, title: "Full College Golf Database Access", description: "Search and filter 1,000+ programs" },
  { icon: Phone, title: "Interactive Transfer Checklist", description: "Step-by-step guidance through the process" },
  { icon: MessageCircle, title: "Priority Email Support", description: "Get answers within 24 hours" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, hasPaidAccess, signIn, signUp } = useAuth();

  // Determine which program based on URL param
  const planParam = searchParams.get('plan');
  const program = planParam === 'digital' ? PROGRAMS.digital : PROGRAMS.consulting;
  const MEMBERSHIP_PRICE = program.price;

  // Step tracking
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Account credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const [referralCode, setReferralCode] = useState('');
  const [referralApplied, setReferralApplied] = useState<{ discount: number } | null>(null);
  const [isCheckingReferral, setIsCheckingReferral] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      checkReferralCode(refCode);
    }
  }, [searchParams]);

  // If already logged in with paid access, redirect
  if (!loading && user && hasPaidAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleStep1Next = () => {
    if (!email || !password || !fullName) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  const checkPromoCode = async () => {
    const code = promoCode.toUpperCase().trim();
    if (!code) return;
    setIsCheckingPromo(true);
    
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('discount_percent, name, max_uses, uses_count')
        .eq('code', code)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data && (!data.max_uses || data.uses_count < data.max_uses)) {
        setPromoApplied({ discount: data.discount_percent, name: data.name });
        setReferralApplied(null);
        toast.success(`Promo code applied! ${data.discount_percent}% off`);
      } else {
        setPromoApplied(null);
        toast.error('Invalid or expired promo code');
      }
    } catch (err) {
      console.error('Error checking promo code:', err);
      setPromoApplied(null);
      toast.error('Failed to verify promo code');
    } finally {
      setIsCheckingPromo(false);
    }
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
    if (!email || !password || !fullName) {
      toast.error('Please complete all required fields');
      setStep(1);
      return;
    }

    setIsLoading(true);
    try {
      const profileData = {
        full_name: fullName,
        graduation_year: graduationYear ? parseInt(graduationYear) : undefined,
        high_school: highSchool || undefined,
        state: state || undefined,
        city: city || undefined,
        phone: phone || undefined,
        handicap: handicap ? parseFloat(handicap) : undefined,
        program_type: program.programType,
      };

      const { error: signUpError } = await signUp(email, password, profileData);
      if (signUpError) {
        toast.error(signUpError.message);
        setIsLoading(false);
        return;
      }

      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        toast.error('Account created but failed to sign in. Please try signing in.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-membership-checkout', {
        body: { 
          promoCode: promoApplied ? promoCode : null,
          referralCode: referralApplied && !promoApplied ? referralCode : null,
          programType: program.programType,
        },
      });

      if (error) throw error;

      if (data.freeAccess) {
        toast.success('Account created with free access!');
        // Trigger welcome email for free access
        try {
          await supabase.functions.invoke('send-welcome-email', {
            body: { email, fullName },
          });
        } catch (emailErr) {
          console.error('Welcome email error:', emailErr);
        }
        // Show onboarding dialog instead of immediate redirect
        setShowOnboardingDialog(true);
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
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              {program.label}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Start Your College Golf Journey
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete your registration to unlock expert recruiting guidance and tools.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Left: What's Included */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Card className="sticky top-4">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-display">What's Included</CardTitle>
                  <CardDescription>
                    Everything you need for a successful recruiting journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(program.programType === 'consulting' ? consultingFeatures : digitalFeatures).map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      {getActiveDiscount() > 0 && (
                        <span className="text-lg line-through text-muted-foreground">
                          ${MEMBERSHIP_PRICE.toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-primary">
                        ${getDiscountedPrice().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {program.isSubscription ? 'Monthly subscription' : '12 coaching sessions included'}
                    </p>
                    {getActiveDiscount() > 0 && (
                      <p className="text-sm text-primary font-medium mt-1">
                        You save ${(MEMBERSHIP_PRICE - getDiscountedPrice()).toLocaleString()} ({getActiveDiscount()}% off)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Signup Form */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      1
                    </div>
                    <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      2
                    </div>
                    <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      3
                    </div>
                  </div>
                  <CardTitle>
                    {step === 1 && 'Create Your Account'}
                    {step === 2 && 'Golf Profile'}
                    {step === 3 && 'Payment & Discounts'}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 && 'Enter your account details to get started'}
                    {step === 2 && 'Help us personalize your experience (optional)'}
                    {step === 3 && 'Apply any discount codes and complete checkout'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Smith"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                      </div>

                      <Button onClick={handleStep1Next} className="w-full rounded-full cfa-gradient hover:opacity-90">
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      
                      <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        These fields are optional - you can always update them later in your profile.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="graduationYear">HS Graduation Year</Label>
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
                          <Label htmlFor="handicap">Handicap</Label>
                          <Input
                            id="handicap"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 5.2"
                            value={handicap}
                            onChange={(e) => setHandicap(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="highSchool">High School</Label>
                        <Input
                          id="highSchool"
                          type="text"
                          placeholder="Your high school name"
                          value={highSchool}
                          onChange={(e) => setHighSchool(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
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
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            type="text"
                            placeholder="Your city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button onClick={() => setStep(1)} variant="outline" className="flex-1 rounded-full">
                          <ArrowLeft className="mr-2 w-4 h-4" />
                          Back
                        </Button>
                        <Button onClick={handleStep2Next} className="flex-1 rounded-full cfa-gradient hover:opacity-90">
                          Continue
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      {/* Order Summary */}
                      <div className="bg-muted/50 rounded-lg p-4 border">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <span className="font-semibold">{program.shortLabel}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {program.isSubscription
                            ? 'Monthly access to digital recruiting tools and resources.'
                            : 'Full access to recruiting tools, 12 consulting calls, and expert guidance.'}
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

                      {/* Payment Options Info */}
                      <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-pink-500/20">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">K</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                              Pay in 4 with Klarna
                              <span className="text-xs bg-pink-500/20 text-pink-600 px-2 py-0.5 rounded-full">Interest-free</span>
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Split your payment into 4 interest-free installments of{' '}
                              <span className="font-semibold text-foreground">
                                ${(getDiscountedPrice() / 4).toFixed(2)}
                              </span>
                              {' '}every 2 weeks.
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Select Klarna at checkout. No credit impact to apply.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Referral Code */}
                      <div className="space-y-2">
                        <Label htmlFor="referralCode" className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Referral Code
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="referralCode"
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

                      {/* Promo Code */}
                      <div className="space-y-2">
                        <Label htmlFor="promoCode" className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Promo Code
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="promoCode"
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

                      <Separator />

                      <div className="flex gap-3">
                        <Button onClick={() => setStep(2)} variant="outline" className="flex-1 rounded-full">
                          <ArrowLeft className="mr-2 w-4 h-4" />
                          Back
                        </Button>
                        <Button 
                          onClick={handlePayAndSignUp} 
                          disabled={isLoading} 
                          className="flex-1 rounded-full cfa-gradient hover:opacity-90"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Complete Purchase - ${getDiscountedPrice().toLocaleString()}
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="relative py-3">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">or</span>
                        </div>
                      </div>

                      <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="block">
                        <Button variant="outline" size="lg" className="w-full rounded-full">
                          <Calendar className="mr-2 w-5 h-5" />
                          Schedule Free Consultation First
                        </Button>
                      </a>

                      <p className="text-center text-sm text-muted-foreground">
                        Have questions? Email us at{' '}
                        <a href="mailto:contact@cfa.golf" className="text-primary hover:underline">
                          contact@cfa.golf
                        </a>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <OnboardingBookingDialog 
        open={showOnboardingDialog} 
        onOpenChange={(open) => {
          setShowOnboardingDialog(open);
          if (!open) {
            navigate('/dashboard');
          }
        }} 
      />
    </div>
  );
};

export default Checkout;
