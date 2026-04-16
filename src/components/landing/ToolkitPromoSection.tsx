import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Mail, FileText, Video, Target, Calendar } from 'lucide-react';

export const ToolkitPromoSection = () => {
  const items = [
    { icon: Mail, label: "4 Email Templates" },
    { icon: FileText, label: "Golf Resume Template" },
    { icon: Video, label: "Highlight Reel Formula" },
    { icon: Target, label: "Target School Guide" },
    { icon: Calendar, label: "4-Year Timeline" },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Digital Download — Ebook
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Want to Play College Golf?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop guessing what coaches want to see. This is the exact playbook we use with private clients — now in a $25 download.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-card rounded-full border border-border/60 px-4 py-2.5 hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex items-baseline gap-2 mb-5">
              <span className="text-4xl md:text-5xl font-bold text-foreground">$25</span>
              <span className="text-muted-foreground text-lg">one-time</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Instant download. Less than a sleeve of Pro V1s.
            </p>
            <Link to="/ebook">
              <Button size="lg" className="h-14 px-10 text-lg font-semibold rounded-full cfa-gradient hover:opacity-90">
                Get the Ebook
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
