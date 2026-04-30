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
    sectionTitle: 'Section 1: Opening & Discovery',
    duration: '5 min',
    items: [
      {
        timeRange: '0:00 – 2:00',
        title: 'Warm welcome & rapport',
        bullets: [
          'Greet by first name, thank them for their time.',
          'Quick personal intro (your background in college golf recruiting).',
          'Ask: "What prompted you to book this call today?" (listen for pain point).',
        ],
      },
      {
        timeRange: '2:00 – 5:00',
        title: 'Gather key info',
        bullets: [
          "Student's grade, handicap, tournament experience.",
          'GPA and intended major.',
          "Schools/divisions they're considering.",
          'What they\'ve done so far (resume, coach outreach).',
          'Ask: "What\'s your biggest concern about the recruiting process?" (identify gap).',
        ],
      },
    ],
  },
  {
    sectionTitle: 'Section 2: CFA Solution Overview',
    duration: '5 min',
    items: [
      {
        timeRange: '5:00 – 7:00',
        title: 'Present our three service tiers',
        bullets: [
          'Free (database access)',
          'Membership (self-guided tools)',
          'Consulting (1-on-1 hands-on program)',
        ],
      },
      {
        timeRange: '7:00 – 9:00',
        title: 'Highlight key differentiators',
        bullets: [
          'Not a mass-blast service — personalized.',
          'Direct coach network (10+ years of HBCU connections).',
          'Show a success story (one sentence, relatable).',
          'Mention the consulting program structure (10 modules — timeline, coach outreach, scholarship evaluation).',
        ],
      },
    ],
  },
  {
    sectionTitle: 'Section 3: Close & Next Steps',
    duration: '5 min',
    items: [
      {
        timeRange: '9:00 – 11:00',
        title: 'Address objections',
        bullets: [
          'Ask: "What questions do you have for me?"',
          'Handle pricing: frame as investment vs. cost of tournaments / value of scholarship.',
          'Handle "we need to think about it": offer a recap email + 2-day follow-up.',
        ],
      },
      {
        timeRange: '11:00 – 13:00',
        title: 'Present clear next step',
        bullets: [
          '"Based on what you shared, I would start by [specific action for their situation]."',
          'Offer to book onboarding (consulting) or start membership.',
        ],
      },
      {
        timeRange: '13:00 – 15:00',
        title: 'Confirm action',
        bullets: [
          'If ready: "Great, I\'ll send you the onboarding link right after this call."',
          'If not ready: schedule a follow-up call and send recap email.',
        ],
      },
    ],
  },
];

const DOS = [
  'Listen more than you talk.',
  "Use the family's name.",
  'Repeat back their pain point to build trust.',
];

const DONTS = [
  "Don't push pricing before showing value.",
  "Don't rush the discovery phase.",
  'Don\'t skip asking "What\'s your biggest concern?"',
];

export const DemoCallAgenda = () => {
  const handleDownloadPdf = () => {
    const consolidatedModule = {
      moduleNumber: 0,
      title: 'Sales Demo Call Agenda (15 Minutes)',
      totalDuration: '15 min',
      objective:
        'Run a focused 15-minute discovery and close call with prospective families. Stay disciplined on time blocks: 5 min discovery, 5 min solution, 5 min close.',
      agenda: AGENDA.flatMap((section) =>
        section.items.map((item) => ({
          topic: `${item.timeRange} | ${item.title}`,
          duration: section.sectionTitle,
          details: item.bullets,
        }))
      ),
      deliverables: [
        "Do: Listen more than you talk.",
        "Do: Use the family's name.",
        'Do: Repeat back their pain point to build trust.',
        "Don't: Push pricing before showing value.",
        "Don't: Rush the discovery phase.",
        'Don\'t: Skip asking "What\'s your biggest concern?"',
      ],
    };

    const pdf = generateModuleAgendaPdf(
      [consolidatedModule],
      'Sales Demo Call Agenda — 15 Minutes'
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
                  Internal guide for running a focused 15-minute discovery and close call with prospective families.
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
                — 5 min discovery · 5 min solution · 5 min close
              </span>
            </div>

            {/* Visual timer bar */}
            <div className="flex h-2 rounded-full overflow-hidden mb-6">
              <div className="flex-1 bg-primary/70" title="Opening & Discovery" />
              <div className="flex-1 bg-primary/50" title="Solution Overview" />
              <div className="flex-1 bg-primary/30" title="Close & Next Steps" />
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
