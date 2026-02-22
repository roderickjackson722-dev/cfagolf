import { Button } from '@/components/ui/button';
import { Download, Printer, CheckCircle, Star, Users, Trophy, Globe, Mail } from 'lucide-react';
import { generateMarketingFlyer } from '@/lib/pdfTemplates';
import { useFlyerContent } from '@/hooks/useFlyerContent';
import cfaLogo from '@/assets/cfa-watermark.png';

interface ServiceItem { title: string; desc: string; }
interface PillarItem { title: string; desc: string; }

const Flyer = () => {
  const { data: content, isLoading } = useFlyerContent();
  const handlePrint = () => window.print();

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  let services: ServiceItem[] = [];
  let pillars: PillarItem[] = [];
  try { services = JSON.parse(content.services || '[]'); } catch {}
  try { pillars = JSON.parse(content.pillars || '[]'); } catch {}

  return (
    <div className="min-h-screen bg-background">
      {/* Print / Download Controls — hidden on print */}
      <div className="print:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Marketing One-Pager — Copy, print or download</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" /> Print
          </Button>
          <Button size="sm" onClick={generateMarketingFlyer}>
            <Download className="w-4 h-4 mr-1" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Flyer Content */}
      <div className="max-w-[8.5in] mx-auto bg-card shadow-xl print:shadow-none print:max-w-none">
        {/* Header Banner */}
        <div className="bg-primary px-8 py-8 print:py-6">
          <div className="flex items-center gap-5">
            <img src={cfaLogo} alt="CFA Logo" className="w-16 h-12 object-contain brightness-0 invert" />
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">
                {content.headline}
              </h1>
              <p className="text-primary-foreground/80 text-sm md:text-base mt-1">
                {content.subheadline}
              </p>
            </div>
          </div>
          <div className="h-0.5 bg-cfa-gold mt-5" />
          <p className="text-primary-foreground/70 text-xs mt-2 text-right">{content.website}</p>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6 print:py-4 print:space-y-4">
          <p className="text-foreground text-sm leading-relaxed">{content.intro}</p>

          {/* Services */}
          <div>
            <div className="bg-cfa-sage/40 px-4 py-2 rounded-t-lg">
              <h2 className="font-display font-bold text-foreground text-sm uppercase tracking-wide">
                What's Included in Your Annual Membership
              </h2>
            </div>
            <div className="border border-border rounded-b-lg divide-y divide-border">
              {services.map((s, i) => (
                <div key={i} className={`flex items-start gap-3 px-4 py-2.5 ${i % 2 === 0 ? 'bg-secondary/40' : ''}`}>
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="font-semibold text-foreground text-sm">{s.title}</span>
                    <span className="text-muted-foreground text-xs sm:text-sm">— {s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing CTA */}
          <div className="bg-primary rounded-xl px-6 py-5 text-center">
            <p className="text-cfa-gold font-display text-2xl font-bold">{content.price}</p>
            <p className="text-primary-foreground/80 text-sm mt-1">{content.price_subtitle}</p>
          </div>

          {/* Pillars */}
          <div>
            <div className="bg-cfa-sage/40 px-4 py-2 rounded-t-lg">
              <h2 className="font-display font-bold text-foreground text-sm uppercase tracking-wide">
                Why College Fairway Advisors?
              </h2>
            </div>
            <div className="border border-border rounded-b-lg divide-y divide-border">
              {pillars.map((p, i) => (
                <div key={i} className="px-4 py-2.5">
                  <span className="font-semibold text-foreground text-sm">{p.title}: </span>
                  <span className="text-muted-foreground text-sm">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 bg-secondary/50 rounded-lg px-4 py-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground text-lg">{content.stat_1_value}</span>
              </div>
              <span className="text-muted-foreground text-xs">{content.stat_1_label}</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground text-lg">{content.stat_2_value}</span>
              </div>
              <span className="text-muted-foreground text-xs">{content.stat_2_label}</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Star className="w-4 h-4 text-cfa-gold" />
                <span className="font-bold text-foreground text-lg">{content.stat_3_value}</span>
              </div>
              <span className="text-muted-foreground text-xs">{content.stat_3_label}</span>
            </div>
          </div>

          {/* Footer / Contact */}
          <div className="border-t border-border pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {content.website}</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {content.email}</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {content.social}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flyer;
