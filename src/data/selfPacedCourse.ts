// Full self-paced course content for the Online Course ($299) program.
// 10 modules: Intro + 9 core modules. Each module contains:
//  - written lesson content (3–5 paragraphs, concise)
//  - key takeaways
//  - an action checklist
//  - downloadable worksheet PDFs (links into existing pdfTemplates generators
//    or the generic generateModuleWorksheetPDF for module-specific guides)

export interface ModuleWorksheet {
  id: string;
  title: string;
  description: string;
  // Either a generator key (matches pdfGenerators in src/lib/pdfTemplates.ts)
  // or "module-guide" to use the generic module worksheet PDF.
  generator:
    | 'target-schools'
    | 'video-specs'
    | 'tournament-log'
    | 'coach-tracker'
    | 'pre-call-prep'
    | 'campus-visit'
    | 'scholarship-calc'
    | 'timeline'
    | 'module-guide';
}

export interface SelfPacedModule {
  moduleNumber: number;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  estReadTime: string;
  // 3–5 paragraphs of plain text content.
  paragraphs: string[];
  takeaways: string[];
  checklist: string[];
  worksheets: ModuleWorksheet[];
}

export const SELF_PACED_MODULES: SelfPacedModule[] = [
  {
    moduleNumber: 0,
    slug: 'intro',
    title: 'Introduction: Welcome & Onboarding',
    shortTitle: 'Welcome',
    description: 'Set goals, understand the process, and orient yourself for the course.',
    estReadTime: '8 min',
    paragraphs: [
      "Welcome to College Fairway Advisors. This self-paced course is built to walk you through the exact same recruiting framework we use with our 1-on-1 consulting families — at your own pace, on your own schedule. Whether you're a sophomore just starting to think about college golf or a senior making final decisions, every module is designed to be self-contained, actionable, and printable.",
      "The recruiting process is not a single event — it is a 12-to-36-month campaign that combines academics, performance, video, communication, and decision-making. Most families lose ground because they treat it like a sprint or wait for coaches to find them. Our framework flips that by putting you in control: you build the list, you initiate the contact, you decide what 'fit' means, and you measure progress against benchmarks instead of guesswork.",
      "Here is how to use the course. Start with Module 1 and work through the modules in order — the early modules establish vocabulary and benchmarks you will reuse later. Each module has a written lesson, key takeaways, an action checklist, and downloadable PDF worksheets. Print the worksheets and physically fill them in; the act of writing forces clarity that scrolling does not.",
      "Before you move on, take ten minutes right now to set three goals: an academic goal (target GPA and test score), a performance goal (target scoring average), and a recruiting goal (target division or school list size). Write them down. You will revisit them in Module 8 when you build your 90-day action plan.",
    ],
    takeaways: [
      'This is a 12–36 month process — start now, even if you feel early.',
      'You drive the recruiting process; coaches respond to athletes who initiate.',
      'Print the worksheets. Writing creates accountability and clarity.',
      'Set three written goals before starting Module 1.',
    ],
    checklist: [
      'Bookmark the /self-paced page for quick access.',
      'Write down your academic, performance, and recruiting goals.',
      'Tell one parent/coach you have started the course (accountability).',
      'Block 30–45 minutes per week to work through one module.',
    ],
    worksheets: [
      {
        id: 'intro-goals',
        title: 'Goal-Setting & Course Roadmap',
        description: 'Worksheet to capture your three goals and weekly schedule.',
        generator: 'module-guide',
      },
    ],
  },
  {
    moduleNumber: 1,
    slug: 'landscape',
    title: 'College Golf Landscape & Recruiting Basics',
    shortTitle: 'Landscape',
    description: 'NCAA D1/D2/D3, NAIA, and JUCO — what they are, who they fit, and the timeline by division.',
    estReadTime: '12 min',
    paragraphs: [
      "College golf is not one path — it is at least five. NCAA Division I has the highest visibility, the deepest scholarship pools, and the most competitive recruiting cycles. NCAA Division II offers partial athletic scholarships and a slightly less rigid schedule. NCAA Division III cannot offer athletic scholarships but routinely combines academic merit aid with strong programs at academically elite schools. NAIA and NJCAA (JUCO) often go overlooked but offer faster pathways, more scholarship flexibility, and excellent stepping-stone routes for late bloomers or transfers.",
      "Fit is the most overused and least understood word in recruiting. A real fit is the intersection of four things: your scoring average vs. the team's roster average, your academic profile vs. the school's admitted-student profile, your financial situation vs. what the school can offer, and the human chemistry between you, the coach, and the team. If any one of those four breaks down, the offer either does not come or does not last. Use this lens every time you evaluate a school.",
      "The timeline shifts by division. D1 men's golf coaches begin meaningful contact June 15 after sophomore year (per current NCAA rules) and many top programs are filling classes 18–24 months before NLI. D2 and D3 timelines are looser but the strongest programs follow a similar curve. NAIA and JUCO can move quickly, sometimes recruiting players within months of enrollment. Knowing where you sit on this calendar prevents both panic and complacency.",
      "Most families make one of two mistakes: they aim only at D1 because of the prestige, or they avoid recruiting outreach because they think their game 'isn't ready.' Both are losing strategies. The right move is to build a balanced list — dream, target, and safety — across at least two divisions, and start communication early so coaches can watch you develop in real time.",
    ],
    takeaways: [
      'Five pathways exist: D1, D2, D3, NAIA, JUCO. Each has different scholarship and timeline rules.',
      "Fit = scoring + academics + finances + chemistry. All four must align.",
      'D1 contact opens June 15 after sophomore year; other divisions move on different clocks.',
      'Build a balanced list across at least two divisions before reaching out.',
    ],
    checklist: [
      'Identify which 2 divisions are most realistic for your scoring and academics.',
      'List 3 schools per category: Dream, Target, Safety (15 total).',
      'Note each school\'s division and current team scoring average.',
      'Mark on a calendar the recruiting milestones for your division.',
    ],
    worksheets: [
      {
        id: 'target-schools',
        title: 'Target School List Builder',
        description: '15-school worksheet split into Dream, Target, and Safety categories.',
        generator: 'target-schools',
      },
      {
        id: 'timeline',
        title: 'Recruiting Timeline Calendar',
        description: 'Year-by-year milestone calendar by division.',
        generator: 'timeline',
      },
    ],
  },
  {
    moduleNumber: 2,
    slug: 'academics',
    title: 'Academic Readiness & NCAA Compliance',
    shortTitle: 'Academics',
    description: 'NCAA Eligibility Center, core courses, GPA strategy, and SAT/ACT prep.',
    estReadTime: '11 min',
    paragraphs: [
      "Academic eligibility is the single most common reason offers get pulled. Coaches have very little patience for academic surprises late in the process — they are evaluating you as a student-athlete, in that order. Before any conversation about scoring averages, make sure your transcript can clear the NCAA Eligibility Center for D1 and D2 (D3, NAIA, and JUCO have their own academic standards).",
      "Register with the NCAA Eligibility Center at the end of sophomore year. The Eligibility Center requires 16 NCAA-approved 'core courses' across English, math, science, social science, and foreign language. Your high school's list of approved core courses is published on the NCAA portal — verify your schedule lines up. A class can look academic on a transcript and not count toward NCAA core, which is the kind of detail that derails recruits in the spring of senior year.",
      "GPA strategy matters more than most families realize. NCAA uses a specific 'core GPA' that only counts your 16 core classes, and it weights honors and AP differently than your school's GPA. The higher your core GPA, the lower your test-score requirement on the NCAA sliding scale. Honors and AP courses also signal academic seriousness to coaches at academically rigorous schools — exactly the schools that often have generous merit aid.",
      "Test prep is non-negotiable for most recruits. Plan to take the SAT or ACT at least twice — once spring of junior year and once fall of senior year. Use a structured prep plan (free options like Khan Academy work) and target a score that opens admission and merit aid at your top schools. Even at test-optional schools, a strong score is leverage for both admission and money.",
    ],
    takeaways: [
      'Register with the NCAA Eligibility Center after sophomore year.',
      '16 NCAA core courses required — verify each class counts.',
      'NCAA core GPA is calculated differently from your school GPA.',
      'Take SAT/ACT at least twice; aim for scores that unlock merit aid.',
    ],
    checklist: [
      'Create NCAA Eligibility Center account.',
      'Print your high school\'s NCAA list of approved core courses.',
      'Audit current schedule against NCAA core requirements.',
      'Schedule SAT or ACT test dates and a 6-week prep plan.',
    ],
    worksheets: [
      {
        id: 'eligibility',
        title: 'NCAA Eligibility Checklist',
        description: 'Step-by-step compliance and core-course tracker.',
        generator: 'module-guide',
      },
      {
        id: 'core-course',
        title: 'Core Course Tracker',
        description: 'Track your 16 NCAA core courses by category.',
        generator: 'module-guide',
      },
    ],
  },
  {
    moduleNumber: 3,
    slug: 'performance',
    title: 'Performance Metrics & Tournament Strategy',
    shortTitle: 'Performance',
    description: 'Scoring benchmarks by division, tournament selection, and stat tracking.',
    estReadTime: '12 min',
    paragraphs: [
      "Coaches recruit with numbers. Every program has a roster scoring average and a recruiting scoring average — the score they need a freshman to bring to keep that roster moving forward. As a rough benchmark: D1 men's programs typically recruit players averaging 73 or better in tournament rounds; D1 women's around 76 or better; D2 men's 75–77; D3 and NAIA 76–80; JUCO can recruit 80+ for development. These are guidelines, not rules, but they will tell you where your current game realistically opens conversations.",
      "Tournament schedule matters as much as score. Coaches weight competitive results from recognized junior events (AJGA, FCWT, Hurricane Junior, regional PGA Junior, state championships, USGA qualifiers) more heavily than informal events. Build a schedule with at least 6–10 multi-round tournaments per year against legitimate fields. One stroke against a strong field carries more recruiting weight than three strokes against weak fields.",
      "Track the right stats. Scoring average is the headline number, but coaches also want to see: rounds in the 70s, scoring differential vs. par, fairways hit, greens in regulation, putts per round, and up-and-down percentage. WAGR (World Amateur Golf Ranking) and Junior Golf Scoreboard rankings provide third-party validation that your numbers are real. Sign up for both as soon as you start posting recognized scores.",
      "Use a clear evaluation loop after each event. What did I do well? What broke down? What is the one thing to practice next week? Tournament results without honest reflection are just noise — recruits who improve fastest are the ones who turn every event into data and a plan.",
    ],
    takeaways: [
      'Know the scoring benchmark for your target division.',
      'Compete in 6–10 recognized multi-round tournaments per year.',
      'Track scoring average, rounds in the 70s, GIR, putts, and ranking.',
      'Sign up for WAGR and Junior Golf Scoreboard to validate results.',
    ],
    checklist: [
      'Calculate your last 10 tournament-round scoring average.',
      'Identify 3 recognized tournament series for next 6 months.',
      'Create accounts on WAGR and Junior Golf Scoreboard.',
      'Build a stat-tracking spreadsheet or use the Tournament Log PDF.',
    ],
    worksheets: [
      {
        id: 'tournament-log',
        title: 'Tournament Result Log',
        description: 'Multi-round score tracker with field size and finish.',
        generator: 'tournament-log',
      },
      {
        id: 'benchmarks',
        title: 'Scoring Benchmark Guide',
        description: 'Division-by-division scoring benchmarks and tournament tiers.',
        generator: 'module-guide',
      },
    ],
  },
  {
    moduleNumber: 4,
    slug: 'training',
    title: 'Training & Player Development',
    shortTitle: 'Training',
    description: 'Practice planning, skill development priorities, and fitness preparation.',
    estReadTime: '10 min',
    paragraphs: [
      "Practice is where ranking moves. Most juniors practice the parts of the game they enjoy and avoid the parts that scare them — which is exactly backwards from how college coaches build players. The single biggest separator between a 76 and a 73 is short game and putting from inside 100 yards. Spend at least 50% of practice time inside that range until you are statistically excellent there, then rebalance.",
      "Build a weekly practice plan instead of showing up and 'hitting balls.' A productive week looks something like: two short-game blocks, one putting block, one full-swing block, one on-course rounds-with-purpose block, and one fitness/recovery day. Each block should have one specific objective — for example, 'lag putting from 30–50 feet, 3 putts max in 50 attempts.' Aim, measure, adjust.",
      "Work with your teaching pro as a partner, not a fixer. Bring data from your tournaments and your stat tracker; let your coach prescribe drills against actual weaknesses rather than guessing. The recruits who get the most out of their swing coaches are the ones who arrive with specific questions — 'my misses are right when I'm tired on the back nine; can we look at fatigue patterns?' — instead of 'help me hit it better.'",
      "Don't ignore the body. College golf is 36-hole tournament days plus team workouts plus academics. Most freshmen who struggle physically were never fitness-prepared in high school. A simple program of mobility, rotational power, and aerobic conditioning two to three times a week — even bodyweight — pays off both in injury prevention and in late-round scoring.",
    ],
    takeaways: [
      'Spend 50%+ of practice on short game until statistically excellent.',
      'Use a weekly practice plan with measurable objectives, not "hit balls."',
      'Bring stats and questions to your swing coach.',
      'Add 2–3 fitness sessions weekly — golf is endurance plus power.',
    ],
    checklist: [
      'Build a weekly practice plan template.',
      'Identify your weakest stat from Module 3 and prescribe 2 drills.',
      'Schedule a stats-driven lesson with your teaching pro.',
      'Start a 2x/week mobility + strength routine.',
    ],
    worksheets: [
      {
        id: 'practice-plan',
        title: 'Weekly Practice Plan Template',
        description: 'Block-by-block weekly schedule with measurable objectives.',
        generator: 'module-guide',
      },
      {
        id: 'fitness',
        title: 'Fitness Assessment Checklist',
        description: 'Baseline mobility, strength, and conditioning assessment.',
        generator: 'module-guide',
      },
    ],
  },
  {
    moduleNumber: 5,
    slug: 'brand',
    title: 'Athlete Brand, Resume & Video Portfolio',
    shortTitle: 'Brand & Video',
    description: 'Building your recruiting profile, swing video, and online presence.',
    estReadTime: '11 min',
    paragraphs: [
      "Coaches make first-pass decisions on you in under five minutes — usually from an email plus a video. Your job is to make that five-minute window airtight. The package that wins is simple: a one-page recruiting profile (athletic resume), a 3–5 minute swing video, a recent transcript, and a tournament schedule. Every piece needs to be current, professional, and easy to share.",
      "Your athletic resume should fit on one page and answer the questions a coach asks first: graduation year, GPA and test score, scoring average, recent results, ranking, swing coach, key tournaments coming up, and contact info. Skip fluff. Lead with numbers. If a stat is weak, leave it off rather than dressing it up — coaches respect honesty and they will see through inflation.",
      "Your swing video should be filmed at a recognizable course or range, in good light, on a stable tripod. Required shots: driver face-on and down-the-line, mid-iron face-on and down-the-line, wedge, putting face-on and down-the-line, and 30–60 seconds of on-course play. Open with a 5-second intro slide (name, grad year, scoring average, contact). Keep total length under five minutes. Coaches have hundreds of videos to watch — make yours scannable.",
      "Online presence matters more than most recruits believe. Coaches will check your social accounts, sometimes within an hour of receiving your email. Keep public profiles clean: no profanity, no negative posts about teammates or coaches, no political fights. Build at least one positive recruiting-focused account where you post tournament results, practice clips, and academic milestones. It takes ten minutes a week and signals professionalism.",
    ],
    takeaways: [
      'One-page resume + 3–5 minute video = your recruiting first impression.',
      'Lead with numbers; skip anything weak rather than inflating it.',
      'Swing video specs: tripod, good light, required shots, intro slide.',
      'Audit and clean up public social accounts before reaching out.',
    ],
    checklist: [
      'Draft a one-page athletic resume (PDF).',
      'Record and edit a 3–5 minute swing video to spec.',
      'Audit and clean every public social media account.',
      'Upload your swing video to the CFA Swing Vault.',
    ],
    worksheets: [
      {
        id: 'video-specs',
        title: 'Swing Video Shot List & Specs',
        description: 'Checklist of required shots and technical specifications.',
        generator: 'video-specs',
      },
      {
        id: 'resume',
        title: 'Athlete Resume Template',
        description: 'One-page recruiting profile with all coach-required fields.',
        generator: 'module-guide',
      },
    ],
  },
  {
    moduleNumber: 6,
    slug: 'outreach',
    title: 'Coach Outreach & Networking',
    shortTitle: 'Outreach',
    description: 'Email templates, phone scripts, and campus visit preparation.',
    estReadTime: '13 min',
    paragraphs: [
      "Outreach is where most recruits stall. They draft a perfect email, send it to one school, hear nothing back, and conclude the process is broken. The truth is that effective outreach is a volume game with a personalization layer — you should plan to contact 25–50 schools across your dream/target/safety list, with each email customized enough that the coach knows you actually researched the program.",
      "A good first email has six parts: greeting using the coach's name, a one-line statement of who you are (grad year, school, scoring average), one specific reason you are interested in that program (recent result, current player you admire, academic program), your top two to three numbers, links to your video and resume, and a clear next step ('I will be at the [Tournament] on [Date] if you are able to watch'). Keep it under 200 words. Send from a real, professional email address — not a parent address.",
      "Follow-up is where the magic happens. Coaches receive hundreds of emails; most go unanswered the first time and that is normal, not rejection. Plan to send a follow-up two to three weeks after the first email with a fresh data point — a new tournament result, an updated test score, an upcoming event. After two follow-ups with no response, move that school down the list and reallocate effort.",
      "Phone calls and campus visits are where you become a real person to a coach. Prepare for each call: have the school's recent results, your own stats, and three questions ready (we provide a Pre-Call Question Prep PDF). On visits, take notes during the day and write down impressions that night while they are still fresh. Compare visits side by side instead of by feeling — the school you remember most fondly is often the most recent one, not the best fit.",
    ],
    takeaways: [
      'Plan to contact 25–50 schools — outreach is volume + personalization.',
      'Six-part first email; under 200 words; from a professional address.',
      'Follow up every 2–3 weeks with a fresh data point.',
      'Prepare for every call and write up every visit the same night.',
    ],
    checklist: [
      'Draft a personalized email template you can adapt per school.',
      'Send first round to your top 10 schools.',
      'Schedule follow-ups in your calendar (2 and 4 weeks out).',
      'Use the Pre-Call Prep PDF before any coach phone call.',
    ],
    worksheets: [
      {
        id: 'coach-tracker',
        title: 'Coach Contact Tracker',
        description: 'Log every coach interaction and follow-up date.',
        generator: 'coach-tracker',
      },
      {
        id: 'pre-call',
        title: 'Pre-Call Question Prep',
        description: 'Coach call preparation worksheet and follow-up checklist.',
        generator: 'pre-call-prep',
      },
      {
        id: 'campus-visit',
        title: 'Campus Visit Comparison',
        description: 'Side-by-side comparison sheet for up to 4 schools.',
        generator: 'campus-visit',
      },
    ],
  },
  {
    moduleNumber: 7,
    slug: 'offers',
    title: 'Financial Aid, Offers & Decisions',
    shortTitle: 'Offers',
    description: 'Understanding offers, comparing total cost, and decision frameworks.',
    estReadTime: '12 min',
    paragraphs: [
      "An offer is more than the athletic scholarship line. Real comparison is total cost of attendance minus everything you receive — athletic aid, academic merit aid, need-based aid, departmental scholarships, and any institutional grants. Two schools can have wildly different sticker prices and end up at the same net cost, or two schools with similar offers can have a $20,000-per-year gap once academic merit is layered in. Always compare net four-year cost.",
      "D1 men's golf has 4.5 athletic scholarships per team to spread across an entire roster — it is almost always partial. D1 women's has 6.0 (full-equivalent counts vary). D2 has fewer. D3 has none. NAIA has 5.0. JUCO varies. Knowing this in advance keeps expectations realistic and helps you read offers correctly. A 50% athletic offer at a strong academic school combined with a 40% merit scholarship is often a far better package than a 100% athletic offer at a school with no merit aid.",
      "Negotiation is appropriate and expected, within limits. If you have a competing offer or a recent improvement in scoring or test scores, share it professionally and ask the coach if there is room to revisit. Never bluff competing offers you do not have — coaches talk and your reputation in college golf is small. The right tone is collaborative: 'I love this program. Here is what I am working with from another school. Is there anything we can do to close the gap?'",
      "Build a written decision framework before any offer arrives. The factors that should drive the decision — academic fit, golf development trajectory, total cost, distance from home, coach relationship, team chemistry — should be weighted now, in a calm moment, not in the emotional pressure of an offer call. Score each finalist school against the same rubric and trust the rubric.",
    ],
    takeaways: [
      'Compare net four-year cost, not headline scholarship percentages.',
      'Athletic scholarships are almost always partial — know the equivalencies.',
      'Negotiate professionally and only with real competing data.',
      'Build a weighted decision rubric before offers arrive.',
    ],
    checklist: [
      'Calculate net cost for each top school using the Scholarship Calculator.',
      'Build a weighted decision rubric (academics, golf, cost, fit, coach).',
      'Prepare a polite negotiation email template.',
      'Identify your decision deadline and work backwards.',
    ],
    worksheets: [
      {
        id: 'scholarship-calc',
        title: 'Scholarship & Net Cost Calculator',
        description: 'Compare total cost of attendance across schools.',
        generator: 'scholarship-calc',
      },
      {
        id: 'decision',
        title: 'Decision Matrix Template',
        description: 'Weighted rubric for comparing finalist schools.',
        generator: 'module-guide',
      },
    ],
  },
  {
    moduleNumber: 8,
    slug: 'capstone',
    title: 'Capstone — Recruiting Portfolio & 90-Day Action Plan',
    shortTitle: 'Capstone',
    description: 'Final portfolio assembly, action roadmap, and commitment preparation.',
    estReadTime: '10 min',
    paragraphs: [
      "By Module 8 you should have all the raw materials of a complete recruiting portfolio: a target list, a resume, a video, tournament results, an academic plan, an outreach log, and a financial framework. The capstone is about packaging — turning those pieces into a single, sharable portfolio that you can send to any coach in under 60 seconds, and a 90-day action plan that keeps the next phase moving instead of stalling.",
      "Assemble your portfolio as a single PDF or a tightly organized cloud folder. Order: cover page (name, grad year, contact, headshot), one-page resume, transcript, tournament schedule and recent results, swing video link, references (swing coach and high school coach), and an academic interest statement. Update the portfolio every time a new tournament result or test score comes in — a stale portfolio is worse than no portfolio.",
      "Build a 90-day action plan with weekly checkpoints. Each week should have at least one outreach action (new emails or follow-ups), one performance metric to measure, one academic milestone, and one personal/recovery commitment. Write it on one page, post it where you see it daily. The recruits who commit successfully are not the ones with the best games — they are the ones who execute weekly checkpoints without missing.",
      "Prepare for the commitment moment in advance. Decide who you will tell first, in what order, and how. Write the verbal commitment script you will use on the phone with the coach. Plan your social announcement — most schools have specific timing rules around announcements. Treat this like the milestone it is, not an afterthought, and you will start your college career on a confident foot.",
    ],
    takeaways: [
      'Assemble a single shareable recruiting portfolio (PDF or folder).',
      'Build a one-page 90-day action plan with weekly checkpoints.',
      'Update portfolio after every new result or score.',
      'Plan the commitment moment — who, when, how — in advance.',
    ],
    checklist: [
      'Compile the recruiting portfolio into a single shareable file.',
      'Write a 90-day action plan with weekly checkpoints.',
      'Schedule monthly portfolio update reminders.',
      'Draft your verbal commitment script and announcement plan.',
    ],
    worksheets: [
      {
        id: 'portfolio',
        title: 'Portfolio Assembly Checklist',
        description: 'Order and contents of a complete recruiting portfolio.',
        generator: 'module-guide',
      },
      {
        id: 'action-plan',
        title: '90-Day Action Plan Template',
        description: 'Weekly checkpoint template across outreach, performance, academics.',
        generator: 'module-guide',
      },
    ],
  },
  {
    moduleNumber: 9,
    slug: 'conclusion',
    title: 'Conclusion: Get Ready For College Golf',
    shortTitle: 'Conclusion',
    description: 'Transitioning from recruit to college student-athlete.',
    estReadTime: '8 min',
    paragraphs: [
      "Committing is the start of a new phase, not the end of the process. The summer between high school and college is when you build the physical and mental foundation that decides whether you redshirt or compete as a freshman. Most freshmen who play their first fall arrived already in tournament shape, with a real fitness baseline and a clear practice routine. The recruits who struggle most in fall are the ones who stopped competing and training in May.",
      "Plan a structured summer: keep playing tournaments through July, follow a fitness program your future strength coach signs off on (most college coaches will share one), and build a calendar for moving to campus. Make a checklist of equipment, paperwork, NCAA compliance forms, and academic registration deadlines. Communicate weekly with your future coach so you arrive on day one as a known quantity, not a stranger.",
      "Time management is the single biggest skill freshmen lack. College adds two-a-day workouts, travel for competition, missed class days, and a dramatically harder academic load. Build the habit now: weekly planning every Sunday, daily priority list every morning, protected sleep and recovery. The freshmen who thrive are not the most talented — they are the most consistent.",
      "Stay connected to College Fairway Advisors after you commit. Recruiting alumni often come back for transfer questions, NIL questions, or advice for younger siblings. The relationship does not end at signing. We are here for the whole journey — congratulations on completing the course, and welcome to the start of the next chapter.",
    ],
    takeaways: [
      'The summer before college decides your freshman fall.',
      'Keep competing through July; follow a coach-approved fitness plan.',
      'Time management is the #1 freshman skill — build the habit now.',
      'Stay connected to CFA — the relationship continues post-commitment.',
    ],
    checklist: [
      'Build a summer tournament + fitness + travel calendar.',
      'Get a strength program from your future coach and start it.',
      'Set up a weekly Sunday planning routine.',
      'Bookmark CFA Coaching Workspace for ongoing questions.',
    ],
    worksheets: [
      {
        id: 'transition',
        title: 'College Transition Guide',
        description: 'Summer-to-fall checklist covering academics, golf, and life skills.',
        generator: 'module-guide',
      },
    ],
  },
];

export const getModuleBySlug = (slug: string): SelfPacedModule | undefined =>
  SELF_PACED_MODULES.find((m) => m.slug === slug);
