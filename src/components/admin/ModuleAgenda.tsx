import { useState } from 'react';
import { BookOpen, Clock, CheckCircle2, ListChecks, Download, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { generateModuleAgendaPdf } from '@/lib/moduleAgendaPdf';
import { toast } from '@/hooks/use-toast';

interface DetailItem {
  text: string;
  note?: string; // moderator talking point
}

interface AgendaItem {
  topic: string;
  duration: string;
  details?: DetailItem[];
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
      { topic: "Welcome & Introductions", duration: "10 min", details: [
        { text: "Introduce yourself and CFA", note: "Share your background briefly. Mention CFA's track record — number of families helped, years of experience. Keep it warm and conversational, not a sales pitch." },
        { text: "Learn about the student-athlete and family goals", note: "Ask open-ended questions: 'Tell me about your golf journey so far.' 'What does success look like for your family?' Listen more than you talk here — take notes for later sessions." },
        { text: "Parents & guardians encouraged to join", note: "Emphasize this is a family journey. Parents make financial decisions and provide logistical support. Set the tone that their involvement is welcomed and expected." },
      ]},
      { topic: "Program Overview & What to Expect", duration: "15 min", details: [
        { text: "Walk through the 10-module curriculum", note: "Give a high-level overview — don't go deep into each module. Highlight that modules build on each other. Mention that they can revisit topics anytime through their dashboard." },
        { text: "Explain the dashboard tools and resources", note: "Screen-share the dashboard briefly. Point out the College Database, Tournament Log, Coach Tracker, and Scholarship Calculator. Don't demo everything — just show it exists." },
        { text: "Set communication expectations and cadence", note: "Explain session frequency (typically bi-weekly or monthly). Clarify how to reach you between sessions. Set expectations for response time (24-48 hours). Mention the action items system." },
      ]},
      { topic: "Setting Recruiting Goals & Timeline", duration: "20 min", details: [
        { text: "Discuss graduation year and recruiting windows", note: "This is critical framing. Map out where they are relative to key recruiting deadlines. For juniors/seniors, emphasize urgency without creating panic. For freshmen/sophomores, emphasize the advantage of starting early." },
        { text: "Identify target division level and school preferences", note: "Use the 'dream, match, safety' framework. Ask about geographic preferences, school size, academic interests. Don't let them fixate on one school — encourage breadth at this stage." },
        { text: "Establish short-term and long-term goals", note: "Short-term: specific scores, GPA targets, number of tournaments. Long-term: division level, scholarship aspirations. Write these down together — they become the benchmark for progress." },
      ]},
      { topic: "Getting the Most Out of Coaching Sessions", duration: "10 min", details: [
        { text: "How to prepare for each session", note: "Ask them to review their action items before each call. Complete any assigned worksheets ahead of time. Have questions ready — sessions are most productive when they come prepared." },
        { text: "Using the dashboard between meetings", note: "Encourage regular dashboard use — logging tournaments, updating coach contacts, tracking milestones. The data they enter between sessions drives the quality of the coaching." },
        { text: "Parent/guardian involvement expectations", note: "Parents should attend at least the first and last sessions, plus any financial-focused modules. For teens, parent involvement keeps everyone aligned and prevents miscommunication." },
      ]},
      { topic: "Q&A & Next Steps", duration: "5 min", details: [
        { text: "Answer initial questions", note: "Keep answers concise. If a question requires deep exploration, note it for the relevant future module rather than going down a rabbit hole now." },
        { text: "Assign pre-work for Module 1", note: "Assign: complete the Goal-Setting Worksheet, browse the College Database for 10 interesting schools, and register with the NCAA Eligibility Center if not done already." },
        { text: "Schedule next session", note: "Book it before hanging up — don't leave it open-ended. Confirm the calendar invite and how they'll receive the meeting link." },
      ]},
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
      { topic: "NCAA / NAIA / NJCAA Overview", duration: "15 min", details: [
        { text: "Division differences (D1, D2, D3, NAIA, JUCO)", note: "Use concrete examples — name actual schools at each level they might recognize. Emphasize that D2/D3/NAIA are not 'lesser' — they're different experiences. Many families only know D1 exists." },
        { text: "Scholarship availability by division", note: "D1 Men: 4.5, Women: 6. D2 same limits. D3: zero athletic, but generous academic/need-based. NAIA: up to 5. Explain equivalency vs head-count. Most golfers get partial scholarships — set realistic expectations." },
        { text: "Roster sizes and walk-on opportunities", note: "Typical roster: 8-12 players, only 5 compete per event. Walk-on spots exist but vary by program. Some D3/NAIA programs are more welcoming to walk-ons. This is where honest self-assessment matters." },
      ]},
      { topic: "Finding the Right Program Fit", duration: "15 min", details: [
        { text: "Academic vs. athletic fit", note: "Ask: 'If golf ended tomorrow, would you still want to attend this school?' The right school should work academically and socially even without golf. This prevents transfer regret later." },
        { text: "School size, location, and culture considerations", note: "Walk through lifestyle differences: 3,000-student liberal arts vs. 40,000-student state university. Urban vs. rural. Weather and travel. These factors affect daily happiness more than the golf program." },
        { text: "Using the College Database tool", note: "Live demo: show filtering by division, state, scoring average. Point out the compare feature. Assign them to save 10-15 favorites as homework." },
      ]},
      { topic: "Recruiting Timeline & Key Dates", duration: "15 min", details: [
        { text: "NCAA recruiting calendar overview", note: "Key dates: June 15 after sophomore year (D1/D2 coaches can contact), early signing period (November), regular signing period (April). Map these to the student's graduation year specifically." },
        { text: "Contact periods and dead periods", note: "Explain that dead periods mean NO in-person contact. Quiet periods allow unofficial visits but no official visits. Contact periods allow everything. Emphasize: student can ALWAYS reach out to coaches regardless of period." },
        { text: "Grade-level benchmarks and action items", note: "Freshman: build foundation, register with Eligibility Center. Sophomore: start outreach, build resume. Junior: peak recruiting year, campus visits. Senior: commitments and signing. Tailor to their current grade." },
      ]},
      { topic: "Program Fit Questionnaire", duration: "10 min", details: [
        { text: "Walk through the interactive questionnaire", note: "Do this together on-screen. Go question by question. This reveals preferences they may not have articulated — like whether they want a big campus or value coach accessibility." },
        { text: "Discuss initial preferences and priorities", note: "After completing: 'What surprised you about your answers?' Often families discover their priorities differ from what they assumed. Use this to refine the target school approach." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Review key takeaways", note: "Summarize in 2-3 sentences. Reinforce that there are 1,800+ programs — the goal is finding the RIGHT fit, not the most prestigious name." },
        { text: "Assign Target School Builder homework", note: "Assign: Use the College Database to build a preliminary list of 15-20 schools across reach/match/safety tiers. Include at least 2 divisions." },
        { text: "Preview Module 2 topics", note: "Brief teaser: 'Next time we'll make sure your academics are on track for eligibility. Please have your transcript and test scores ready.'" },
      ]},
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
      { topic: "NCAA Eligibility Center & Requirements", duration: "15 min", details: [
        { text: "Registration process walkthrough", note: "If not done, walk through eligibilitycenter.org registration live. If already registered, verify their account is set up correctly. Ensure they've requested transcript submission from their high school." },
        { text: "Core course requirements by division", note: "16 core courses for D1/D2: 4 English, 3 Math (Algebra 1+), 2 Science, 1 additional, 2 Social Science, 4 additional. Not all classes qualify — check their school's approved course list on the Eligibility Center." },
        { text: "GPA sliding scale explanation", note: "Show the actual sliding scale chart. D1: 2.3 core GPA minimum, but higher GPA = lower test score needed (and vice versa). A 3.0 GPA needs a 620 SAT / 52 ACT sum. Walk through their specific numbers." },
      ]},
      { topic: "GPA Planning & Course Selection", duration: "15 min", details: [
        { text: "Core Course Tracker tool walkthrough", note: "Open the Core Course Tracker worksheet together. Map their completed courses to the 16 requirements. Identify any gaps — especially if they're a junior/senior with limited time to fill them." },
        { text: "Identifying gaps in current coursework", note: "Common gaps: not enough math beyond Algebra 1, missing a lab science, or using non-approved electives. If gaps exist, help them plan course selections for remaining semesters immediately." },
        { text: "Strategies for GPA improvement", note: "If GPA is low: prioritize core courses, seek tutoring now (not after grades drop), consider summer school for recovery. Emphasize that core GPA is calculated differently than overall — only the 16 core courses count." },
      ]},
      { topic: "Test Prep Strategies (SAT/ACT)", duration: "15 min", details: [
        { text: "Score requirements by division", note: "D1 sliding scale ranges: 2.3 GPA needs 900 SAT / 75 ACT sum, 3.0 needs 620 SAT / 52 ACT sum, 3.55+ has no minimum. D2 has its own scale. D3/NAIA: set by individual schools, typically more flexible." },
        { text: "Test prep resources and timeline", note: "Recommend: Khan Academy (free), official practice tests, or local prep courses. Plan for 2-3 test attempts minimum. First attempt: spring of sophomore year ideally. Last useful attempt: fall of senior year." },
        { text: "Test Prep Worksheet walkthrough", note: "Complete the Test Prep Plan worksheet: target scores, test dates, prep method (self-study vs. tutor), and weekly study hours. Having a written plan increases follow-through dramatically." },
      ]},
      { topic: "Eligibility Checklist Review", duration: "10 min", details: [
        { text: "Walk through the interactive checklist", note: "Go item by item through the Eligibility Checklist. Check off completed items, flag outstanding ones. This creates accountability and a clear to-do list for the family." },
        { text: "Identify any red flags or action items", note: "Red flags: GPA below 2.5, missing core courses with no time to recover, not registered with Eligibility Center as a junior/senior. If red flags exist, create an emergency action plan with specific deadlines." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Summarize academic action plan", note: "Recap the 2-3 most important academic tasks. Be specific: 'Register with Eligibility Center by Friday,' not 'work on your academics.'" },
        { text: "Assign eligibility registration tasks", note: "If not registered: register this week. If registered: request transcript submission, verify core course list. If testing needed: register for next SAT/ACT date." },
        { text: "Preview Module 3 topics", note: "Teaser: 'Next session we'll look at your tournament performance and build a strategic schedule. Please update your Tournament Log with your last 10 competitive rounds.'" },
      ]},
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
      { topic: "Scoring Benchmarks by Division", duration: "15 min", details: [
        { text: "What scores coaches are looking for", note: "D1: 72-75 scoring avg (top programs want sub-72). D2: 74-78. D3: 76-82. NAIA: 75-80. JUCO: 76-82. These are ranges — use the College Database to look up specific program scoring averages together." },
        { text: "Scoring average vs. best rounds", note: "Coaches care more about scoring average than one great round. A consistent 76 shooter is more recruitable than someone who shoots 68 once and 84 the next. Emphasize that consistency = reliability in a coach's eyes." },
        { text: "How to present your stats effectively", note: "Teach them to frame stats positively: 'My scoring average has dropped from 82 to 77 over 12 months' is more compelling than just '77 average.' Improvement trajectory matters as much as current numbers." },
      ]},
      { topic: "Tournament Selection Strategy", duration: "15 min", details: [
        { text: "Types of tournaments that matter", note: "Ranked by coach importance: AJGA events, WAGR-rated events, state/regional junior tour events, high school state championships, local amateur events. National exposure events carry more weight than local wins." },
        { text: "Building a competitive schedule", note: "Aim for 15-20 competitive rounds per year minimum. Mix local events (consistency building) with travel events (exposure). Plan around school schedules and key recruiting periods. Quality > quantity." },
        { text: "Regional vs. national exposure events", note: "If targeting regional schools: local/state events are sufficient. If targeting nationally: need AJGA, PGA Jr League, or other national events. Budget matters — help them prioritize where their dollar goes furthest." },
      ]},
      { topic: "Stats Tracking & Tournament Log", duration: "15 min", details: [
        { text: "Using the Tournament Log tool", note: "Walk through entering a tournament result together. Show all fields: date, course, scores by round, finish position, field size. Emphasize logging EVERY competitive round — coaches will ask for comprehensive stats." },
        { text: "What data to track and why", note: "Beyond scores: GIR%, putts per round, up-and-down %, driving accuracy. Not all families track these — if they don't, suggest starting with just scoring average and rounds under par. Simple is better than not tracking at all." },
        { text: "Analyzing trends and improvement areas", note: "Look at their data together: Is the scoring average trending down? What's the standard deviation? Where do strokes get wasted? Use data to identify 1-2 practice priorities rather than trying to fix everything at once." },
      ]},
      { topic: "Performance Goal Setting", duration: "10 min", details: [
        { text: "Setting realistic scoring goals", note: "Use their current average and target division benchmarks to set 6-month and 12-month goals. A realistic improvement rate is 1-2 strokes per year of focused practice. Don't let them set goals that require a 10-stroke improvement in 6 months." },
        { text: "Practice vs. tournament performance", note: "Common issue: great in practice, poor in competition. Address mental game basics: pre-shot routine, staying present, managing expectations. Tournament scoring is typically 2-4 strokes higher than practice — that gap should narrow over time." },
        { text: "Mental game considerations", note: "Don't try to be their sports psychologist, but identify if mental game is a barrier. Recommend resources: books (Golf Is Not a Game of Perfect), apps (Headspace), or a sports psychologist referral if needed." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Review scoring benchmarks", note: "Restate their target division scoring range and where they currently fall. Make it concrete: 'You need to get from 79 to 76 to be competitive for D2 programs.'" },
        { text: "Plan upcoming tournament schedule", note: "Assign: Map out the next 3-6 months of tournaments. Include dates, locations, entry deadlines. Use WAGR calendar and AJGA schedule as resources." },
        { text: "Preview Module 4 topics", note: "Teaser: 'Next time we'll create a structured practice plan to close the gap between where you are and where you need to be. Think about your current practice routine before we meet.'" },
      ]},
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
      { topic: "Practice Planning Framework", duration: "15 min", details: [
        { text: "Structured vs. unstructured practice", note: "Most juniors practice without a plan — hitting balls aimlessly on the range. Structured practice has specific goals, time blocks, and measurable outcomes. Even 30 minutes of structured practice beats 2 hours of unstructured." },
        { text: "Time allocation across skill areas", note: "General guideline: 40% short game (putting, chipping, pitching), 30% full swing, 20% course management/playing, 10% fitness. Adjust based on their specific weaknesses identified in Module 3 stats analysis." },
        { text: "Weekly and monthly planning templates", note: "Help them build a realistic weekly schedule that works around school, tournaments, and family life. A plan that doesn't fit their life won't be followed. 4-5 practice sessions per week is ideal; 3 is minimum." },
      ]},
      { topic: "Skill Development Priorities", duration: "15 min", details: [
        { text: "Short game vs. long game focus", note: "The data almost always shows that short game improvements yield the fastest scoring drops. If they're losing 3+ strokes per round around the green, that's the priority. Don't let them spend all their time on the driver." },
        { text: "Identifying weaknesses through stats", note: "Review their Tournament Log data: Where are strokes being lost? If GIR% is low, work on approach shots. If putts per round is high, prioritize putting drills. Let data drive the practice plan, not preferences." },
        { text: "Drills and training aids recommendations", note: "Keep recommendations simple and affordable. Alignment sticks, a putting mirror, and a practice net cover most needs. Recommend specific drills for their weakness areas — be prescriptive, not generic." },
      ]},
      { topic: "Physical Fitness & Preparation", duration: "15 min", details: [
        { text: "Golf-specific fitness basics", note: "College golf requires walking 36 holes in a day, sometimes in heat. If they can't do that comfortably now, fitness needs attention. Focus on: core strength, hip mobility, cardiovascular endurance, and rotational power." },
        { text: "Flexibility, strength, and endurance", note: "Recommend age-appropriate exercises. No heavy lifting for younger teens — bodyweight exercises, resistance bands, and stretching are sufficient. Older athletes can add weight training with proper form guidance." },
        { text: "College-level fitness expectations", note: "Many college programs have mandatory strength and conditioning. Players who arrive out of shape struggle to compete. Show examples of college team fitness regimens if possible to set expectations." },
      ]},
      { topic: "Practice Log & Accountability", duration: "10 min", details: [
        { text: "Setting up a practice tracking system", note: "Keep it simple: date, duration, what they worked on, key takeaway. A notes app or simple spreadsheet works. The act of logging creates awareness and accountability. Don't make tracking a burden." },
        { text: "Accountability partnerships", note: "Encourage practicing with a friend/competitor, or having a parent check in weekly on practice goals. External accountability dramatically increases follow-through. Mention that you'll check in on practice goals each session." },
        { text: "Measuring improvement over time", note: "Revisit scoring stats monthly. Compare 10-round rolling averages. Celebrate improvements, no matter how small. If no improvement after 2-3 months, reassess the practice plan — something needs to change." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Finalize weekly practice plan", note: "They should leave with a written weekly schedule: what days, what focus areas, how long. Post it somewhere visible. Review and adjust after 2 weeks if needed." },
        { text: "Set fitness goals", note: "Simple, measurable goals: run a mile in under X minutes, do Y push-ups, practice X times per week. These are checkpoints, not transformations." },
        { text: "Preview Module 5 topics", note: "Teaser: 'Next session we build your recruiting profile — resume, video, and online presence. Have a recent golf photo ready and your best tournament results handy.'" },
      ]},
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
      { topic: "Building Your Recruiting Profile", duration: "15 min", details: [
        { text: "Essential information coaches want", note: "Coaches scan resumes in 30 seconds. Lead with: name, grad year, handicap/scoring avg, GPA, SAT/ACT. Then: top 3-5 tournament results, school, location. Everything else is secondary. Prioritize ruthlessly." },
        { text: "Athletic resume template and examples", note: "Use the CFA resume template. Walk through each section. Show a strong example and a weak example side-by-side. Common mistakes: too long (keep to 1 page), outdated stats, no contact info, bad photo." },
        { text: "Academic and athletic highlights", note: "Help them choose which achievements to feature. Not everything belongs on the resume. Rule: if it wouldn't impress a college coach, leave it off. Local tournament wins matter less than regional/national results." },
      ]},
      { topic: "Video Portfolio Guidelines", duration: "15 min", details: [
        { text: "What to film and how", note: "Full swing: driver and 7-iron, face-on and down-the-line angles. Short game: chips, pitches, bunker shots. Putting: show setup and stroke. On-course footage if possible. Smartphone on tripod is fine — no shaky handheld video." },
        { text: "Video length and format best practices", note: "3-5 minutes maximum. Title card with name, grad year, handicap, contact info. Organized by shot type. Show consistency — 3-4 shots of each type, not just the one perfect drive. Upload to YouTube (unlisted)." },
        { text: "Editing and hosting options", note: "Free editing: iMovie, CapCut. Don't over-edit — coaches want to see the real swing, not a highlight reel with fancy transitions. Music is optional and should be subtle if used. Always include contact info at the end." },
      ]},
      { topic: "Online Presence & Social Media", duration: "15 min", details: [
        { text: "Platforms coaches check", note: "Instagram is #1 — coaches WILL look. Twitter/X for golf-related content. Junior Golf Scoreboard, AJGA profiles. Google your name and see what comes up. Coaches do this — make sure the results are positive." },
        { text: "Profile optimization tips", note: "Instagram bio: Name, Grad Year, School, State, Handicap, Position. Remove anything inappropriate or immature. You don't need to be boring — just be someone a coach would want representing their program." },
        { text: "Content do's and don'ts", note: "Do: tournament results, practice videos, team photos, academic achievements. Don't: anything with alcohol/drugs, trash-talking other players, political rants, excessive partying. When in doubt, don't post it." },
      ]},
      { topic: "Profile Assembly Workshop", duration: "10 min", details: [
        { text: "Review draft resume together", note: "If they've started a draft, review it live. Provide specific, actionable feedback. If they haven't started, begin building it together on the call. Even a rough draft is better than nothing." },
        { text: "Identify missing content to gather", note: "Common missing items: professional headshot, updated stats, video footage, SAT/ACT scores. Create a checklist of what they need to gather before the next session." },
        { text: "Create video filming checklist", note: "Plan a specific filming session: when, where, who will help, what shots to capture. If they have a lesson with a swing coach, that's an ideal time to film." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Finalize resume draft deadline", note: "Set a specific date — 'Resume draft complete by next Friday.' Having a deadline prevents procrastination. They can use the Athlete Resume product in the shop for guided creation." },
        { text: "Schedule video filming", note: "Pick a date within the next 2 weeks. Have them identify a course and a helper. Morning light is usually best for filming. Backup plan in case of rain." },
        { text: "Preview Module 6 topics", note: "Teaser: 'Next session we start reaching out to coaches! Have your resume and video ready because we're going to draft your first outreach emails together.'" },
      ]},
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
      { topic: "Email Templates & Best Practices", duration: "15 min", details: [
        { text: "Initial outreach email structure", note: "Formula: 1) Personalized greeting using coach's name, 2) One sentence about why their specific program interests you, 3) Key stats (handicap, GPA, grad year), 4) Attach resume, include video link, 5) Clear ask: 'I'd love to learn more about your program.' Keep it under 200 words." },
        { text: "Follow-up email cadence", note: "First follow-up: 2 weeks after initial email. Second: 4 weeks later with updated stats/results. After that: monthly updates during recruiting season. Never more than once per week. If no response after 3 attempts, move on — don't harass." },
        { text: "Personalizing templates for each coach", note: "CRITICAL: Never send generic mass emails. Reference something specific: a recent team result, a coach's background, a player they produced, campus visit you took. Coaches can spot copy-paste emails instantly and they get deleted." },
      ]},
      { topic: "Phone Scripts & Communication", duration: "10 min", details: [
        { text: "What to say when calling coaches", note: "Script: 'Hi Coach [Name], my name is [Name], I'm a [Year] from [City, State]. I recently emailed you about joining your program and wanted to follow up.' Have 2-3 prepared questions about the team. Be genuine, not robotic." },
        { text: "Handling voicemail effectively", note: "Keep voicemails under 30 seconds: name, graduation year, school, phone number (spoken slowly), and one sentence about why you're calling. Always leave a voicemail — a missed call with no message looks unprofessional." },
        { text: "Phone call follow-up protocol", note: "After every call or voicemail, send a follow-up email referencing the conversation or attempt. 'Thank you for your time today' or 'I left a voicemail and wanted to follow up.' This creates a paper trail and shows persistence." },
      ]},
      { topic: "Coach Tracker Tool Walkthrough", duration: "15 min", details: [
        { text: "Setting up your coach contact list", note: "Walk through the Coach Tracker tool live. Enter 5-10 coaches together. Show how to find coach contact info: school athletics website, conference directories. Include head coach AND recruiting coordinator." },
        { text: "Tracking outreach status and responses", note: "Demonstrate status tracking: initial email sent, follow-up sent, response received, phone call scheduled. This prevents duplicate outreach and missed follow-ups. Organization = professionalism." },
        { text: "Managing follow-up reminders", note: "Set follow-up dates for each contact. Review the tracker at the start of each week. Treat this like a job — consistent follow-up is what separates successful recruits from those who fall through the cracks." },
      ]},
      { topic: "Campus Visit Preparation", duration: "15 min", details: [
        { text: "Questions to ask on visits", note: "Top questions: What's a typical day/week for a player? What's your coaching philosophy? How do you develop players? What are academic support resources? What happened to the last player who transferred out? (This reveals a lot.)" },
        { text: "What coaches are evaluating", note: "Coaches are watching: attitude, body language, how you interact with current players, how you treat staff, punctuality, and whether you asked good questions. The visit is a two-way interview — they're evaluating your character." },
        { text: "Using the Campus Visits tool to log impressions", note: "Walk through the Campus Visits tool. Show the rating categories: academics, facilities, coaching, campus, team culture. Log impressions immediately after the visit while details are fresh. Take photos to reference later." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Send first batch of outreach emails", note: "Assign: Send 5-10 personalized emails to target school coaches this week. Use the Email Draft Worksheet to prepare each one. Quality over quantity — 5 great emails beat 50 generic ones." },
        { text: "Schedule campus visits", note: "Assign: Identify 2-3 schools for campus visits in the next 2 months. Contact coaches to arrange unofficial visits. Check the school's visit policy and calendar." },
        { text: "Preview Module 7 topics", note: "Teaser: 'Next session we'll dive into financial aid, scholarship offers, and how to evaluate packages. Start thinking about your family's budget and financial expectations.'" },
      ]},
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
      { topic: "Understanding Scholarship Offers", duration: "15 min", details: [
        { text: "Types of scholarships (athletic, academic, need-based)", note: "Most families don't realize these can be stacked. A D3 player with no athletic scholarship can still get $30K+ in academic/need-based aid. D2 players often get a mix. Help them understand the full financial aid picture, not just the athletic offer." },
        { text: "Full vs. partial scholarship breakdown", note: "Full rides in golf are extremely rare (mostly D1 women). Most golfers get 25-75% athletic scholarship. Break down what that means in real dollars: if tuition is $40K and they offer 50%, that's $20K. Factor in room, board, books." },
        { text: "Equivalency vs. head-count sports", note: "Golf is an equivalency sport — the scholarship pool is divided among roster players. This means the star player might get 80% and a walk-on gets 10%. Knowing this prevents disappointment when offers come in below expectations." },
      ]},
      { topic: "Comparing Financial Packages", duration: "15 min", details: [
        { text: "Using the Scholarship Calculator tool", note: "Walk through the Scholarship Calculator live with a real or hypothetical offer. Enter tuition, room & board, fees, then subtract each type of aid. The net cost is what the family actually pays. Compare 2-3 schools side by side." },
        { text: "True cost of attendance breakdown", note: "Hidden costs families miss: travel to/from school, personal expenses, summer costs, equipment, tournament travel fees. A school that's $5K cheaper in tuition might be $5K more in travel. Geography affects total cost." },
        { text: "Hidden costs to watch for", note: "Summer housing (not always covered), meal plans during breaks, required gear/uniforms, offseason training costs, potential 5th year if credits don't transfer. Ask each school about these specifically." },
      ]},
      { topic: "Negotiation Strategies", duration: "15 min", details: [
        { text: "When and how to negotiate", note: "Best time: when you have multiple offers. Approach: 'School X has offered Y amount. Your program is my top choice — is there any flexibility in the package?' Be honest, respectful, and never bluff with offers you don't have." },
        { text: "Leveraging multiple offers", note: "Having 2-3 offers creates healthy leverage. Don't play schools against each other aggressively, but be transparent: 'I'm comparing packages from two programs.' Coaches expect this and respect honest communication." },
        { text: "What's negotiable and what isn't", note: "Negotiable: scholarship amount (sometimes), housing guarantees, meal plan upgrades, academic scholarship stacking. Not negotiable: NCAA rules on total aid, roster spot guarantees, starting position. Never negotiate via ultimatum." },
      ]},
      { topic: "Decision Framework", duration: "10 min", details: [
        { text: "Creating a pros/cons comparison", note: "Build a weighted comparison matrix: academics (30%), golf program (25%), finances (25%), location/culture (20%). Adjust weights based on family priorities. Rate each school 1-10 in each category. Math helps when emotions run high." },
        { text: "Involving family in the decision", note: "This is a family decision. Schedule a dedicated family meeting to review all options. Parents often have financial considerations the student doesn't fully understand. Alignment prevents regret." },
        { text: "Timeline for commitments", note: "Verbal commitments are not binding but should be honored ethically. NLI signing periods: early (November) and regular (April). Once NLI is signed, it's binding for one year. Explain the difference between verbal and NLI clearly." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Update scholarship tracker with offers", note: "Assign: Enter all current offers or estimated packages into the Scholarship Calculator. Include both offered and projected numbers. Having everything in one place makes comparison objective." },
        { text: "Prepare negotiation talking points", note: "If they have offers: draft specific negotiation talking points. If pre-offer: prepare questions about financial aid for upcoming campus visits or coach conversations." },
        { text: "Preview Module 8 topics", note: "Teaser: 'Next session is our capstone — we'll assemble your complete recruiting portfolio and build a 90-day action plan. Come ready to review everything we've built together.'" },
      ]},
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
      { topic: "Portfolio Assembly Review", duration: "20 min", details: [
        { text: "Review all completed worksheets and tools", note: "Go through each tool systematically: Goal-Setting, Program Fit, Core Course Tracker, Tournament Log, Coach Tracker, Scholarship Calculator. Identify any incomplete items and prioritize finishing them this week." },
        { text: "Ensure resume, video, and profiles are finalized", note: "Resume should be current, polished, and in PDF format. Video should be uploaded and accessible. Social media profiles should be clean and optimized. If any are incomplete, this is the last chance to address it." },
        { text: "Check that all outreach is documented", note: "Review the Coach Tracker: Are all contacts logged? Are follow-ups current? Are there coaches who should have been contacted but weren't? This is the accountability moment — fill any gaps." },
      ]},
      { topic: "90-Day Action Plan", duration: "20 min", details: [
        { text: "Set priorities for the next 90 days", note: "Based on their timeline (grade level, signing period proximity), identify the 3-5 most critical actions for the next quarter. Be specific: 'Send 10 emails by Oct 15,' not 'do more outreach.' Write it down together." },
        { text: "Define measurable milestones", note: "Each priority gets a measurable milestone: number of emails sent, campus visits completed, scoring average target, GPA maintained. If you can't measure it, it's not a real goal. Review these at each remaining session." },
        { text: "Assign accountability checkpoints", note: "Set 30-day, 60-day, and 90-day check-in dates. These can be brief calls or email updates. Having scheduled checkpoints prevents drift and keeps momentum. Put them on the calendar now." },
      ]},
      { topic: "Commitment Preparation", duration: "15 min", details: [
        { text: "NLI and commitment process overview", note: "Walk through the NLI process step by step. Explain early vs. regular signing periods. Clarify that verbal commitments are non-binding but should be respected. Discuss what happens after signing: financial aid agreement, enrollment steps." },
        { text: "What to expect after committing", note: "After commitment: stay in contact with coach, maintain grades and eligibility, continue competing, start preparing for the transition. Committing is not the finish line — it's the start of a new chapter." },
        { text: "Transfer portal awareness", note: "Brief overview: if things don't work out, the transfer portal exists. But the goal is to make the right choice the first time. This is why we've been so thorough with the decision framework. Mention the Transfer Program if relevant." },
      ]},
      { topic: "Wrap-Up & Next Steps", duration: "5 min", details: [
        { text: "Celebrate progress made", note: "Take a moment to acknowledge how far they've come. From the onboarding call to now, they have a complete recruiting toolkit, a strategy, and a plan. This is significant and worth recognizing." },
        { text: "Discuss ongoing support options", note: "Explain what continued support looks like: ad-hoc check-ins, module refreshers, or ongoing monthly sessions. Some families want continued guidance through signing day. Present options without pressure." },
        { text: "Preview conclusion session", note: "Teaser: 'Our final session will prepare you for the actual transition to college golf — what to expect, how to prepare, and how to hit the ground running.' Get them excited about the finish line." },
      ]},
    ],
    deliverables: ["Complete recruiting portfolio", "90-day action plan document", "Commitment readiness checklist"],
  },
  {
    moduleNumber: 9,
    title: "Conclusion: Get Ready For College Golf",
    totalDuration: "60 min",
    objective: "Prepare for the transition to college golf and wrap up the program.",
    agenda: [
      { topic: "Transition Planning", duration: "15 min", details: [
        { text: "Summer before college checklist", note: "Cover: housing arrangements, meal plan selection, course registration, connect with roommate/teammates, train on the school's course if possible, attend orientation, complete any required NCAA paperwork. Create a week-by-week countdown." },
        { text: "Communicating with future coach and teammates", note: "Encourage them to reach out to the coach regularly over summer: training updates, tournament results, questions about arrival. Connect with teammates on social media. Ask about summer workouts or team activities to attend." },
        { text: "Academic registration and orientation prep", note: "Register for classes early (athlete priority registration helps). Meet with academic advisor to plan your first semester. Balance course load with practice/travel schedule. Don't take 18 credits your first semester." },
      ]},
      { topic: "Final Preparations", duration: "15 min", details: [
        { text: "Equipment and gear needs", note: "Check with the coach about team equipment deals/sponsorships. You may need specific gear (team bag, rain gear, specific ball). Some programs provide equipment; others don't. Budget for any personal equipment upgrades." },
        { text: "Fitness and practice plan through summer", note: "The summer before college is the last chance to prepare physically. Follow any team-provided workout plans. Maintain competitive play through summer events. Arrive ready to compete on day one — first impressions matter." },
        { text: "Mental preparation for college athletics", note: "Honest conversation: college golf is a big step up in intensity, accountability, and competition. Discuss managing expectations, handling being 'the freshman,' balancing social life with athletics. Normalize the adjustment period." },
      ]},
      { topic: "Program Review & Reflection", duration: "15 min", details: [
        { text: "Review all modules and progress made", note: "Walk through the journey from Module 0 to now. Show concrete progress: schools contacted, visits completed, offers received, skills developed. This is their story — help them see the full arc." },
        { text: "Celebrate achievements and milestones", note: "Acknowledge specific wins: first coach response, first campus visit, first offer, academic improvements. Celebrate the family's commitment to the process. This is a feel-good moment — let it breathe." },
        { text: "Identify areas for continued growth", note: "Honest assessment: what still needs work? Course management, fitness, mental game? These become their focus areas for the first semester of college golf. Growth doesn't stop at commitment." },
      ]},
      { topic: "Ongoing Support & Resources", duration: "10 min", details: [
        { text: "Post-program support options", note: "Outline available support: check-in calls, first-semester coaching, transfer assistance if needed. Some families want a safety net — let them know it's available without pushing." },
        { text: "Alumni network and community", note: "Connect them with other CFA alumni if possible. A community of student-athletes going through the same experience is invaluable. Mention any CFA social channels or alumni groups." },
        { text: "How to stay connected with CFA", note: "Share how to reach you for future questions. Encourage them to submit a testimonial about their experience. Ask if they'd be willing to be a reference for future families." },
      ]},
      { topic: "Final Q&A & Send-Off", duration: "5 min", details: [
        { text: "Address remaining questions", note: "Open the floor for any final questions. If questions are complex, offer to address them in a follow-up email or call. Don't rush this — some families need closure." },
        { text: "Words of encouragement", note: "Share genuine encouragement about their future. Reference specific strengths you've observed. Remind them that they've done the work and they're prepared. This moment sticks with families." },
        { text: "Congratulations and next chapter!", note: "End on a high note. This is the culmination of months of work. Express genuine pride in their progress. Wish them well. If appropriate, mention that you'll be following their college career." },
      ]},
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
      { topic: "Why Transfer? Self-Assessment", duration: "10 min", details: [
        { text: "Identify reasons for transferring (playing time, coaching, academics, location)", note: "This is the most important conversation. Ask direct questions: 'Are you running FROM something or TO something?' Transferring to escape problems rarely works. Transferring toward a better fit does." },
        { text: "Evaluate what didn't work at current school", note: "Get specifics — vague complaints suggest the athlete hasn't thought it through. 'I don't like the coach' → What specifically? Communication? Philosophy? Playing time? Understanding the root cause prevents repeating the mistake." },
        { text: "Set clear expectations — entering portal doesn't guarantee a scholarship", note: "CRITICAL reality check: many athletes enter the portal and don't find a better situation. Scholarship money may not be available. They may end up at the same level or lower. Make sure they understand the risk." },
      ]},
      { topic: "NCAA Transfer Portal Overview", duration: "15 min", details: [
        { text: "What the portal is and how it works (launched 2018)", note: "Simple explanation: it's a database. When you enter, every coach in the country can see your name and contact you. Before the portal, you needed permission from your coach to talk to other schools. Now you don't." },
        { text: "Sport-by-sport transfer windows — Golf windows: Men's May 13–Jun 11, Women's May 6–Jun 4 (2026)", note: "These dates are CRITICAL. Missing the window means waiting until next year (unless graduate student). Write these dates down. Set reminders 2 weeks before the window opens to make a final decision." },
        { text: "Once in portal, coaches can legally initiate contact", note: "Before entering: only the athlete can reach out (and coaches can't respond substantively). After entering: coaches can call, text, email, DM. The flood of attention can be overwhelming — prepare them for it." },
        { text: "Entering is essentially a one-way street — current school not obligated to keep scholarship/roster spot", note: "This is the biggest risk. Once your name is in the portal, your current coach sees it immediately. Your scholarship is no longer guaranteed. Some coaches pull scholarships or roster spots immediately. This is NOT reversible in most cases." },
        { text: "Your coach sees immediately that you've entered", note: "No surprise — there's no way to 'quietly' explore. The moment you submit to compliance, your coach knows. Have the courtesy conversation BEFORE entering. Burning bridges helps no one." },
      ]},
      { topic: "2026 Rule Changes: Immediate Eligibility", duration: "10 min", details: [
        { text: "As of Feb 2026: immediately eligible regardless of transfer count", note: "This is a game-changer. Previously, some transfers had to sit out a year. Now everyone is immediately eligible as long as they meet the academic requirements. This makes transferring more viable but also more competitive." },
        { text: "Requirements: academically eligible, no disciplinary suspension/dismissal, progress-toward-degree", note: "Immediate eligibility isn't automatic — you must be in good academic standing, not been dismissed for disciplinary reasons, and be making progress toward your degree. Get confirmation from compliance at the new school." },
        { text: "Transfer windows still apply for undergraduates", note: "Even though eligibility is immediate, you must enter the portal during your sport's transfer window. Graduate students have more flexibility, but undergrads are bound by the window dates." },
        { text: "Graduate students can transfer multiple times and enter outside windows", note: "Grad transfers have the most flexibility. If they've completed their undergrad degree, they can enter the portal outside the regular window and transfer multiple times. This is a significant advantage." },
        { text: "Graduate transfers now subject to Jan 2-16 window (previously could enter anytime)", note: "New rule for 2026: grad transfers now have a specific January window. Previously they could enter anytime. This adds a constraint but also a timeline to plan around. Calendar it." },
      ]},
      { topic: "Special Windows & Exceptions", duration: "10 min", details: [
        { text: "Coaching change window: 15-day window opens 5 days after new head coach hired/announced", note: "If your head coach leaves or is fired, you get a special transfer window. This is separate from the regular sport window. It acknowledges that you committed to a coach, not just a school. Track coaching changes at your school." },
        { text: "If no coach announced within 30 days, 15-day window opens", note: "If the school doesn't announce a new coach within 30 days of the previous coach's departure, the window opens automatically. Don't rush — use this time to evaluate whether the new coach might actually be better." },
        { text: "Coaching change window only available after regular window opens through Jan 2", note: "This window is only available during the regular transfer period through January 2nd. If the coaching change happens outside this range, different rules may apply. Check with compliance." },
        { text: "Playoff/championship extensions for football and basketball", note: "Not directly applicable to golf, but good to know: football and basketball have extended windows for teams in playoffs/championships. Golf doesn't have this provision currently." },
      ]},
      { topic: "JUCO & D3 Transfer Rules Overview", duration: "10 min", details: [
        { text: "JUCO→NCAA: qualifier/non-qualifier status, 2.5 GPA minimum, register with NCAA Eligibility Center", note: "JUCO transfers have specific academic requirements. A 'qualifier' (met NCAA standards out of HS) has different rules than a 'non-qualifier.' Both need a 2.5 GPA and Eligibility Center registration. Determine their qualifier status first." },
        { text: "JUCO→NAIA: no residency requirement, must register with NAIA Eligibility Center, 24 semester/36 quarter hours required", note: "NAIA is generally more transfer-friendly. No sitting out period, but you must have completed enough hours to transfer. Register with the NAIA Eligibility Center early — it takes time to process." },
        { text: "D3 transfers: Self-Release Form or Notification of Transfer depending on origin division", note: "D3 to D3: Self-Release Form (athlete controls the process). D1/D2 to D3: Notification of Transfer through the portal. D3 to D1/D2: must enter the portal. Understanding the correct process prevents delays." },
        { text: "From NAIA: permission-to-contact letter required", note: "If transferring from an NAIA school, you need a permission-to-contact letter from your current athletic director. Request this BEFORE reaching out to new schools. Without it, coaches can't officially recruit you." },
        { text: "From JUCO to D3: contact head coach directly, no formal docs needed", note: "JUCO to D3 is the simplest path. No portal, no formal release process. Just contact the D3 coach directly and apply to the school. Academic eligibility is determined by the D3 institution." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Complete transfer readiness self-assessment", note: "Assign the Transfer Readiness worksheet. They should complete it honestly before the next session. This becomes the foundation for everything that follows." },
        { text: "Identify your sport's transfer window dates", note: "Write down the exact window dates and set calendar reminders. If the window is approaching, accelerate the timeline. If it's months away, use the time to prepare thoroughly." },
        { text: "Preview Module 2 topics", note: "Teaser: 'Next session we'll audit your credits and verify your eligibility at target schools. Request your unofficial transcript and bring it to the next call.'" },
      ]},
    ],
    deliverables: ["Transfer readiness assessment completed", "Transfer timeline with window dates drafted", "Division-specific rules identified"],
  },
  {
    moduleNumber: 2,
    title: "Academic & Eligibility Audit",
    totalDuration: "60 min",
    objective: "Map current coursework to target schools and verify eligibility requirements.",
    agenda: [
      { topic: "Credit Transfer Analysis", duration: "20 min", details: [
        { text: "Using the Credit Audit Worksheet tool", note: "Open the Credit Audit Worksheet and work through it live. Enter each course from their transcript. This is tedious but critical — skipping it leads to nasty surprises later when credits don't transfer." },
        { text: "Course-by-course mapping to target schools", note: "Each target school has its own transfer equivalency tool (usually on the registrar's website). Look up 3-5 target schools' equivalencies together. Show them how to use these tools independently for the rest." },
        { text: "Identifying credits that may not transfer", note: "Common problem areas: specialized technical courses, courses below 100-level, courses with no equivalent at the new school. If key credits won't transfer, that extends graduation timeline and increases cost. Factor this into school comparison." },
        { text: "Understanding how credit loss affects graduation timeline", note: "Do the math together: 'If you lose 12 credits, that's roughly one semester added. At $20K/semester, that's a real cost.' Credit loss isn't just academic — it's financial. This affects the overall value of transferring." },
        { text: "JUCO transfers: must have completed 24 semester/36 quarter hours", note: "For JUCO athletes: verify they have or will have enough hours before transferring. If they're short, they may need to take summer courses. Check this early — it's a hard requirement." },
      ]},
      { topic: "Eligibility Clock & Requirements", duration: "15 min", details: [
        { text: "Years of eligibility used vs. remaining", note: "NCAA athletes have 5 years to use 4 years of eligibility (5-year clock). Count carefully: every year enrolled at a four-year school counts against the clock, even if they didn't play. COVID eligibility extensions may apply." },
        { text: "Progress-toward-degree requirements at new school", note: "Each school has its own progress-toward-degree requirements. Generally: must complete a certain percentage of degree requirements by each year. Changing majors when transferring can complicate this. Meet with academic advising early." },
        { text: "For JUCO→D1/D2: determine qualifier/non-qualifier/academic redshirt status", note: "This status is determined by whether they met NCAA academic standards coming out of high school. It affects how many hours they need at the JUCO level and whether they have full eligibility. This is a compliance question — help them contact their JUCO's compliance office." },
        { text: "GPA of 2.5+ required for JUCO→4-year transfers", note: "This is a hard floor — below 2.5 GPA means they cannot transfer to a four-year NCAA/NAIA school. If they're close, prioritize GPA improvement above all else. Every tenth of a point matters." },
        { text: "Register with NCAA or NAIA Eligibility Center as applicable", note: "If not already registered, do this NOW. Processing takes time, and schools cannot officially admit a transfer athlete without eligibility clearance. Don't let paperwork be the reason a transfer falls through." },
      ]},
      { topic: "GPA & Academic Standing", duration: "15 min", details: [
        { text: "How GPA transfers (or doesn't)", note: "Important nuance: most schools do NOT transfer your GPA — only credits. You start with a fresh GPA at the new school. This can be good (fresh start) or bad (lost a high GPA). Some conferences calculate cumulative GPA across schools for eligibility." },
        { text: "Minimum GPA requirements by division", note: "D1/D2: varies by school but typically 2.0-2.5 minimum for admission. Many programs have higher internal standards (2.5-3.0). D3: set by the institution. NAIA: 2.0 minimum but programs may require higher. Check each target school." },
        { text: "Academic support resources at target schools", note: "Ask about: tutoring programs, study hall requirements, academic advisors dedicated to athletes, priority registration. Strong academic support can make a challenging school manageable. This is a real differentiator between programs." },
        { text: "Can you balance a difficult major with team responsibilities?", note: "Honest conversation: some majors (engineering, pre-med, nursing) are very difficult to balance with D1 athletics. Discuss whether their academic goals and athletic goals are compatible at each target school. Some schools handle this better than others." },
      ]},
      { topic: "Red Flags & Waivers", duration: "5 min", details: [
        { text: "Disciplinary issues that block immediate eligibility", note: "If dismissed or suspended for disciplinary reasons at their current school, immediate eligibility may be denied. This is a serious issue — be honest about it. Waivers exist but are not guaranteed. Get compliance involved early." },
        { text: "Mid-year restrictions (basketball: can't play if enrolled at NCAA school in first term)", note: "While this specific rule applies to basketball, the principle extends to other sports in certain situations. Mid-year transfers may face restrictions depending on timing and sport. Verify with compliance at the target school." },
        { text: "Documentation to gather from current school", note: "Checklist: unofficial transcripts, compliance release/Notification of Transfer confirmation, any waiver documentation, eligibility statement from current school. Having these ready speeds up the process significantly." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Complete Credit Audit Worksheet", note: "If not finished during the session, complete it this week. Every course needs to be mapped. This is non-negotiable before moving forward with specific school targets." },
        { text: "Request unofficial transcripts", note: "Request from every institution attended. Most can be obtained through the registrar's website. Some charge a small fee. Do this TODAY — transcripts take time to process." },
        { text: "Preview Module 3 topics", note: "Teaser: 'Next session we'll build your transfer resume and leverage your collegiate experience. Gather your college tournament results and any swing video from recent events.'" },
      ]},
    ],
    deliverables: ["Credit Audit Worksheet completed", "Eligibility years documented", "Transcript request initiated"],
  },
  {
    moduleNumber: 3,
    title: "College Golf Resume 2.0 — Leveraging Collegiate Experience",
    totalDuration: "60 min",
    objective: "Build a compelling transfer resume using collegiate stats, film, and experience.",
    agenda: [
      { topic: "Collegiate Stats Resume", duration: "20 min", details: [
        { text: "Translating college tournament results into a recruiting resume", note: "College stats carry more weight than high school stats. Highlight: rounds played, scoring average, best finish, team contributions, conference performance. If they improved over their time, show the trajectory." },
        { text: "Using the Tournament Log to showcase collegiate performance", note: "Walk through entering their college tournament results if not already done. Coaches want to see consistent collegiate competition, not just one good event. Volume of data matters here." },
        { text: "Comparing your stats to target programs' team averages", note: "This is where the College Database is powerful. Compare their scoring average to target programs' team averages. If their average is 76 and the team averages 77, they know they'd be competitive. Be realistic about reach schools." },
        { text: "What transfer coaches value vs. what HS coaches value", note: "Transfer coaches want: proven college performance, maturity, immediate impact, low maintenance. They care less about potential and more about current ability. Frame the resume around what you CAN do, not what you MIGHT do." },
      ]},
      { topic: "Video & Film Portfolio for Transfers", duration: "15 min", details: [
        { text: "College-level swing video expectations", note: "Transfer video should show a mature, repeatable swing. Coaches expect higher quality than HS recruits. Include on-course footage from actual college events if available. A Trackman/launch monitor session adds credibility." },
        { text: "Game film from collegiate events", note: "If their current school filmed events, request that footage. Even smartphone footage from a parent/friend at a tournament works. On-course behavior and decision-making are visible in game film — coaches watch for these." },
        { text: "Creating a highlight reel with context", note: "Transfer highlight reels should include: swing footage (range and course), tournament footage, stats overlay. Add context: 'Conference tournament, final round, 68 (-4), 3rd place finish in field of 85.' Context makes individual clips meaningful." },
      ]},
      { topic: "Positioning Your Transfer Story", duration: "15 min", details: [
        { text: "Crafting a positive narrative (why transferring, not why leaving)", note: "CRITICAL COACHING MOMENT: Help them reframe their story. Instead of 'I didn't get along with my coach,' say 'I'm looking for a program where I can contribute more to the team and develop as a player.' Focus on what they're seeking, not what they're escaping." },
        { text: "Addressing the 'why' question coaches will ask", note: "Every coach will ask: 'Why are you leaving?' Prepare a 30-second answer that's honest, positive, and forward-looking. Practice it until it's natural. Red flag answers: blaming others, sounding entitled, being vague." },
        { text: "Demonstrating maturity and self-awareness", note: "Transfer athletes who show self-awareness are more attractive. 'I learned X about myself at my current school, and now I know I need Y in a program.' This shows growth, not just dissatisfaction." },
      ]},
      { topic: "Online Presence Refresh", duration: "5 min", details: [
        { text: "Updating profiles to reflect transfer status", note: "Update social media bios to reflect current status without being negative about current school. Remove any content that contradicts the positive narrative. Coaches WILL check social media — especially for transfers (more scrutiny)." },
        { text: "Social media considerations during the portal process", note: "Don't announce entering the portal on social media before telling your coach. Don't trash-talk your current school/coach online. After entering, it's okay to post that you're exploring opportunities. Keep it professional and positive." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Finalize transfer resume", note: "Set a deadline: resume complete by next session. It should be polished, current, and PDF-formatted. Include the transfer narrative somewhere — either in the resume or as a separate statement." },
        { text: "Gather collegiate film clips", note: "Request any available footage from the current school. Film 2-3 practice sessions this week. Schedule a Trackman session if budget allows. Quality footage makes a significant difference for transfers." },
        { text: "Preview Module 4 topics", note: "Teaser: 'Next session we'll develop your portal entry strategy and start coach outreach. Start making a list of 10-15 target programs and their head coaches.'" },
      ]},
    ],
    deliverables: ["Transfer-specific resume completed", "Video highlights compiled", "Transfer narrative drafted"],
  },
  {
    moduleNumber: 4,
    title: "Portal Strategy & Coach Outreach",
    totalDuration: "60 min",
    objective: "Develop a strategic portal entry plan and effective coach communication approach.",
    agenda: [
      { topic: "Portal Entry Strategy & Process", duration: "15 min", details: [
        { text: "Step 1: Be absolutely certain about transferring — scholarship may not be guaranteed if you return", note: "Final gut check: 'If no school offers you a better deal, would you return to your current school? Would they take you back?' If the answer is unclear, they may not be ready. Entering the portal should be a committed decision, not an exploration." },
        { text: "Step 2: Talk to current coach first — courtesy and scholarship/roster implications", note: "Script this conversation: 'Coach, I've decided to explore transfer opportunities. I respect our time together and wanted to tell you directly.' Expect various reactions — some coaches are supportive, others aren't. Either way, be professional." },
        { text: "Step 3: Provide written notice to compliance office — school has 48 hours to enter your name", note: "After the coach conversation, submit a written request to the school's compliance office. The school MUST enter your name within 48 hours — they cannot block it. Keep a copy of your submission with a timestamp." },
        { text: "Using the Transfer Portal Tracker tool", note: "Walk through the Transfer Portal Tracker together. Enter target schools, coach contacts, status of outreach, and notes. This tool becomes command central for managing the process." },
        { text: "WARNING: Entering is a one-way street — coach sees immediately, scholarship at risk", note: "Restate this clearly: once entered, your current coach sees it. Scholarship renewal is at their discretion. Some coaches immediately pull scholarship offers for the following year. Understand this risk before proceeding." },
      ]},
      { topic: "Coach Outreach for Transfers", duration: "20 min", details: [
        { text: "CRITICAL: Coaches cannot discuss transfers with athletes NOT in the portal (tampering violation)", note: "This is an NCAA violation. Before entering the portal, coaches at other schools cannot recruit you or discuss a potential transfer. Any contact before portal entry is considered tampering. The athlete CAN express general interest, but coaches can't respond with transfer-specific discussions." },
        { text: "Different approach than HS recruiting — coaches want proven, ready-to-play athletes", note: "Transfer outreach should be more direct and confident. Lead with stats: 'I'm a sophomore with a 74.5 scoring average, 3.4 GPA, and 3 years of eligibility remaining.' Coaches are looking for immediate contributors, not developmental projects." },
        { text: "Key questions to ask: Where do you see me fitting? What are offseason expectations?", note: "Teach them to ask smart questions: roster composition, what positions/roles they're recruiting for, what the practice environment is like, and what the coach's expectations are for transfers specifically." },
        { text: "Team culture questions: What does your team do outside sports? Have transfers faced challenges?", note: "Culture fit is even MORE important for transfers who've already experienced a bad fit. Ask: 'What do your players say they love most about the program?' Ask to speak with a current player privately if possible." },
        { text: "Financial aid questions: What does it take to earn a scholarship? What happens if I'm injured?", note: "Direct financial questions are appropriate for transfers: 'What scholarship amount are you considering?' 'Is the offer renewable?' 'What happens to my scholarship if I'm injured?' Don't be shy — this is a business negotiation." },
      ]},
      { topic: "Campus Visit Strategy", duration: "15 min", details: [
        { text: "Visit BEFORE making a final decision", note: "This is non-negotiable advice. NEVER commit to a transfer without visiting campus. The portal moves fast and coaches create urgency — but a visit is worth the time. You're preventing another bad fit." },
        { text: "Connect with coaching staff to find a good visit date", note: "Ideal visit: when the team is practicing or competing. Meet current players, see the facilities in action, eat in the dining hall, sit in on a class if possible. A curated tour is nice but you need to see the real day-to-day." },
        { text: "What to evaluate differently as a transfer", note: "As a transfer, you know what matters to you (you learned the hard way). Focus on the specific issues that caused you to transfer: coaching communication style, playing time transparency, academic support, team chemistry. This is a second chance — make it count." },
        { text: "Using Campus Visits tool to compare and log impressions", note: "Use the Campus Visits tool to log detailed notes immediately after each visit. Rate each school on the same criteria for objective comparison. Photos help too. Don't rely on memory — impressions fade quickly." },
      ]},
      { topic: "Managing Current School Relationships", duration: "5 min", details: [
        { text: "Notifying current coaching staff professionally", note: "Even if the relationship is strained, leave professionally. Golf is a small world — coaches talk to each other. Your current coach's reference (positive or negative) can follow you. Take the high road always." },
        { text: "Understanding your school's policies on scholarship retention", note: "Some schools honor the scholarship through the academic year even after portal entry. Others don't. Know your school's policy before entering. This affects your financial planning if the transfer doesn't happen quickly." },
        { text: "NCAA compliance during the process", note: "Stay in good standing academically and athletically until you officially leave. Attend classes, don't skip team obligations. Any disciplinary issues during the process can jeopardize immediate eligibility at the new school." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Populate Transfer Portal Tracker with targets", note: "Assign: Enter at least 10 target schools with coach contact information into the tracker. Categorize as reach/match/safety. Include schools across multiple divisions if appropriate." },
        { text: "Draft first outreach emails", note: "Assign: Draft outreach emails to top 5 target schools using the Email Draft Worksheet. Customize each one. Have them ready for review at the next session (or to send immediately if in the portal)." },
        { text: "Preview Module 5 topics", note: "Teaser: 'Next session we'll tackle scholarship negotiation, comparing financial packages, and understanding NIL. Start tracking any offers or conversations about money.'" },
      ]},
    ],
    deliverables: ["Transfer Portal Tracker populated", "Coach outreach emails drafted", "Campus visit priorities identified"],
  },
  {
    moduleNumber: 5,
    title: "Scholarship Negotiation & NIL Considerations",
    totalDuration: "60 min",
    objective: "Maximize scholarship value and understand the NIL landscape for transfers.",
    agenda: [
      { topic: "Transfer Scholarship Dynamics", duration: "15 min", details: [
        { text: "Transfers often have leverage — use it wisely", note: "Transfers with proven stats and immediate eligibility are valuable commodities. Coaches need roster spots filled quickly. This creates leverage — but overplaying it can backfire. Be confident, not arrogant." },
        { text: "How offers differ for transfers vs. incoming freshmen", note: "Transfer offers tend to come faster and with clearer terms. Coaches know what they're getting (proven player vs. potential). Offers may be more generous because the player contributes immediately. But the timeline is compressed." },
        { text: "Using the Scholarship Calculator to compare packages", note: "Walk through the Scholarship Calculator with any current offers or projected packages. Compare net cost across schools. Include the credit loss factor — extra semesters cost real money." },
        { text: "Understanding what's negotiable", note: "Negotiable: scholarship amount, housing upgrades, summer aid, guaranteed years. Less negotiable: out-of-state tuition waivers (some schools do this routinely). Not negotiable: NCAA limits on total aid. Ask specifically what's on the table." },
      ]},
      { topic: "Negotiation Strategies", duration: "15 min", details: [
        { text: "Leveraging multiple transfer offers", note: "Having 2-3 offers is ideal for negotiation. Be transparent: 'I've received offers from School A and School B. Your program is my preference — can you match or improve on this package?' Honesty builds trust." },
        { text: "Academic merit + athletic aid combination", note: "Ask about stacking: some schools allow academic merit scholarships on top of athletic aid. This can significantly increase the total package. Ask the admissions office separately from the coach — they may not coordinate automatically." },
        { text: "Timing your decisions strategically", note: "Don't accept the first offer immediately (unless it's clearly the best). Ask for a reasonable decision timeline (1-2 weeks). Use that time to finalize other conversations. But don't drag it out — coaches move on to other targets quickly." },
        { text: "When to walk away from an offer", note: "Walk away if: the financial package doesn't work for your family, the coach pressures you into a rushed decision, something felt wrong on the visit, or your gut says no. Trust the process — another opportunity will come." },
      ]},
      { topic: "NIL Landscape for Transfers", duration: "15 min", details: [
        { text: "How NIL plays into transfer decisions", note: "NIL has changed the transfer calculus significantly. Some athletes transfer partly for better NIL opportunities. Understand the NIL landscape at each target school — collectives, institutional deals, and local market opportunities." },
        { text: "School-specific NIL collectives and policies", note: "Every school handles NIL differently. Some have organized collectives that pool donor funds. Others leave it to individual athletes. Ask specific questions: 'Does your school have a NIL collective? What have golfers typically received?'" },
        { text: "Questions to ask about NIL opportunities", note: "Good questions: 'What NIL support does the athletic department provide?' 'Are there brand partnership opportunities through the school?' 'What have other athletes in similar sports earned?' Don't make NIL the primary decision factor." },
        { text: "NIL shouldn't be the sole deciding factor", note: "Important framing: NIL money is not guaranteed, may not last, and varies wildly. A $5K NIL deal shouldn't override a $15K scholarship difference. Help them weigh NIL appropriately — it's a factor, not THE factor." },
      ]},
      { topic: "Financial Package Comparison", duration: "10 min", details: [
        { text: "Total cost of attendance comparison", note: "Build a comprehensive comparison: tuition, room, board, fees, books, travel, personal expenses MINUS all aid sources. The net annual cost is the number that matters. Multiply by years remaining to get total program cost." },
        { text: "Factor in credits lost and extra semesters", note: "If transferring costs 1 extra semester: add that semester's cost to the total. If transferring SAVES semesters (rare but possible): subtract. This hidden cost is often the difference between a 'good deal' and a 'bad deal.'" },
        { text: "Log offers in Scholarship Calculator", note: "Enter all offers into the Scholarship Calculator for side-by-side comparison. Include both confirmed offers and projected packages. Update as negotiations progress. This is the decision-making document." },
      ]},
      { topic: "Wrap-Up & Action Items", duration: "5 min", details: [
        { text: "Update scholarship offers in calculator", note: "Assign: Enter or update all financial information in the Scholarship Calculator this week. Include every source of aid: athletic, academic, need-based, NIL (if applicable)." },
        { text: "Prepare negotiation talking points", note: "Assign: Write out specific negotiation talking points for their top 2-3 schools. Practice saying them out loud. The more comfortable they are, the more effective the negotiation." },
        { text: "Preview Module 6 topics", note: "Teaser: 'Our final session will be about making the decision and planning your transition. Come ready to discuss your top choice and any remaining concerns.'" },
      ]},
    ],
    deliverables: ["Scholarship offers logged and compared", "Negotiation strategy documented", "NIL questions prepared"],
  },
  {
    moduleNumber: 6,
    title: "Decision & Transition Planning",
    totalDuration: "60 min",
    objective: "Make the final transfer decision and plan a smooth transition.",
    agenda: [
      { topic: "Decision Framework", duration: "15 min", details: [
        { text: "Weighing all factors: academics, athletics, finances, culture", note: "Use the weighted comparison matrix from Module 7 (HS) or build one now. Assign weights based on what matters most to THIS family. The math removes emotion and makes the decision clearer." },
        { text: "Using Campus Visit comparisons", note: "Pull up the Campus Visits tool and compare ratings across all visited schools. Which school scored highest overall? Which scored highest in the categories they care about most? Data helps when emotions are conflicting." },
        { text: "Family involvement in the decision", note: "Schedule a family decision meeting if one hasn't happened. Everyone who will be affected financially or emotionally should have input. Consensus is ideal but not always possible — the athlete makes the final call." },
        { text: "Setting a decision deadline", note: "Set a firm date: 'We will make a decision by [date].' Open-ended deliberation leads to paralysis. Coaches also appreciate knowing when to expect an answer. A reasonable deadline is 1-2 weeks after all visits and offers are in." },
      ]},
      { topic: "Commitment & Portal Exit", duration: "15 min", details: [
        { text: "How to formally commit and exit the portal", note: "Process: verbal commitment to coach, then formal withdrawal from the portal through the compliance office. Once you withdraw, you can't re-enter during the same window. Make sure the offer is confirmed in writing before withdrawing." },
        { text: "Transfer paperwork and release requirements", note: "Depending on division: Self-Release Form (D3), Notification of Transfer (portal), or permission-to-contact letter (NAIA). Ensure all paperwork is submitted and confirmed. Don't assume it's handled — verify with compliance at both schools." },
        { text: "Timeline from commitment to enrollment", note: "After committing: complete admissions application, submit final transcripts, register for housing, select meal plan, register for classes, complete financial aid paperwork, schedule orientation. Create a timeline with deadlines for each step." },
      ]},
      { topic: "Academic Transition Planning", duration: "15 min", details: [
        { text: "Course registration at new school", note: "Athlete priority registration is common but not guaranteed — check with the new school. Meet with an academic advisor BEFORE registration to plan your course sequence. Avoid scheduling conflicts with team practice/travel." },
        { text: "Meeting with academic advisor", note: "Schedule this meeting during your campus visit or immediately after committing. Bring your transcript and credit evaluation. Get a written plan for graduation: which courses, which semesters, and an expected graduation date." },
        { text: "Ensuring credits are properly transferred", note: "Follow up on credit evaluation: which credits transferred, which didn't, and any courses that might need substitution approvals. Don't wait until the first day of classes to discover missing credits. Be proactive." },
        { text: "Graduation timeline at new institution", note: "Calculate the realistic graduation date. If it's been extended by a semester or more due to credit loss, factor that cost into the financial picture. Some athletes may consider summer school to get back on track." },
      ]},
      { topic: "Athletic & Social Transition", duration: "10 min", details: [
        { text: "Connecting with new teammates and coaches", note: "Start building relationships NOW, not when you arrive. Follow teammates on social media, join team group chats, participate in any summer activities. First impressions matter — be the eager, positive new teammate, not the entitled transfer." },
        { text: "Summer training expectations", note: "Ask the coach: 'What should my summer training look like?' Most programs provide summer workout plans. Follow them. Arriving in shape and prepared shows commitment and earns respect from teammates immediately." },
        { text: "Navigating being 'the transfer' — cultural integration", note: "Honest conversation: being a transfer can be socially challenging. You're joining an established team with existing dynamics. Be humble, work hard, avoid comparing your old school negatively, and let your play speak for itself. Integration takes 1-2 semesters typically." },
        { text: "Setting goals for your first season", note: "Set realistic goals: earn a lineup spot, achieve a specific scoring average, contribute to team success. Balance ambition with patience. Your first season at a new school is about establishing yourself, not dominating." },
      ]},
      { topic: "Program Wrap-Up & Celebration", duration: "5 min", details: [
        { text: "Review all progress and decisions made", note: "Walk through the journey: from the initial 'should I transfer?' conversation to a committed decision and transition plan. Highlight the work they put in — research, visits, negotiations, difficult conversations. This was not easy." },
        { text: "Ongoing CFA support availability", note: "Let them know CFA support doesn't end here. Check-in calls during their first semester, help with any issues that arise, and the Transfer Program is available again if they ever need it (though hopefully they won't!)." },
        { text: "Congratulations on your new chapter!", note: "Genuine celebration. This athlete had the courage to make a difficult change and did it the right way — with research, strategy, and support. Wish them well and express confidence in their decision. Ask for a testimonial if appropriate." },
      ]},
    ],
    deliverables: ["Final decision documented", "Transition checklist completed", "Academic plan at new school drafted"],
  },
];

// Helper to convert new DetailItem format to plain strings for PDF export
function toPlainAgendas(agendas: ModuleAgenda[], includeNotes: boolean): Array<{
  moduleNumber: number; title: string; totalDuration: string; objective: string;
  agenda: Array<{ topic: string; duration: string; details?: string[]; notes?: (string | undefined)[] }>;
  deliverables: string[]; pageNumber?: string;
}> {
  return agendas.map(m => ({
    ...m,
    agenda: m.agenda.map(a => ({
      ...a,
      details: a.details?.map(d => d.text),
      notes: includeNotes ? a.details?.map(d => d.note) : undefined,
    })),
  }));
}

export function ModuleAgenda() {
  const [showNotes, setShowNotes] = useState(true);

  const handleDownloadHS = () => {
    try {
      const doc = generateModuleAgendaPdf(toPlainAgendas(MODULE_AGENDAS, showNotes), 'High School Recruiting Program');
      doc.save(showNotes ? 'CFA-HS-Module-Agenda-With-Notes.pdf' : 'CFA-HS-Module-Agenda.pdf');
      toast({ title: 'Downloaded', description: `High School agenda PDF saved${showNotes ? ' with talking points' : ''}.` });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    }
  };

  const handleDownloadTransfer = () => {
    try {
      const doc = generateModuleAgendaPdf(toPlainAgendas(TRANSFER_MODULE_AGENDAS, showNotes), 'Transfer Student Program');
      doc.save(showNotes ? 'CFA-Transfer-Module-Agenda-With-Notes.pdf' : 'CFA-Transfer-Module-Agenda.pdf');
      toast({ title: 'Downloaded', description: `Transfer agenda PDF saved${showNotes ? ' with talking points' : ''}.` });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    }
  };

  const renderAgendaDetails = (details: DetailItem[]) => (
    <ul className="text-xs text-muted-foreground space-y-2">
      {details.map((d, i) => (
        <li key={i}>
          <div className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{d.text}</span>
          </div>
          {showNotes && d.note && (
            <div className="ml-5 mt-1 flex items-start gap-1.5 rounded bg-primary/5 border border-primary/10 px-2.5 py-1.5">
              <MessageCircle className="w-3 h-3 text-primary shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed text-primary/80 italic">{d.note}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const renderModules = (agendas: ModuleAgenda[], prefix: string) => (
    <Accordion type="single" collapsible className="space-y-4">
      {agendas.map((module) => (
        <AccordionItem key={module.moduleNumber} value={`${prefix}-${module.moduleNumber}`} className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3 text-left">
              <Badge variant="outline" className="shrink-0 font-mono">
                {prefix === 'module' ? (module.moduleNumber === 0 ? 'Intro' : `M${module.moduleNumber}`) : `T${module.moduleNumber}`}
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
                      {renderAgendaDetails(item.details)}
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
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>Consultant reference — session-by-session agendas for both programs</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Talking Points</span>
          <Switch checked={showNotes} onCheckedChange={setShowNotes} />
        </div>
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
        {renderModules(MODULE_AGENDAS, 'module')}
      </div>

      {/* Transfer Program */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary">6 Modules</Badge>
            Transfer Student Program
          </h3>
          <Button variant="outline" size="sm" onClick={handleDownloadTransfer} className="gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
        {renderModules(TRANSFER_MODULE_AGENDAS, 'transfer')}
      </div>
    </div>
  );
}
