import { useState } from 'react';
import { Phone, Clock, MessageCircle, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { generateModuleAgendaPdf } from '@/lib/moduleAgendaPdf';
import { toast } from '@/hooks/use-toast';

interface DetailItem {
  text: string;
  note?: string;
}

interface AgendaBlock {
  topic: string;
  duration: string;
  details: DetailItem[];
}

const DEMO_AGENDA: AgendaBlock[] = [
  {
    topic: "Opening & Rapport Building",
    duration: "3 min",
    details: [
      { text: "Greet warmly, thank them for booking the call", note: "Use their first name. 'Thanks for taking time out of your day — I know recruiting can feel overwhelming, so I appreciate you reaching out.' Set a relaxed, friendly tone." },
      { text: "Quick personal intro — who you are and your background", note: "Keep this to 30 seconds max. Mention your experience in college golf recruiting, how many families you've helped, and why you started CFA. Don't make it a resume — make it relatable." },
      { text: "Ask: 'What prompted you to book this call today?'", note: "This is the most important question of the call. Their answer tells you their pain point, urgency level, and what to emphasize later. Listen carefully and take notes. Repeat back what you hear to show understanding." },
    ],
  },
  {
    topic: "Discovery — Learn About the Family",
    duration: "7 min",
    details: [
      { text: "Ask about the student-athlete: grade, handicap, tournament experience", note: "Get the basics: 'What grade is your son/daughter in? What's their current handicap? Are they playing AJGA, state events, or mostly high school?' This helps you gauge their competitive level." },
      { text: "Ask about academic standing: GPA, test scores, intended major", note: "Many families don't realize academics are 70% of the recruiting equation at many schools. This plants the seed. 'Do you know their current GPA? Have they taken the SAT or ACT yet?'" },
      { text: "Ask what schools or divisions they're considering", note: "Listen for unrealistic expectations vs. well-researched targets. Don't correct them yet — just note it. 'Are you leaning toward any particular schools or divisions? D1, D2, D3?'" },
      { text: "Ask what they've done so far in the recruiting process", note: "This reveals their knowledge level. 'Have you reached out to any coaches yet? Do you have an athletic resume or highlight video?' Most will say no — that's your opportunity to show value." },
      { text: "Understand the family dynamic: who's involved in the decision?", note: "Ask if the other parent is involved, if the student is driving this or if it's parent-led. This tells you who you'll be working with and how to frame your close." },
    ],
  },
  {
    topic: "Pain Points & Urgency",
    duration: "5 min",
    details: [
      { text: "Reflect back what you've heard: 'So it sounds like...'", note: "Summarize their situation in 2-3 sentences. This builds trust and shows you were listening. 'So it sounds like Sarah is a junior with a 5-handicap, you're interested in D2/D3, and you're not sure where to start with coaches — is that right?'" },
      { text: "Identify the gap between where they are and where they need to be", note: "Gently highlight what's missing: 'Most families at this stage haven't started coach outreach, and the window is shorter than people think. The good news is there's still time, but it requires a plan.' Don't fear-monger — be honest and helpful." },
      { text: "Ask: 'What's your biggest concern about the recruiting process?'", note: "Common answers: cost, not knowing where to start, fear of missing deadlines, worried they're not good enough. Whatever they say, acknowledge it and preview that CFA addresses it." },
    ],
  },
  {
    topic: "CFA Overview & Value Proposition",
    duration: "8 min",
    details: [
      { text: "Explain CFA's three service tiers: Free, Membership, Consulting", note: "Keep it simple: 'We have three ways to work together. Free gives you access to our college database. Membership unlocks all our tools and resources for a one-time fee. Consulting is our hands-on, 1-on-1 program where I personally guide your family through every step.'" },
      { text: "Walk through the Consulting program structure (10 modules)", note: "Don't list all 10 modules — hit the highlights: 'We cover everything from building your target school list, to academic eligibility, to coach outreach strategy, to evaluating scholarship offers. It's a complete A-to-Z system.' Mention it's customized to their timeline." },
      { text: "Highlight key tools: College Database, Coach Tracker, Scholarship Calculator", note: "If possible, do a quick screen-share (30 seconds). Show the college database filtering by division/state. Say: 'This is what our members use to research schools — and in consulting, I help you narrow this down to your best-fit list.'" },
      { text: "Share a success story or testimonial relevant to their situation", note: "Pick a story that mirrors their situation. If they're a junior, share a junior success story. If they're worried about D3, share a D3 placement. Make it specific: 'I worked with a family last year in a similar situation — their son ended up at [School] with [outcome].'" },
      { text: "Differentiate from other services: personalized, not a factory", note: "Key message: 'We're not a recruiting service that blasts your info to 500 schools. I personally know the landscape, I build relationships with coaches, and I tailor everything to your student's specific profile and goals. You get my cell phone number.'" },
    ],
  },
  {
    topic: "Address Questions & Objections",
    duration: "4 min",
    details: [
      { text: "Ask: 'What questions do you have for me?'", note: "Pause and let them talk. Don't rush to fill silence. Common questions: pricing, time commitment, guarantees, what if my kid isn't good enough. Have clear, honest answers ready." },
      { text: "Handle pricing objection: frame as investment, not cost", note: "'The consulting program is $X. When you consider that the average golf scholarship is worth $Y over 4 years, and families typically spend $Z on junior golf annually, this is a fraction of what's at stake. Plus, the membership tools alone save families dozens of hours of research.'" },
      { text: "Handle 'we need to think about it' — offer a follow-up timeline", note: "Don't push. Say: 'Absolutely, this is an important decision. Would it be helpful if I sent you a summary of what we discussed and checked back in [2-3 days]? I want to make sure you have everything you need to make the right decision for your family.'" },
      { text: "Handle 'is my kid good enough?' concern", note: "Reassure with data: 'There are over 1,700 college golf programs across all divisions. We find the right fit for every level. I've placed students with 10-handicaps at great programs. It's about finding the right match, not being the best player in the country.'" },
    ],
  },
  {
    topic: "Close & Next Steps",
    duration: "3 min",
    details: [
      { text: "Summarize the value: 'Based on what you've shared, here's how I'd help...'", note: "Tie it back to their specific situation: 'Based on what you told me about Sarah, I'd start by building her target school list focused on D2/D3 programs in the Southeast, get her academic eligibility verified, and begin coach outreach within the first month.'" },
      { text: "Present clear next step: book onboarding or start membership", note: "Be direct but not pushy: 'The next step would be to get started with [tier]. I'd set up your dashboard, and we'd schedule your first working session within the week. Would you like to move forward?' If they hesitate, offer to send info and follow up." },
      { text: "If not ready to commit: schedule a follow-up and send recap email", note: "Say: 'No pressure at all. Let me send you a recap of everything we discussed, plus a link to some testimonials from families we've worked with. Can I check back with you on [specific day]?' Always set a specific follow-up date." },
      { text: "Thank them and express genuine excitement about helping their family", note: "End warmly: 'I really enjoyed talking with you. [Student name] has a great opportunity ahead, and I'd love to be part of the journey. Talk soon!' Leave them feeling positive regardless of the outcome." },
    ],
  },
];

export const DemoCallAgenda = () => {
  const [showNotes, setShowNotes] = useState(true);
  const [expandAll, setExpandAll] = useState(true);
  const [openSections, setOpenSections] = useState<string[]>(
    DEMO_AGENDA.map((_, i) => `block-${i}`)
  );

  const toggleExpandAll = () => {
    if (expandAll) {
      setOpenSections([]);
    } else {
      setOpenSections(DEMO_AGENDA.map((_, i) => `block-${i}`));
    }
    setExpandAll(!expandAll);
  };

  const handleDownloadPdf = () => {
    const pdfData = DEMO_AGENDA.map((block, idx) => ({
      moduleNumber: idx,
      title: block.topic,
      totalDuration: block.duration,
      objective: idx === 0
        ? 'Convert prospective families into CFA clients by demonstrating expertise, building trust, and presenting clear value in a 30-minute overview call.'
        : '',
      agenda: [{
        topic: block.topic,
        duration: block.duration,
        details: block.details.map(d => d.text),
        notes: showNotes ? block.details.map(d => d.note) : undefined,
      }],
      deliverables: [],
    }));

    // Build a single-module PDF instead
    const consolidatedModule = {
      moduleNumber: 0,
      title: 'Free 30-Minute Overview Call',
      totalDuration: '30 min',
      objective: 'Convert prospective families into CFA clients by demonstrating expertise, building trust, and presenting clear value. Follow this timeline to stay on track and cover all key points.',
      agenda: DEMO_AGENDA.map(block => ({
        topic: block.topic,
        duration: block.duration,
        details: block.details.map(d => d.text),
        notes: showNotes ? block.details.map(d => d.note) : undefined,
      })),
      deliverables: [
        'Send recap email within 24 hours',
        'Schedule follow-up if not committed',
        'Add prospect to CRM tracker',
        'Note key pain points for future reference',
      ],
    };

    const pdf = generateModuleAgendaPdf(
      [consolidatedModule],
      showNotes ? 'Demo Call Agenda — With Talking Points' : 'Demo Call Agenda'
    );

    const filename = showNotes
      ? 'CFA-Demo-Call-Agenda-With-Notes.pdf'
      : 'CFA-Demo-Call-Agenda.pdf';
    pdf.save(filename);
    toast({ title: 'PDF Downloaded', description: `${filename} has been saved.` });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              <CardTitle>Demo Call Agenda</CardTitle>
            </div>
            <CardDescription className="mt-1">
              30-minute overview call guide for prospective clients. Follow this timeline to stay on track and convert leads.
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch checked={showNotes} onCheckedChange={setShowNotes} />
              <span className="text-sm font-medium flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                Talking Points
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={toggleExpandAll}>
              {expandAll ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              {expandAll ? 'Collapse All' : 'Expand All'}
            </Button>
            <Button size="sm" onClick={handleDownloadPdf}>
              <Download className="w-4 h-4 mr-1" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total time banner */}
        <div className="bg-primary/10 rounded-lg p-3 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-semibold text-primary">Total Call Time: 30 minutes</span>
          <span className="text-muted-foreground text-sm ml-2">
            — Stay disciplined on time blocks to cover everything
          </span>
        </div>

        <div className="space-y-3">
          {DEMO_AGENDA.map((block, idx) => {
            const isOpen = openSections.includes(`block-${idx}`);
            return (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                  onClick={() => {
                    setOpenSections(prev =>
                      prev.includes(`block-${idx}`)
                        ? prev.filter(s => s !== `block-${idx}`)
                        : [...prev, `block-${idx}`]
                    );
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs min-w-[60px] justify-center">
                      {block.duration}
                    </Badge>
                    <span className="font-semibold">{block.topic}</span>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    {block.details.map((detail, di) => (
                      <div key={di} className="pl-4 border-l-2 border-primary/20">
                        <p className="text-sm font-medium">{detail.text}</p>
                        {showNotes && detail.note && (
                          <div className="mt-1.5 bg-muted/50 rounded-md p-2.5 flex gap-2">
                            <MessageCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-muted-foreground italic leading-relaxed">
                              {detail.note}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Post-call checklist */}
        <div className="mt-6 bg-muted/30 rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Post-Call Checklist
          </h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>✓ Send recap email within 24 hours with key discussion points</li>
            <li>✓ Add prospect to your CRM with notes on their situation & pain points</li>
            <li>✓ Schedule follow-up call/email if they didn't commit on the spot</li>
            <li>✓ If they signed up, trigger the onboarding flow and welcome email</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
