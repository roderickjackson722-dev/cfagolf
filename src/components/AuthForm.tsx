import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { US_STATES } from '@/types/college';

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i - 1);

export function AuthForm() {
  // Sign in state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign up state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState<string>('');
  const [highSchool, setHighSchool] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [handicap, setHandicap] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

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
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpEmail || !signUpPassword || !fullName) {
      toast.error('Please fill in all required fields');
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
      };

      const { error } = await signUp(signUpEmail, signUpPassword, profileData);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! You can now sign in.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-display">Welcome to CFA Golf</CardTitle>
        <CardDescription>
          Sign in to access the college golf database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
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

          <TabsContent value="signup" className="space-y-4">
            {/* Required Fields */}
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

            {/* Golf Profile Fields */}
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-3">Golf Profile (can edit later)</p>
              
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
                  <Label htmlFor="signup-handicap">Handicap</Label>
                  <Input
                    id="signup-handicap"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 5.2"
                    value={handicap}
                    onChange={(e) => setHandicap(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-3">
                <Label htmlFor="signup-highschool">High School</Label>
                <Input
                  id="signup-highschool"
                  type="text"
                  placeholder="Your high school name"
                  value={highSchool}
                  onChange={(e) => setHighSchool(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
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

              <div className="space-y-2 mt-3">
                <Label htmlFor="signup-phone">Phone Number</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleSignUp} 
              className="w-full rounded-pill mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              * Required fields. You can update your profile anytime after signing up.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
