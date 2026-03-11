import { Button } from '@/components/ui/button';
import { Download, Printer, CheckCircle, Users, Trophy, Globe, Mail, Star } from 'lucide-react';
import { generateMarketingFlyer } from '@/lib/pdfTemplates';
import { useFlyerContent } from '@/hooks/useFlyerContent';
import cfaLogo from '@/assets/cfa-watermark.png';
import rodAdvising from '@/assets/rod-advising.png';

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

  // Strip "Annual" and price references
  const headline = (content.headline || '').replace(/\bannual\b/gi, '').replace(/\s+/g, ' ').trim();
  const subheadline = (content.subheadline || '').replace(/\bannual\b/gi, '').replace(/\$\s*899/g, '').replace(/\s+/g, ' ').trim();
  const priceDisplay = (content.price || '').replace(/\$\s*899/g, '').replace(/\bannual\b/gi, '').replace(/\s+/g, ' ').trim();
  const priceSubtitle = (content.price_subtitle || '').replace(/\bannual\b/gi, '').replace(/\$\s*899/g, '').replace(/\s+/g, ' ').trim();

  return (
    <div className="min-h-screen bg-background">
      {/* Print / Download Controls */}
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

      {/* Single-page flyer */}
      <div className="max-w-[8.5in] mx-auto bg-card shadow-xl print:shadow-none print:max-w-none relative" style={{ maxHeight: '11in', overflow: 'hidden' }}>
        {/* Full-page background image */}
        <img
          src={rodAdvising}
          alt=""
          className="absolute inset-0 w-full object-cover pointer-events-none"
          style={{ opacity: 0.17, height: '65%' }}
        />
        
        {/* Header with background image */}
        <div className="relative overflow-hidden px-6 py-6 print:py-4">
          <div className="absolute inset-0 bg-primary/90" />
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <img src={cfaLogo} alt="CFA Logo" className="w-14 h-10 object-contain brightness-0 invert" />
              <div>
                <h1 className="text-xl md:text-2xl font-display font-bold text-primary-foreground leading-tight">
                  {headline}
                </h1>
                <p className="text-primary-foreground/80 text-xs md:text-sm mt-0.5">
                  {subheadline}
                </p>
              </div>
            </div>
            <div className="h-0.5 bg-cfa-gold mt-3" />
            <p className="text-primary-foreground/60 text-[10px] mt-1 text-right">{content.website}</p>
          </div>
        </div>

        {/* Body — compact */}
        <div className="px-6 py-3 space-y-3 print:py-2 print:space-y-2">
          <p className="text-foreground font-medium text-xs leading-relaxed">{content.intro}</p>

          {/* Services — compact table */}
          <div>
            <div className="bg-cfa-sage/40 px-3 py-1.5 rounded-t-md">
              <h2 className="font-display font-bold text-foreground text-[11px] uppercase tracking-wide">
                What's Included in Your Membership
              </h2>
            </div>
            <div className="border border-border rounded-b-md divide-y divide-border">
              {services.map((s, i) => (
                <div key={i} className={`flex items-start gap-2 px-3 py-1.5 ${i % 2 === 0 ? 'bg-secondary/40' : ''}`}>
                  <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col sm:flex-row sm:gap-1.5">
                    <span className="font-bold text-foreground text-[11px]">{s.title}</span>
                    <span className="text-foreground/80 font-medium text-[10px] sm:text-[11px]">— {s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-column: Pillars + Stats */}
          <div className="grid grid-cols-2 gap-3">
            {/* Pillars */}
            <div>
              <div className="bg-cfa-sage/40 px-3 py-1.5 rounded-t-md">
                <h2 className="font-display font-bold text-foreground text-[11px] uppercase tracking-wide">
                  Why College Fairway Advisors?
                </h2>
              </div>
              <div className="border border-border rounded-b-md divide-y divide-border">
                {pillars.map((p, i) => (
                  <div key={i} className="px-3 py-1.5">
                    <span className="font-semibold text-foreground text-[11px]">{p.title}: </span>
                    <span className="text-muted-foreground text-[10px]">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats + CTA */}
            <div className="flex flex-col gap-3">
              {/* Price CTA — only show if there's content after filtering */}
              {(priceDisplay || priceSubtitle) && (
                <div className="bg-primary rounded-lg px-4 py-3 text-center">
                  {priceDisplay && <p className="text-cfa-gold font-display text-lg font-bold">{priceDisplay}</p>}
                  {priceSubtitle && <p className="text-primary-foreground/80 text-[10px] mt-0.5">{priceSubtitle}</p>}
                </div>
              )}
              <div className="bg-secondary/50 rounded-lg px-3 py-3 space-y-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-foreground text-sm">{content.stat_1_value}</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">{content.stat_1_label}</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-foreground text-sm">{content.stat_2_value}</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">{content.stat_2_label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Contact */}
          <div className="border-t border-border pt-2 flex flex-wrap items-center justify-center gap-5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {content.website}</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {content.email}</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {content.social}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flyer;
