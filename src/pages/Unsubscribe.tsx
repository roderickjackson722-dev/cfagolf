import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailX, CheckCircle } from 'lucide-react';

const Unsubscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setStatus('loading');
    const { error } = await supabase.functions.invoke('unsubscribe', {
      body: { email: trimmed },
    });

    setStatus(error ? 'error' : 'success');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            {status === 'success' ? (
              <>
                <CheckCircle className="w-12 h-12 mx-auto text-primary mb-3" />
                <CardTitle>You've been unsubscribed</CardTitle>
                <CardDescription>
                  You will no longer receive monthly recruiting tip emails from CFA Golf. Changed your mind? Email{' '}
                  <a href="mailto:contact@cfa.golf" className="text-primary underline">contact@cfa.golf</a> to re-subscribe.
                </CardDescription>
              </>
            ) : (
              <>
                <MailX className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <CardTitle>Unsubscribe</CardTitle>
                <CardDescription>
                  Enter your email below to stop receiving monthly recruiting tip emails from CFA Golf.
                </CardDescription>
              </>
            )}
          </CardHeader>
          {status !== 'success' && (
            <CardContent>
              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
                </Button>
                {status === 'error' && (
                  <p className="text-sm text-destructive text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            </CardContent>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
