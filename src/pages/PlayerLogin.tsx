import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

const PlayerLogin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'login' | 'reset'>('login');

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (user) return <Navigate to="/player/dashboard" replace />;

  const handleLogin = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate('/player/dashboard');
  };

  const handleReset = async () => {
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/player/login` });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success('Check your email for a reset link');
    setMode('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Player Portal</CardTitle>
          <CardDescription>{mode === 'login' ? 'Log in to update your recruiting site' : 'Reset your password'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          {mode === 'login' && <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>}
          <Button className="w-full" onClick={mode === 'login' ? handleLogin : handleReset} disabled={busy}>
            {busy ? 'Working…' : mode === 'login' ? 'Log in' : 'Send reset link'}
          </Button>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'reset' : 'login')} className="text-sm text-primary hover:underline w-full text-center">
            {mode === 'login' ? 'Forgot password?' : 'Back to login'}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerLogin;
