import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateEligibilityChecklistPdf } from '@/lib/eligibilityChecklistPdf';

export function FooterEmailOptIn() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('email_subscribers' as any).insert({
        email: email.trim().toLowerCase(),
        source: 'footer',
        lead_magnet_downloaded: true,
      });

      if (error && error.code === '23505') {
        toast({ title: 'Already subscribed!', description: 'You\'re already on our list.' });
      } else if (error) {
        throw error;
      }

      setIsSuccess(true);
      generateEligibilityChecklistPdf();
      setEmail('');
    } catch (err) {
      console.error('Subscribe error:', err);
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm">Subscribed! Your checklist is downloading.</span>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-semibold mb-2 text-white">Get Free Eligibility Checklist</h4>
      <p className="text-white/60 text-sm mb-3">
        Subscribe for recruiting tips & a free PDF download.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-9 text-sm"
        />
        <Button type="submit" size="sm" className="bg-cfa-gold hover:bg-cfa-gold/90 text-white shrink-0" disabled={isSubmitting}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
