import { Link } from 'react-router-dom';
import { useDigitalProductsList, getProductIcon } from '@/hooks/useDigitalProductsList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package } from 'lucide-react';

export const ToolkitPromoSection = () => {
  const { data: products = [], isLoading } = useDigitalProductsList();

  if (isLoading || products.length === 0) return null;

  const bundlePrice = products[0]?.price_cents ?? 9900;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle diagonal background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
              <Package className="w-3.5 h-3.5 mr-1.5" />
              Digital Product
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              The CFA Recruiting Toolkit
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to navigate college golf recruiting — guides, templates, and a full video course. One purchase, lifetime access.
            </p>
          </div>

          {/* Product cards in a horizontal scroll on mobile, grid on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
            {products.map((product) => {
              const Icon = getProductIcon(product.icon_name);
              return (
                <div
                  key={product.id}
                  className="group relative bg-card rounded-xl border border-border/60 p-4 md:p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300"
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${product.bg_color} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${product.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base text-foreground leading-tight mb-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 hidden md:block">
                    {product.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex items-baseline gap-2 mb-5">
              <span className="text-4xl md:text-5xl font-bold text-foreground">${(bundlePrice / 100).toFixed(0)}</span>
              <span className="text-muted-foreground text-lg">one-time</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Also included free for Annual Portal Members after 6 months & all Consulting members
            </p>
            <Link to="/toolkit">
              <Button size="lg" className="h-14 px-10 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90">
                View the Toolkit
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
