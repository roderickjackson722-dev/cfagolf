import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const CoachLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'forgot' | 'request'>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [reqForm, setReqForm] = useState({
    full_name: '',
    email: '',
    college_name: '',
    title: '',
    conference: '',
    phone: '',
    message: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      return;
    }
    navigate('/coach/dashboard');
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/coach/dashboard`,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Check your email', description: 'A reset link has been sent.' });
    setMode('login');
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('coach_access_requests').insert(reqForm);
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Request submitted', description: 'We\'ll review and email you shortly.' });
    setReqForm({ full_name: '', email: '', college_name: '', title: '', conference: '', phone: '', message: '' });
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                {mode === 'login' && 'Coaches Portal'}
                {mode === 'forgot' && 'Reset Password'}
                {mode === 'request' && 'Request Access'}
              </CardTitle>
              <CardDescription>
                {mode === 'login' && 'Sign in to manage your profile and inbox'}
                {mode === 'forgot' && 'Enter your email to receive a reset link'}
                {mode === 'request' && 'Tell us about your program — we\'ll set up your account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in…' : 'Login'}
                  </Button>
                  <div className="flex justify-between text-sm">
                    <button type="button" className="text-primary hover:underline" onClick={() => setMode('forgot')}>
                      Forgot password?
                    </button>
                    <button type="button" className="text-primary hover:underline" onClick={() => setMode('request')}>
                      Request access
                    </button>
                  </div>
                </form>
              )}

              {mode === 'forgot' && (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="femail">Email</Label>
                    <Input id="femail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending…' : 'Send reset link'}
                  </Button>
                  <button type="button" className="w-full text-sm text-muted-foreground hover:text-foreground" onClick={() => setMode('login')}>
                    Back to login
                  </button>
                </form>
              )}

              {mode === 'request' && (
                <form onSubmit={handleRequest} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="rname">Full name *</Label>
                    <Input id="rname" required value={reqForm.full_name} onChange={(e) => setReqForm({ ...reqForm, full_name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="remail">Email *</Label>
                    <Input id="remail" type="email" required value={reqForm.email} onChange={(e) => setReqForm({ ...reqForm, email: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="rcollege">College *</Label>
                    <Input id="rcollege" required value={reqForm.college_name} onChange={(e) => setReqForm({ ...reqForm, college_name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="rtitle">Title</Label>
                      <Input id="rtitle" value={reqForm.title} onChange={(e) => setReqForm({ ...reqForm, title: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="rconf">Conference</Label>
                      <Input id="rconf" value={reqForm.conference} onChange={(e) => setReqForm({ ...reqForm, conference: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="rphone">Phone</Label>
                    <Input id="rphone" value={reqForm.phone} onChange={(e) => setReqForm({ ...reqForm, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="rmsg">Message</Label>
                    <Textarea id="rmsg" rows={3} value={reqForm.message} onChange={(e) => setReqForm({ ...reqForm, message: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Submitting…' : 'Submit request'}
                  </Button>
                  <button type="button" className="w-full text-sm text-muted-foreground hover:text-foreground" onClick={() => setMode('login')}>
                    Back to login
                  </button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoachLogin;
