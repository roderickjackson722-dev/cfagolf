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
  FileText, Mail, UserCircle, Calendar, ShoppingCart, CheckCircle, Lock, ArrowRight, Loader2, BookOpen, Download, Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop = () => {
  const { user } = useAuth();
  const { hasToolkitAccess, loading, purchaseToolkit, verifyPurchase } = useDigitalProducts();
  const { data: products = [], isLoading: productsLoading } = useDigitalProductsList();
  const [searchParams] = useSearchParams();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPurchaseSuccess, setGuestPurchaseSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const bundlePrice = products.length > 0 ? products[0].price_cents : 9900;

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
              toast.success('Purchase successful! You now have full access to the Recruiting Toolkit.');
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
          <div className="container mx-auto px-4 text-center max-w-3xl">
        {/* Guest purchase success banner */}
        {guestPurchaseSuccess && (
          <div className="mb-8 mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 p-6 text-center space-y-3">
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

            <Badge variant="secondary" className="mb-4">Digital Products</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              The CFA Recruiting Toolkit
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Everything you need to navigate the college golf recruiting process — templates, guides, and a full written course. One purchase, lifetime access.
            </p>

            {!loading && (
              hasToolkitAccess ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-success/10 text-success font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  You have full access
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-foreground">${(bundlePrice / 100).toFixed(0)}</span>
                    <span className="text-muted-foreground ml-2">one-time</span>
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
                      <><ShoppingCart className="w-5 h-5 mr-2" /> Buy the Toolkit</>
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    {user
                      ? 'Also included free for Digital Members after 6 months & all Consulting members'
                      : 'No account required — download links sent to your email'}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        <Separator />

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
              What's Inside the Toolkit
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {products.map((product) => {
                const Icon = getProductIcon(product.icon_name);
                return (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${product.bg_color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${product.color}`} />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 text-xs">{product.subtitle}</Badge>
                          <CardTitle className="text-lg">{product.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm mb-4">{product.description}</CardDescription>
                      {hasToolkitAccess ? (
                        <Link to={product.route}>
                          <Button variant="outline" className="w-full">
                            {product.product_key === 'course' ? (
                              <><Play className="w-4 h-4 mr-2" /> Watch Now</>
                            ) : (
                              <><Download className="w-4 h-4 mr-2" /> Access Now</>
                            )}
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Button variant="outline" disabled className="w-full">
                            <Lock className="w-4 h-4 mr-2" /> Purchase to Unlock
                          </Button>
                          <ProductPreview productKey={product.product_key} />
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
              What You'll Learn
            </h2>
            <div className="space-y-4">
              {[
                { icon: BookOpen, text: "How to build a compelling highlight reel that gets coaches' attention" },
                { icon: Mail, text: "Proven email templates for every stage of coach outreach" },
                { icon: UserCircle, text: "How to create an athlete resume that stands out" },
                { icon: FileText, text: "Step-by-step target school list building methodology" },
                { icon: Calendar, text: "Complete freshman-to-senior recruiting timeline walkthrough" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/50">
                  <item.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
