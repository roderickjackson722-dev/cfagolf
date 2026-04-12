import { Button } from '@/components/ui/button';
import { Printer, CheckCircle, Users, Trophy, Globe, Mail, Star, ArrowRightLeft, GraduationCap, Clock, ShieldCheck } from 'lucide-react';
import cfaLogo from '@/assets/cfa-watermark.png';
import rodAdvising from '@/assets/rod-advising.png';

const services = [
  { title: 'Transfer Portal Strategy', desc: 'Navigate the portal with a personalized action plan and timeline' },
  { title: '1-on-1 Coaching Calls', desc: 'Six dedicated sessions covering every step of your transfer journey' },
  { title: 'Credit Audit & Mapping', desc: 'Ensure your coursework transfers and you stay on track to graduate' },
  { title: 'Coach Outreach Support', desc: 'Templates, talking points, and direct guidance for contacting coaches' },
  { title: 'Scholarship Negotiation', desc: 'Maximize your athletic and academic aid at your new program' },
  { title: 'Eligibility & Compliance', desc: 'Stay compliant with NCAA/NAIA transfer rules and deadlines' },
];

const pillars = [
  { title: 'Experience', desc: 'Deep expertise in collegiate golf recruiting and transfers' },
  { title: 'Personalized', desc: 'Every plan is tailored to your academic and athletic profile' },
  { title: 'Results-Driven', desc: 'Proven track record placing golfers at the right programs' },
  { title: 'Full Support', desc: 'From portal entry to first tee at your new school' },
];

const TransferFlyer = () => {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background">
      {/* Print / Download Controls */}
      <div className="print:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Transfer Program One-Pager — Copy or print</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" /> Print
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

        {/* Header */}
        <div className="relative overflow-hidden px-6 py-6 print:py-4">
          <div className="absolute inset-0 bg-primary/90" />
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <img src={cfaLogo} alt="CFA Logo" className="h-16 w-auto object-contain brightness-0 invert" />
              <div>
                <h1 className="text-xl md:text-2xl font-display font-bold text-primary-foreground leading-tight">
                  Transfer Student Program
                </h1>
                <p className="text-primary-foreground/80 text-xs md:text-sm mt-0.5">
                  Expert guidance for college golfers ready to make a move
                </p>
              </div>
            </div>
            <div className="h-0.5 bg-cfa-gold mt-3" />
            <p className="text-primary-foreground/60 text-[10px] mt-1 text-right">www.cfa.golf</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-3 space-y-3 print:py-2 print:space-y-2">
          <p className="text-foreground font-medium text-xs leading-relaxed">
            Transferring to a new golf program is one of the most impactful decisions in a student-athlete's career. 
            College Fairway Advisors' 6-Module Transfer Program gives you a dedicated coach to navigate the portal, 
            protect your eligibility, and land at the right school — academically and athletically.
          </p>

          {/* Services */}
          <div>
            <div className="bg-cfa-sage/40 px-3 py-1.5 rounded-t-md">
              <h2 className="font-display font-bold text-foreground text-[11px] uppercase tracking-wide">
                What's Included — 6 Modules
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
                    <span className="font-bold text-foreground text-[11px]">{p.title}: </span>
                    <span className="text-foreground/80 font-medium text-[10px]">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats + CTA */}
            <div className="flex flex-col gap-3">
              {/* Price CTA */}
              <div className="bg-primary rounded-lg px-4 py-3 text-center">
                <p className="text-cfa-gold font-display text-lg font-bold">$499</p>
                <p className="text-primary-foreground/80 text-[10px] mt-0.5">6-Module Transfer Program</p>
              </div>

              {/* Key highlights */}
              <div className="bg-secondary/50 rounded-lg px-3 py-3 space-y-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-foreground text-sm">6 Coaching Sessions</span>
                  </div>
                  <span className="text-foreground/70 font-medium text-[10px]">Dedicated 1-on-1 calls</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-foreground text-sm">Portal-Ready</span>
                  </div>
                  <span className="text-foreground/70 font-medium text-[10px]">NCAA & NAIA transfer windows covered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Contact */}
          <div className="border-t border-border pt-2 flex flex-wrap items-center justify-center gap-5 text-[10px] text-foreground/70 font-medium">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> cfa.golf</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> contact@cfa.golf</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> @collegefairwayadvisors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferFlyer;
