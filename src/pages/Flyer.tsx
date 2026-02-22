import { Button } from '@/components/ui/button';
import { Download, Printer, CheckCircle, Star, Users, Trophy, Phone, Mail, Globe } from 'lucide-react';
import { generateMarketingFlyer } from '@/lib/pdfTemplates';
import cfaLogo from '@/assets/cfa-watermark.png';

const services = [
  { title: 'Monthly Coaching Calls', desc: 'One-on-one guidance through every phase of recruiting (12 calls)' },
  { title: 'LPGA & PGA Pro Webinars', desc: 'Exclusive sessions with touring professionals' },
  { title: 'College Coach Sessions', desc: 'Learn what coaches look for in recruits' },
  { title: 'Target School List Builder', desc: 'Strategic school matching based on your profile' },
  { title: 'Tournament Result Log', desc: 'Track competitive results for your recruiting resume' },
  { title: 'Coach Contact Tracker', desc: 'Organize all coach communications in one place' },
  { title: 'Scholarship Calculator', desc: 'Analyze and compare financial aid offers' },
  { title: '12-Month Recruiting Timeline', desc: 'Grade-specific action plans to stay on track' },
];

const pillars = [
  { title: 'Clarity', desc: 'We simplify the recruiting process so families know exactly what to do and when.' },
  { title: 'Advocacy', desc: 'We connect you directly with college coaches and advocate for your student-athlete.' },
  { title: 'Strategy', desc: 'Every plan is customized to your academic profile, golf skills, and goals.' },
];

const Flyer = () => {
  const handlePrint = () => window.print();

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

      {/* Flyer Content — optimized for print */}
      <div className="max-w-[8.5in] mx-auto bg-card shadow-xl print:shadow-none print:max-w-none">
        {/* Header Banner */}
        <div className="bg-primary px-8 py-8 print:py-6">
          <div className="flex items-center gap-5">
            <img src={cfaLogo} alt="CFA Logo" className="w-16 h-12 object-contain brightness-0 invert" />
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">
                College Fairway Advisors
              </h1>
              <p className="text-primary-foreground/80 text-sm md:text-base mt-1">
                Your Strategic Recruiting Partner for College Golf
              </p>
            </div>
          </div>
          <div className="h-0.5 bg-cfa-gold mt-5" />
          <p className="text-primary-foreground/70 text-xs mt-2 text-right">www.cfa.golf</p>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6 print:py-4 print:space-y-4">
          {/* Intro */}
          <p className="text-foreground text-sm leading-relaxed">
            Expert guidance for junior golfers and their families navigating the college golf recruiting process. 
            We provide personalized consulting, professional tools, and direct access to college coaches and LPGA/PGA professionals.
          </p>

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
            <p className="text-cfa-gold font-display text-2xl font-bold">$2,499 / Year</p>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Annual Consulting Membership — Personalized College Golf Recruiting
            </p>
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
                <span className="font-bold text-foreground text-lg">1,300+</span>
              </div>
              <span className="text-muted-foreground text-xs">College Programs</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground text-lg">D1–NAIA</span>
              </div>
              <span className="text-muted-foreground text-xs">All Divisions</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Star className="w-4 h-4 text-cfa-gold" />
                <span className="font-bold text-foreground text-lg">500+</span>
              </div>
              <span className="text-muted-foreground text-xs">Families Served</span>
            </div>
          </div>

          {/* Footer / Contact */}
          <div className="border-t border-border pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> www.cfa.golf</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> info@cfa.golf</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> @collegefairwayadvisors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flyer;
