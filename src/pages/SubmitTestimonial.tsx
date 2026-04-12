import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import cfaLogo from '@/assets/cfa-logo-transparent.png';

export default function SubmitTestimonial() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !testimonial.trim()) {
      toast.error('Please fill in your name and testimonial.');
      return;
    }

    if (testimonial.trim().length < 10) {
      toast.error('Please write at least a few sentences about your experience.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('submit-testimonial', {
        body: {
          name: name.trim().slice(0, 100),
          role: role.trim().slice(0, 100),
          testimonial: testimonial.trim().slice(0, 2000),
        },
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Thank you for sharing your experience!');
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <img src={cfaLogo} alt="CFA" className="w-20 h-20 object-contain mx-auto mb-4" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Share Your <span className="text-primary">CFA Experience</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We'd love to hear how College Fairway Advisors and Rod have helped your family navigate the college golf recruiting journey. Your story could inspire other families!
          </p>
        </div>

        {submitted ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-10 pb-10 text-center">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Thank You!
              </h2>
              <p className="text-muted-foreground text-lg">
                We truly appreciate you taking the time to share your experience. Your testimonial means the world to us!
              </p>
              <div className="flex gap-1 justify-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-cfa-gold text-cfa-gold" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50">
            <CardContent className="pt-8">
              <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-accent/50">
                <Heart className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-accent-foreground">
                  Your words help other golf families discover the support they need. Thank you for sharing!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., John Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g., Parent of D1 signee"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testimonial">Your Experience with CFA *</Label>
                  <Textarea
                    id="testimonial"
                    placeholder="Tell us about your experience working with Rod and College Fairway Advisors. How did CFA help your family through the college golf recruiting process?"
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    maxLength={2000}
                    rows={6}
                    required
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {testimonial.length}/2000
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Your Testimonial
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
