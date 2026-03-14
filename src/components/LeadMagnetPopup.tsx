import { useState, useEffect } from 'react';
import { X, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateEligibilityChecklistPdf } from '@/lib/eligibilityChecklistPdf';

const POPUP_DISMISSED_KEY = 'cfa_lead_popup_dismissed';
const POPUP_DELAY_MS = 8000; // 8 seconds

export function LeadMagnetPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setIsOpen(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem(POPUP_DISMISSED_KEY, Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('email_subscribers' as any).insert({
        email: email.trim().toLowerCase(),
        full_name: name.trim() || null,
        source: 'popup',
        lead_magnet_downloaded: true,
      });

      if (error && error.code === '23505') {
        // Already subscribed — still let them download
      } else if (error) {
        throw error;
      }

      setIsSuccess(true);
      localStorage.setItem(POPUP_DISMISSED_KEY, Date.now().toString());

      // Generate and download PDF
      generateEligibilityChecklistPdf();
    } catch (err) {
      console.error('Subscribe error:', err);
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-border">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-cfa-gold/10 flex items-center justify-center mx-auto mb-4">
                <Download className="w-7 h-7 text-cfa-gold" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                Free College Golf Eligibility Checklist
              </h3>
              <p className="text-muted-foreground text-sm">
                Make sure your student-athlete is on track for NCAA, NAIA & JUCO eligibility. Enter your email to download instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="First name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-cfa-gold hover:bg-cfa-gold/90 text-white font-semibold" disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing…' : 'Get Free Checklist'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                You'll also receive monthly recruiting tips. Unsubscribe anytime.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              You're In!
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Your checklist is downloading now. Check your inbox for monthly recruiting tips!
            </p>
            <Button onClick={handleDismiss} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
