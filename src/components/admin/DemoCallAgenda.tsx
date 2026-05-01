import { Phone, Clock, Download, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateModuleAgendaPdf } from '@/lib/moduleAgendaPdf';
import { toast } from '@/hooks/use-toast';

interface AgendaItem {
  timeRange: string;
  title: string;
  bullets: string[];
}

interface AgendaSection {
  sectionTitle: string;
  duration: string;
  items: AgendaItem[];
}

const AGENDA: AgendaSection[] = [
  {
    sectionTitle: 'Section 1: Opening & Discovery (Camera only — no slides yet)',
    duration: '4 min',
    items: [
      {
        timeRange: '0:00 – 2:00',
        title: 'Warm welcome & rapport',
        bullets: [
          'Greet by first name; thank them for booking the call.',
          'Quick intro: your background in college golf recruiting.',
          'Confirm who is on the call (player, parents, etc.).',
          'Set expectations: "15 minutes — I\'ll learn about your goals, then walk you through exactly what\'s inside CFA."',
        ],
      },
      {
        timeRange: '2:00 – 4:00',
        title: 'Discovery — gather key info',
        bullets: [
          'Grade / graduation year, handicap index, recent tournament scores.',
          'GPA, test scores, intended major.',
          'Target schools / divisions (D1, D2, D3, NAIA, JUCO, HBCU interest).',
          'Ask: "What\'s your biggest concern about the recruiting process right now?" — listen carefully.',
        ],
      },
    ],
  },
  {
    sectionTitle: 'Section 2: Walk the Presentation Deck (Slides 1–15)',
    duration: '8 min',
    items: [
      {
        timeRange: '4:00 – 4:30',
        title: 'Slide 1 — Welcome / What You\'ll See Inside CFA',
        bullets: [
          '"This is a guided tour of every tool inside CFA — built specifically for college golf recruits."',
          'Anchor value: "Replaces $2,000+ recruiting services with a one-time investment."',
        ],
      },
      {
        timeRange: '4:30 – 5:00',
        title: 'Slide 2 — What We Offer',
        bullets: [
          'Three paths: E-Book, Membership (self-guided), Consulting (1-on-1 with Rod).',
          'Tell them you\'ll show what\'s inside Membership/Consulting and recommend the right fit at the end.',
        ],
      },
      {
        timeRange: '5:00 – 5:20',
        title: 'Slide 3 — Player Dashboard',
        bullets: [
          '"This is the home base — every tool, every module, all in one place."',
          'Mention 12-module HS program / 6-module Transfer program progress tracking.',
        ],
      },
      {
        timeRange: '5:20 – 5:50',
        title: 'Slide 4 — College Database',
        bullets: [
          'Filter by division, state, scholarships, GPA, ranking; D1 through JUCO.',
          'Tie back to their target schools from discovery.',
        ],
      },
      {
        timeRange: '5:50 – 6:10',
        title: 'Slides 5 & 6 — Document Vault + Swing Video Vault',
        bullets: [
          'Vault: transcripts, resumes, release forms — secure, share-when-ready.',
          'Swing Vault: one shareable link of swing/tournament clips for coaches.',
        ],
      },
      {
        timeRange: '6:10 – 6:40',
        title: 'Slides 7 & 8 — Recruiting Timeline + Academic Eligibility',
        bullets: [
          'Personalized timeline by graduation year with NCAA deadline reminders.',
          'NCAA core course tracker, GPA/test monitoring, eligibility checklist.',
        ],
      },
      {
        timeRange: '6:40 – 7:00',
        title: 'Slides 9 & 10 — Goals + Tournament Log',
        bullets: [
          'Short and long-term recruiting goals, coach-reviewed weekly.',
          'WAGR-counting event planning, multi-round scoring, verifiable stats.',
        ],
      },
      {
        timeRange: '7:00 – 7:30',
        title: 'Slides 11 & 12 — Email Templates + Coach Tracker',
        bullets: [
          'Pre-written outreach templates with merge fields and response tracking.',
          'Log every email/call/visit, follow-up reminders, full pipeline to committed.',
        ],
      },
      {
        timeRange: '7:30 – 8:00',
        title: 'Slides 13 & 14 — Program Fit + Scholarship Calculator',
        bullets: [
          'Program Fit Questionnaire generates a target list automatically.',
          'Net-cost comparison across offers (athletic + academic + need-based aid).',
        ],
      },
      {
        timeRange: '8:00 – 8:30',
        title: 'Slides 16–19 — Coach Network (HBCU + College Coaches, Team Examples)',
        bullets: [
          'Highlight CFA\'s HBCU coach network — a true differentiator.',
          'Show real team examples (Alabama A&M, Alabama State Women\'s) to make it concrete.',
        ],
      },
      {
        timeRange: '8:30 – 9:00',
        title: 'Slide 15 — Next Steps / How to Enroll',
        bullets: [
          'Self-Paced Online Course $299 (was $499, one-time) or 1-on-1 Consulting $2,499 (was $3,499, one-time, Klarna available).',
          '"You can start onboarding the same day."',
        ],
      },
    ],
  },
  {
    sectionTitle: 'Section 3: Close & Next Steps (Slide 20 — Q&A / Contact)',
    duration: '3 min',
    items: [
      {
        timeRange: '9:00 – 11:00',
        title: 'Address objections',
        bullets: [
          '"It\'s expensive" → reframe vs one bad recruiting decision or competitor recurring fees.',
          '"We need to think about it" → "What specifically? Let me address it now."',
          '"My swing coach is helping" → "Swing coaches build the game; CFA builds the path."',
        ],
      },
      {
        timeRange: '11:00 – 13:00',
        title: 'Recommend the right tier & present next step',
        bullets: [
          'Based on discovery: "I\'d start you with [Self-Paced Course / Consulting] because…"',
          'Walk them to the checkout or Calendly link live — pick a time together.',
        ],
      },
      {
        timeRange: '13:00 – 15:00',
        title: 'Confirm action & close',
        bullets: [
          'Confirm enrollment or booked time and what they\'ll receive next.',
          'Send recap email + checkout link to contact@cfa.golf same day.',
          'Thank them by name; reinforce excitement about working together.',
        ],
      },
    ],
  },
];

