import { BookOpen, Clock, CheckCircle2, ListChecks, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateModuleAgendaPdf } from '@/lib/moduleAgendaPdf';
import { toast } from '@/hooks/use-toast';

interface AgendaItem {
  topic: string;
  duration: string;
  details?: string[];
}

interface ModuleAgenda {
  moduleNumber: number;
  title: string;
  totalDuration: string;
  objective: string;
  agenda: AgendaItem[];
  deliverables: string[];
  pageNumber?: string;
}

const MODULE_AGENDAS: ModuleAgenda[] = [
  {
    moduleNumber: 0,
    title: "Introduction: Onboarding Call",
    totalDuration: "60 min",
    objective: "Welcome the family, set expectations, and establish recruiting goals.",
    agenda: [
      { topic: "Welcome & Introductions", duration: "10 min", details: ["Introduce yourself and CFA", "Learn about the student-athlete and family goals", "Parents & guardians encouraged to join"] },
      { topic: "Program Overview & What to Expect", duration: "15 min", details: ["Walk through the 10-module curriculum", "Explain the dashboard tools and resources", "Set communication expectations and cadence"] },
      { topic: "Setting Recruiting Goals & Timeline", duration: "20 min", details: ["Discuss graduation year and recruiting windows", "Identify target division level and school preferences", "Establish short-term and long-term goals"] },
      { topic: "Getting the Most Out of Coaching Sessions", duration: "10 min", details: ["How to prepare for each session", "Using the dashboard between meetings", "Parent/guardian involvement expectations"] },
      { topic: "Q&A & Next Steps", duration: "5 min", details: ["Answer initial questions", "Assign pre-work for Module 1", "Schedule next session"] },
    ],
    deliverables: ["Completed goal-setting worksheet", "Recruiting timeline draft", "Next session scheduled"],
  },
  {
    moduleNumber: 1,
    title: "College Golf Landscape & Recruiting Basics",
    totalDuration: "60 min",
    objective: "Understand the college golf landscape, divisions, and how recruiting works.",
    pageNumber: "pg. 2",
    agenda: [
      { topic: "NCAA / NAIA / NJCAA Overview", duration: "15 min", details: ["Division differences (D1, D2, D3, NAIA, JUCO)", "Scholarship availability by division", "Roster sizes and walk-on opportunities"] },
      { topic: "Finding the Right Program Fit", duration: "15 min", details: ["Academic vs. athletic fit", "School size, location, and culture considerations", "Using the College Database tool"] },
      { topic: "Recruiting Timeline & Key Dates", duration: "15 min", details: ["NCAA recruiting calendar overview", "Contact periods and dead periods", "Grade-level benchmarks and action items"] },
      { topic: "Program Fit Questionnaire", duration: "10 min", details: ["Walk through the interactive questionnaire", "Discuss initial preferences and priorities"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Review key takeaways", "Assign Target School Builder homework", "Preview Module 2 topics"] },
    ],
    deliverables: ["Program Fit Questionnaire completed", "Initial target school list started", "Division comparison understanding"],
  },
  {
    moduleNumber: 2,
    title: "Academic Readiness & Compliance",
    totalDuration: "60 min",
    objective: "Ensure the student-athlete meets eligibility requirements and has a strong academic plan.",
    pageNumber: "pg. 6",
    agenda: [
      { topic: "NCAA Eligibility Center & Requirements", duration: "15 min", details: ["Registration process walkthrough", "Core course requirements by division", "GPA sliding scale explanation"] },
      { topic: "GPA Planning & Course Selection", duration: "15 min", details: ["Core Course Tracker tool walkthrough", "Identifying gaps in current coursework", "Strategies for GPA improvement"] },
      { topic: "Test Prep Strategies (SAT/ACT)", duration: "15 min", details: ["Score requirements by division", "Test prep resources and timeline", "Test Prep Worksheet walkthrough"] },
      { topic: "Eligibility Checklist Review", duration: "10 min", details: ["Walk through the interactive checklist", "Identify any red flags or action items"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Summarize academic action plan", "Assign eligibility registration tasks", "Preview Module 3 topics"] },
    ],
    deliverables: ["Core Course Tracker started", "Test prep plan established", "Eligibility Checklist progress"],
  },
  {
    moduleNumber: 3,
    title: "Performance Metrics & Tournament Strategy",
    totalDuration: "60 min",
    objective: "Establish scoring benchmarks and a strategic tournament schedule.",
    pageNumber: "pg. 11",
    agenda: [
      { topic: "Scoring Benchmarks by Division", duration: "15 min", details: ["What scores coaches are looking for", "Scoring average vs. best rounds", "How to present your stats effectively"] },
      { topic: "Tournament Selection Strategy", duration: "15 min", details: ["Types of tournaments that matter", "Building a competitive schedule", "Regional vs. national exposure events"] },
      { topic: "Stats Tracking & Tournament Log", duration: "15 min", details: ["Using the Tournament Log tool", "What data to track and why", "Analyzing trends and improvement areas"] },
      { topic: "Performance Goal Setting", duration: "10 min", details: ["Setting realistic scoring goals", "Practice vs. tournament performance", "Mental game considerations"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Review scoring benchmarks", "Plan upcoming tournament schedule", "Preview Module 4 topics"] },
    ],
    deliverables: ["Tournament Log entries started", "Scoring benchmarks identified", "Tournament schedule drafted"],
  },
  {
    moduleNumber: 4,
    title: "Training & Player Development Templates",
    totalDuration: "60 min",
    objective: "Create structured practice plans and development routines.",
    pageNumber: "pg. 15",
    agenda: [
      { topic: "Practice Planning Framework", duration: "15 min", details: ["Structured vs. unstructured practice", "Time allocation across skill areas", "Weekly and monthly planning templates"] },
      { topic: "Skill Development Priorities", duration: "15 min", details: ["Short game vs. long game focus", "Identifying weaknesses through stats", "Drills and training aids recommendations"] },
      { topic: "Physical Fitness & Preparation", duration: "15 min", details: ["Golf-specific fitness basics", "Flexibility, strength, and endurance", "College-level fitness expectations"] },
      { topic: "Practice Log & Accountability", duration: "10 min", details: ["Setting up a practice tracking system", "Accountability partnerships", "Measuring improvement over time"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Finalize weekly practice plan", "Set fitness goals", "Preview Module 5 topics"] },
    ],
    deliverables: ["Weekly practice plan template", "Fitness baseline assessment", "Development priority list"],
  },
  {
    moduleNumber: 5,
    title: "Athlete Brand, Resume & Video Portfolio",
    totalDuration: "60 min",
    objective: "Build a compelling recruiting profile and digital presence.",
    pageNumber: "pg. 19",
    agenda: [
      { topic: "Building Your Recruiting Profile", duration: "15 min", details: ["Essential information coaches want", "Athletic resume template and examples", "Academic and athletic highlights"] },
      { topic: "Video Portfolio Guidelines", duration: "15 min", details: ["What to film and how", "Video length and format best practices", "Editing and hosting options"] },
      { topic: "Online Presence & Social Media", duration: "15 min", details: ["Platforms coaches check", "Profile optimization tips", "Content do's and don'ts"] },
      { topic: "Profile Assembly Workshop", duration: "10 min", details: ["Review draft resume together", "Identify missing content to gather", "Create video filming checklist"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Finalize resume draft deadline", "Schedule video filming", "Preview Module 6 topics"] },
    ],
    deliverables: ["Athletic resume draft", "Video filming plan", "Social media audit completed"],
  },
  {
    moduleNumber: 6,
    title: "Coach Outreach & Networking",
    totalDuration: "60 min",
    objective: "Learn effective coach communication and campus visit preparation.",
    pageNumber: "pg. 23",
    agenda: [
      { topic: "Email Templates & Best Practices", duration: "15 min", details: ["Initial outreach email structure", "Follow-up email cadence", "Personalizing templates for each coach"] },
      { topic: "Phone Scripts & Communication", duration: "10 min", details: ["What to say when calling coaches", "Handling voicemail effectively", "Phone call follow-up protocol"] },
      { topic: "Coach Tracker Tool Walkthrough", duration: "15 min", details: ["Setting up your coach contact list", "Tracking outreach status and responses", "Managing follow-up reminders"] },
      { topic: "Campus Visit Preparation", duration: "15 min", details: ["Questions to ask on visits", "What coaches are evaluating", "Using the Campus Visits tool to log impressions"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Send first batch of outreach emails", "Schedule campus visits", "Preview Module 7 topics"] },
    ],
    deliverables: ["Coach contact list populated", "First outreach emails drafted", "Campus visit schedule started"],
  },
  {
    moduleNumber: 7,
    title: "Financial Aid, Offers & Decisions",
    totalDuration: "60 min",
    objective: "Understand financial aid packages and how to evaluate offers.",
    pageNumber: "pg. 27",
    agenda: [
      { topic: "Understanding Scholarship Offers", duration: "15 min", details: ["Types of scholarships (athletic, academic, need-based)", "Full vs. partial scholarship breakdown", "Equivalency vs. head-count sports"] },
      { topic: "Comparing Financial Packages", duration: "15 min", details: ["Using the Scholarship Calculator tool", "True cost of attendance breakdown", "Hidden costs to watch for"] },
      { topic: "Negotiation Strategies", duration: "15 min", details: ["When and how to negotiate", "Leveraging multiple offers", "What's negotiable and what isn't"] },
      { topic: "Decision Framework", duration: "10 min", details: ["Creating a pros/cons comparison", "Involving family in the decision", "Timeline for commitments"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Update scholarship tracker with offers", "Prepare negotiation talking points", "Preview Module 8 topics"] },
    ],
    deliverables: ["Scholarship offers logged in calculator", "Cost comparison spreadsheet", "Decision criteria established"],
  },
  {
    moduleNumber: 8,
    title: "Capstone — Recruiting Portfolio & 90-Day Action Plan",
    totalDuration: "60 min",
    objective: "Assemble the final recruiting portfolio and create an actionable roadmap.",
    pageNumber: "pg. 31",
    agenda: [
      { topic: "Portfolio Assembly Review", duration: "20 min", details: ["Review all completed worksheets and tools", "Ensure resume, video, and profiles are finalized", "Check that all outreach is documented"] },
      { topic: "90-Day Action Plan", duration: "20 min", details: ["Set priorities for the next 90 days", "Define measurable milestones", "Assign accountability checkpoints"] },
      { topic: "Commitment Preparation", duration: "15 min", details: ["NLI and commitment process overview", "What to expect after committing", "Transfer portal awareness"] },
      { topic: "Wrap-Up & Next Steps", duration: "5 min", details: ["Celebrate progress made", "Discuss ongoing support options", "Preview conclusion session"] },
    ],
    deliverables: ["Complete recruiting portfolio", "90-day action plan document", "Commitment readiness checklist"],
  },
  {
    moduleNumber: 9,
    title: "Conclusion: Get Ready For College Golf",
    totalDuration: "60 min",
    objective: "Prepare for the transition to college golf and wrap up the program.",
    agenda: [
      { topic: "Transition Planning", duration: "15 min", details: ["Summer before college checklist", "Communicating with future coach and teammates", "Academic registration and orientation prep"] },
      { topic: "Final Preparations", duration: "15 min", details: ["Equipment and gear needs", "Fitness and practice plan through summer", "Mental preparation for college athletics"] },
      { topic: "Program Review & Reflection", duration: "15 min", details: ["Review all modules and progress made", "Celebrate achievements and milestones", "Identify areas for continued growth"] },
      { topic: "Ongoing Support & Resources", duration: "10 min", details: ["Post-program support options", "Alumni network and community", "How to stay connected with CFA"] },
      { topic: "Final Q&A & Send-Off", duration: "5 min", details: ["Address remaining questions", "Words of encouragement", "Congratulations and next chapter!"] },
    ],
    deliverables: ["Transition checklist completed", "Summer action plan", "Program completion certificate"],
  },
];

const TRANSFER_MODULE_AGENDAS: ModuleAgenda[] = [
  {
    moduleNumber: 1,
    title: "Transfer Assessment & Portal Orientation",
    totalDuration: "60 min",
    objective: "Understand the NCAA Transfer Portal, 2026 rule changes, and assess the student-athlete's transfer readiness.",
    agenda: [
      { topic: "Why Transfer? Self-Assessment", duration: "10 min", details: ["Identify reasons for transferring (playing time, coaching, academics, location)", "Evaluate what didn't work at current school", "Set clear expectations — entering portal doesn't guarantee a scholarship"] },
      { topic: "NCAA Transfer Portal Overview", duration: "15 min", details: ["What the portal is and how it works (launched 2018)", "Sport-by-sport transfer windows — Golf windows: Men's May 13–Jun 11, Women's May 6–Jun 4 (2026)", "Once in portal, coaches can legally initiate contact", "Entering is essentially a one-way street — current school not obligated to keep scholarship/roster spot", "Your coach sees immediately that you've entered"] },
      { topic: "2026 Rule Changes: Immediate Eligibility", duration: "10 min", details: ["As of Feb 2026: immediately eligible regardless of transfer count", "Requirements: academically eligible, no disciplinary suspension/dismissal, progress-toward-degree", "Transfer windows still apply for undergraduates", "Graduate students can transfer multiple times and enter outside windows", "Graduate transfers now subject to Jan 2-16 window (previously could enter anytime)"] },
      { topic: "Special Windows & Exceptions", duration: "10 min", details: ["Coaching change window: 15-day window opens 5 days after new head coach hired/announced", "If no coach announced within 30 days, 15-day window opens", "Coaching change window only available after regular window opens through Jan 2", "Playoff/championship extensions for football and basketball"] },
      { topic: "JUCO & D3 Transfer Rules Overview", duration: "10 min", details: ["JUCO→NCAA: qualifier/non-qualifier status, 2.5 GPA minimum, register with NCAA Eligibility Center", "JUCO→NAIA: no residency requirement, must register with NAIA Eligibility Center, 24 semester/36 quarter hours required", "D3 transfers: Self-Release Form or Notification of Transfer depending on origin division", "From NAIA: permission-to-contact letter required", "From JUCO to D3: contact head coach directly, no formal docs needed"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Complete transfer readiness self-assessment", "Identify your sport's transfer window dates", "Preview Module 2 topics"] },
    ],
    deliverables: ["Transfer readiness assessment completed", "Transfer timeline with window dates drafted", "Division-specific rules identified"],
  },
  {
    moduleNumber: 2,
    title: "Academic & Eligibility Audit",
    totalDuration: "60 min",
    objective: "Map current coursework to target schools and verify eligibility requirements.",
    agenda: [
      { topic: "Credit Transfer Analysis", duration: "20 min", details: ["Using the Credit Audit Worksheet tool", "Course-by-course mapping to target schools", "Identifying credits that may not transfer", "Understanding how credit loss affects graduation timeline", "JUCO transfers: must have completed 24 semester/36 quarter hours"] },
      { topic: "Eligibility Clock & Requirements", duration: "15 min", details: ["Years of eligibility used vs. remaining", "Progress-toward-degree requirements at new school", "For JUCO→D1/D2: determine qualifier/non-qualifier/academic redshirt status", "GPA of 2.5+ required for JUCO→4-year transfers", "Register with NCAA or NAIA Eligibility Center as applicable"] },
      { topic: "GPA & Academic Standing", duration: "15 min", details: ["How GPA transfers (or doesn't)", "Minimum GPA requirements by division", "Academic support resources at target schools", "Can you balance a difficult major with team responsibilities?"] },
      { topic: "Red Flags & Waivers", duration: "5 min", details: ["Disciplinary issues that block immediate eligibility", "Mid-year restrictions (basketball: can't play if enrolled at NCAA school in first term)", "Documentation to gather from current school"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Complete Credit Audit Worksheet", "Request unofficial transcripts", "Preview Module 3 topics"] },
    ],
    deliverables: ["Credit Audit Worksheet completed", "Eligibility years documented", "Transcript request initiated"],
  },
  {
    moduleNumber: 3,
    title: "College Golf Resume 2.0 — Leveraging Collegiate Experience",
    totalDuration: "60 min",
    objective: "Build a compelling transfer resume using collegiate stats, film, and experience.",
    agenda: [
      { topic: "Collegiate Stats Resume", duration: "20 min", details: ["Translating college tournament results into a recruiting resume", "Using the Tournament Log to showcase collegiate performance", "Comparing your stats to target programs' team averages", "What transfer coaches value vs. what HS coaches value"] },
      { topic: "Video & Film Portfolio for Transfers", duration: "15 min", details: ["College-level swing video expectations", "Game film from collegiate events", "Creating a highlight reel with context"] },
      { topic: "Positioning Your Transfer Story", duration: "15 min", details: ["Crafting a positive narrative (why transferring, not why leaving)", "Addressing the 'why' question coaches will ask", "Demonstrating maturity and self-awareness"] },
      { topic: "Online Presence Refresh", duration: "5 min", details: ["Updating profiles to reflect transfer status", "Social media considerations during the portal process"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Finalize transfer resume", "Gather collegiate film clips", "Preview Module 4 topics"] },
    ],
    deliverables: ["Transfer-specific resume completed", "Video highlights compiled", "Transfer narrative drafted"],
  },
  {
    moduleNumber: 4,
    title: "Portal Strategy & Coach Outreach",
    totalDuration: "60 min",
    objective: "Develop a strategic portal entry plan and effective coach communication approach.",
    agenda: [
      { topic: "Portal Entry Strategy & Process", duration: "15 min", details: ["Step 1: Be absolutely certain about transferring — scholarship may not be guaranteed if you return", "Step 2: Talk to current coach first — courtesy and scholarship/roster implications", "Step 3: Provide written notice to compliance office — school has 48 hours to enter your name", "Using the Transfer Portal Tracker tool", "WARNING: Entering is a one-way street — coach sees immediately, scholarship at risk"] },
      { topic: "Coach Outreach for Transfers", duration: "20 min", details: ["CRITICAL: Coaches cannot discuss transfers with athletes NOT in the portal (tampering violation)", "Different approach than HS recruiting — coaches want proven, ready-to-play athletes", "Key questions to ask: Where do you see me fitting? What are offseason expectations?", "Team culture questions: What does your team do outside sports? Have transfers faced challenges?", "Financial aid questions: What does it take to earn a scholarship? What happens if I'm injured?"] },
      { topic: "Campus Visit Strategy", duration: "15 min", details: ["Visit BEFORE making a final decision", "Connect with coaching staff to find a good visit date", "What to evaluate differently as a transfer", "Using Campus Visits tool to compare and log impressions"] },
      { topic: "Managing Current School Relationships", duration: "5 min", details: ["Notifying current coaching staff professionally", "Understanding your school's policies on scholarship retention", "NCAA compliance during the process"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Populate Transfer Portal Tracker with targets", "Draft first outreach emails", "Preview Module 5 topics"] },
    ],
    deliverables: ["Transfer Portal Tracker populated", "Coach outreach emails drafted", "Campus visit priorities identified"],
  },
  {
    moduleNumber: 5,
    title: "Scholarship Negotiation & NIL Considerations",
    totalDuration: "60 min",
    objective: "Maximize scholarship value and understand the NIL landscape for transfers.",
    agenda: [
      { topic: "Transfer Scholarship Dynamics", duration: "15 min", details: ["Transfers often have leverage — use it wisely", "How offers differ for transfers vs. incoming freshmen", "Using the Scholarship Calculator to compare packages", "Understanding what's negotiable"] },
      { topic: "Negotiation Strategies", duration: "15 min", details: ["Leveraging multiple transfer offers", "Academic merit + athletic aid combination", "Timing your decisions strategically", "When to walk away from an offer"] },
      { topic: "NIL Landscape for Transfers", duration: "15 min", details: ["How NIL plays into transfer decisions", "School-specific NIL collectives and policies", "Questions to ask about NIL opportunities", "NIL shouldn't be the sole deciding factor"] },
      { topic: "Financial Package Comparison", duration: "10 min", details: ["Total cost of attendance comparison", "Factor in credits lost and extra semesters", "Log offers in Scholarship Calculator"] },
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: ["Update scholarship offers in calculator", "Prepare negotiation talking points", "Preview Module 6 topics"] },
    ],
    deliverables: ["Scholarship offers logged and compared", "Negotiation strategy documented", "NIL questions prepared"],
  },
  {
    moduleNumber: 6,
    title: "Decision & Transition Planning",
    totalDuration: "60 min",
    objective: "Make the final transfer decision and plan a smooth transition.",
    agenda: [
      { topic: "Decision Framework", duration: "15 min", details: ["Weighing all factors: academics, athletics, finances, culture", "Using Campus Visit comparisons", "Family involvement in the decision", "Setting a decision deadline"] },
      { topic: "Commitment & Portal Exit", duration: "15 min", details: ["How to formally commit and exit the portal", "Transfer paperwork and release requirements", "Timeline from commitment to enrollment"] },
      { topic: "Academic Transition Planning", duration: "15 min", details: ["Course registration at new school", "Meeting with academic advisor", "Ensuring credits are properly transferred", "Graduation timeline at new institution"] },
      { topic: "Athletic & Social Transition", duration: "10 min", details: ["Connecting with new teammates and coaches", "Summer training expectations", "Navigating being 'the transfer' — cultural integration", "Setting goals for your first season"] },
      { topic: "Program Wrap-Up & Celebration", duration: "5 min", details: ["Review all progress and decisions made", "Ongoing CFA support availability", "Congratulations on your new chapter!"] },
    ],
    deliverables: ["Final decision documented", "Transition checklist completed", "Academic plan at new school drafted"],
  },
];

export function ModuleAgenda() {
  const handleDownloadHS = () => {
    try {
      const doc = generateModuleAgendaPdf(MODULE_AGENDAS, 'High School Recruiting Program');
      doc.save('CFA-HS-Module-Agenda.pdf');
      toast({ title: 'Downloaded', description: 'High School agenda PDF saved.' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    }
  };

  const handleDownloadTransfer = () => {
    try {
      const doc = generateModuleAgendaPdf(TRANSFER_MODULE_AGENDAS, 'Transfer Student Program');
      doc.save('CFA-Transfer-Module-Agenda.pdf');
      toast({ title: 'Downloaded', description: 'Transfer agenda PDF saved.' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BookOpen className="w-4 h-4" />
        <span>Consultant reference — session-by-session agendas for both programs</span>
      </div>

      {/* High School Program */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary">12 Modules</Badge>
            High School Recruiting Program
          </h3>
          <Button variant="outline" size="sm" onClick={handleDownloadHS} className="gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
        {MODULE_AGENDAS.map((module) => (
          <AccordionItem key={module.moduleNumber} value={`module-${module.moduleNumber}`} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <Badge variant="outline" className="shrink-0 font-mono">
                  {module.moduleNumber === 0 ? 'Intro' : `M${module.moduleNumber}`}
                </Badge>
                <div>
                  <p className="font-semibold text-sm">{module.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3" /> {module.totalDuration}
                    {module.pageNumber && <span className="text-primary">· {module.pageNumber}</span>}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              {/* Objective */}
              <p className="text-sm font-medium text-primary">{module.objective}</p>

              {/* Agenda Items */}
              <div className="space-y-3">
                {module.agenda.map((item, idx) => (
                  <Card key={idx} className="shadow-none">
                    <CardHeader className="p-3 pb-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{item.topic}</CardTitle>
                        <Badge variant="secondary" className="text-xs shrink-0">{item.duration}</Badge>
                      </div>
                    </CardHeader>
                    {item.details && (
                      <CardContent className="p-3 pt-1">
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {item.details.map((d, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {/* Deliverables */}
              <div className="border-t pt-3">
                <p className="text-xs font-semibold flex items-center gap-1.5 mb-2">
                  <ListChecks className="w-3.5 h-3.5 text-primary" /> Session Deliverables
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {module.deliverables.map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      </div>

      {/* Transfer Program */}
      <div className="mt-8">
        <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary">6 Modules</Badge>
          Transfer Student Program
        </h3>
        <Accordion type="single" collapsible className="space-y-4">
          {TRANSFER_MODULE_AGENDAS.map((module) => (
            <AccordionItem key={module.moduleNumber} value={`transfer-${module.moduleNumber}`} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <Badge variant="outline" className="shrink-0 font-mono">
                    T{module.moduleNumber}
                  </Badge>
                  <div>
                    <p className="font-semibold text-sm">{module.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3" /> {module.totalDuration}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <p className="text-sm font-medium text-primary">{module.objective}</p>
                <div className="space-y-3">
                  {module.agenda.map((item, idx) => (
                    <Card key={idx} className="shadow-none">
                      <CardHeader className="p-3 pb-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">{item.topic}</CardTitle>
                          <Badge variant="secondary" className="text-xs shrink-0">{item.duration}</Badge>
                        </div>
                      </CardHeader>
                      {item.details && (
                        <CardContent className="p-3 pt-1">
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {item.details.map((d, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                {d}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold flex items-center gap-1.5 mb-2">
                    <ListChecks className="w-3.5 h-3.5 text-primary" /> Session Deliverables
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {module.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
