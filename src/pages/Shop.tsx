import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useDigitalProducts } from '@/hooks/useDigitalProducts';
import { useDigitalProductsList, getProductIcon } from '@/hooks/useDigitalProductsList';
import { ProductPreview } from '@/components/shop/ProductPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  FileText, Mail, UserCircle, Calendar, ShoppingCart, CheckCircle, Lock, ArrowRight, Loader2, BookOpen, Download, Play, Archive, Target, Video
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadToolkitBundle } from '@/lib/toolkitBundle';
import ebookCover from '@/assets/ebook-cover.png';

const Shop = () => {
  const { user } = useAuth();
  const { hasToolkitAccess, loading, purchaseToolkit, verifyPurchase } = useDigitalProducts();
  const { data: products = [], isLoading: productsLoading } = useDigitalProductsList();
  const [searchParams] = useSearchParams();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPurchaseSuccess, setGuestPurchaseSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isBundling, setIsBundling] = useState(false);

  // Handle purchase verification on return
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const purchased = searchParams.get('purchased');
    if (sessionId && purchased === 'true') {
      setVerifying(true);
      verifyPurchase(sessionId)
        .then((result) => {
          if (result?.paid) {
            if (user) {
              toast.success('Purchase successful! You now have full access to the ebook.');
            } else {
              setGuestPurchaseSuccess(true);
            }
          }
        })
        .catch(() => toast.error('Failed to verify purchase. Please contact support.'))
        .finally(() => setVerifying(false));
    }
  }, [searchParams]);

  const handlePurchase = async () => {
    if (!user && !guestEmail) {
      toast.error('Please enter your email address');
      return;
    }
    if (!user && guestEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }
    setIsPurchasing(true);
    try {
      await purchaseToolkit(user ? undefined : guestEmail);
    } catch (err: any) {
      toast.error(err.message || 'Failed to start checkout');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/10">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Cover Image */}
              <div className="flex justify-center">
                <img
                  src={ebookCover}
                  alt="Want to Play College Golf? Ebook Cover"
                  className="w-full max-w-sm rounded-2xl shadow-2xl"
                />
              </div>

              {/* Text + CTA */}
              <div className="text-center md:text-left">
        {/* Guest purchase success banner */}
        {guestPurchaseSuccess && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 p-6 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 mx-auto">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Purchase Successful!</h2>
            <p className="text-muted-foreground">
              Your access links have been sent to your email. Check your inbox (and spam folder) for the download links.
            </p>
            <p className="text-sm text-muted-foreground">
              Want to save your progress? <Link to="/login" className="text-primary font-semibold underline underline-offset-2">Create a free account</Link> to unlock in-app access.
            </p>
          </div>
        )}

        {verifying && (
          <div className="mb-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verifying your purchase…</span>
          </div>
        )}

            <Badge variant="secondary" className="mb-4">Digital Download — Ebook</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Want to Play College Golf?
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Here's Your First Step.
            </p>
            <p className="text-base text-muted-foreground mb-8">
              Stop guessing what coaches want to see. This is the exact playbook College Fairway Advisors uses with private clients — now in a $25 download.
            </p>

            {!loading && (
              hasToolkitAccess ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-success/10 text-success font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    You have full access
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                    disabled={isBundling}
                    onClick={async () => {
                      setIsBundling(true);
                      try {
                        await downloadToolkitBundle();
                        toast.success('Ebook ZIP downloaded!');
                      } catch {
                        toast.error('Failed to generate ZIP');
                      } finally {
                        setIsBundling(false);
                      }
                    }}
                  >
                    {isBundling ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating ZIP…</>
                    ) : (
                      <><Archive className="w-4 h-4 mr-2" /> Download All PDFs as ZIP</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-foreground">$25</span>
                    <span className="text-muted-foreground ml-2">one-time · instant download</span>
                  </div>

                  {!user && (
                    <div className="max-w-sm mx-auto">
                      <Input
                        type="email"
                        placeholder="Enter your email to purchase"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="text-center h-12"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    size="lg"
                    className="h-14 px-10 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90"
                  >
                    {isPurchasing ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...</>
                    ) : (
                      <><ShoppingCart className="w-5 h-5 mr-2" /> Buy the Ebook — $25</>
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    {user
                      ? 'Also included free for all Consulting members'
                      : 'No account required — download links sent to your email'}
                  </p>
                  <p className="text-xs text-muted-foreground italic">Less than a sleeve of Pro V1s.</p>
                </div>
              )
            )}
          </div>
        </section>

        <Separator />

        {/* Built for 9th-12th graders */}
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <Badge variant="outline" className="mb-3">Built for 9th–12th Graders</Badge>
            <p className="text-muted-foreground">
              Whether you're just starting high school or heading into senior year, the timeline and templates adapt to where you are right now.
            </p>
          </div>
        </section>

        {/* What's Inside */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
              Inside You'll Get
            </h2>
            <div className="space-y-4">
              {[
                { icon: Mail, emoji: "📧", text: "4 Copy-and-Paste Email Templates", desc: "Introduction, follow-up, tournament update, and coach reply scripts. Just add your name and hit send." },
                { icon: FileText, emoji: "📄", text: "The Golf Resume Template", desc: "A one-page profile coaches actually open. Pre-formatted for your stats, scores, and video links." },
                { icon: Video, emoji: "🎥", text: "The 60-Second Highlight Reel Formula", desc: "Learn exactly what to include and how to structure a highlight video that coaches will watch." },
                { icon: Target, emoji: "🎯", text: "How to Build a Target School List That Fits", desc: "Find the right programs for your game, academics, and goals." },
                { icon: Calendar, emoji: "📅", text: "A 4-Year Timeline", desc: "Exactly what to do — Freshman through Senior year. Never miss a critical recruiting window." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border/50 hover:shadow-md transition-shadow">
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.text}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            {!loading && !hasToolkitAccess && (
              <div className="text-center mt-12">
                <Button
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  size="lg"
                  className="h-14 px-10 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90"
                >
                  {isPurchasing ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5 mr-2" /> Get Instant Access — $25</>
                  )}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