const DOS = [
  'Share your screen with the presentation deck open before the call starts.',
  'Tie each slide back to what they said in discovery.',
  "Use the family's name throughout the call.",
];

const DONTS = [
  "Don't read every bullet on every slide — talk to it.",
  "Don't pitch pricing before you\'ve walked the tools.",
  'Don\'t skip the "biggest concern" question in discovery.',
];

export const DemoCallAgenda = () => {
  const handleDownloadPdf = () => {
    const consolidatedModule = {
      moduleNumber: 0,
      title: 'Sales Demo Call Agenda (15 Minutes) — Aligned to Presentation Deck',
      totalDuration: '15 min',
      objective:
        'Run a focused 15-minute discovery and close call with prospective families, walking them through the 20-slide CFA presentation deck. Time blocks: 4 min discovery, 8 min slide walkthrough, 3 min close.',
      agenda: AGENDA.flatMap((section) =>
        section.items.map((item) => ({
          topic: `${item.timeRange} | ${item.title}`,
          duration: section.sectionTitle,
          details: item.bullets,
        }))
      ),
      deliverables: [
        'Do: Share screen with deck open before the call starts.',
        'Do: Tie each slide back to discovery answers.',
        "Do: Use the family's name throughout.",
        "Don't: Read bullets verbatim — talk to them.",
        "Don't: Pitch pricing before walking the tools.",
        'Don\'t: Skip the "biggest concern" question.',
      ],
    };

    const pdf = generateModuleAgendaPdf(
      [consolidatedModule],
      'Sales Demo Call Agenda — 15 Minutes (Deck-Aligned)'
    );
    const filename = 'CFA-Sales-Demo-Call-Agenda-15min.pdf';
    pdf.save(filename);
    toast({ title: 'PDF Downloaded', description: `${filename} has been saved.` });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <CardTitle>Sales Demo Call Agenda (15 Minutes)</CardTitle>
                </div>
                <CardDescription className="mt-1">
                  Aligned to the 20-slide CFA presentation deck. 4 min discovery · 8 min slide walkthrough · 3 min close.
                </CardDescription>
              </div>
              <Button size="sm" onClick={handleDownloadPdf}>
                <Download className="w-4 h-4 mr-1" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Timer banner */}
            <div className="bg-primary/10 rounded-lg p-3 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Total Call Time: 15 minutes</span>
              <span className="text-muted-foreground text-sm ml-2">
                — 4 min discovery · 8 min slide walkthrough · 3 min close
              </span>
            </div>

            {/* Visual timer bar */}
            <div className="flex h-2 rounded-full overflow-hidden mb-6">
              <div className="basis-[27%] bg-primary/70" title="Opening & Discovery" />
              <div className="basis-[53%] bg-primary/50" title="Slide Walkthrough" />
              <div className="basis-[20%] bg-primary/30" title="Close & Next Steps" />
            </div>

            <div className="space-y-6">
              {AGENDA.map((section, si) => (
                <div key={si} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-muted/40 border-b">
                    <h3 className="font-semibold">{section.sectionTitle}</h3>
                    <Badge variant="outline" className="font-mono text-xs">
                      {section.duration}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-4">
                    {section.items.map((item, ii) => (
                      <div key={ii} className="pl-4 border-l-2 border-primary/30">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {item.timeRange}
                          </Badge>
                          <p className="font-medium text-sm">{item.title}</p>
                        </div>
                        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
                          {item.bullets.map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Do's & Don'ts sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Do's & Don'ts</CardTitle>
            <CardDescription>Quick reminders for every call</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Do
              </h4>
              <ul className="space-y-2">
                {DOS.map((d, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t">
              <h4 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Don't
              </h4>
              <ul className="space-y-2">
                {DONTS.map((d, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-destructive mt-0.5">✗</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Offline Copy</CardTitle>
            <CardDescription>Print or save the full agenda</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDownloadPdf} className="w-full">
              <Download className="w-4 h-4 mr-1" />
              Download Agenda PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
