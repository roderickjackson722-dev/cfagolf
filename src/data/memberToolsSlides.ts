// Edit slide content here. Replace `image` URLs with real screenshots when ready.
export interface MemberToolsSlide {
  index: number;
  title: string;
  bullets: string[];
  image: string; // public URL or placeholder
  videoEmbed?: string; // optional iframe src
}

const ph = (label: string) =>
  `https://placehold.co/1200x800/0f172a/e2e8f0?text=${encodeURIComponent(label)}`;

export const memberToolsSlides: MemberToolsSlide[] = [
  {
    index: 1,
    title: "Welcome — What You'll See Inside CFA",
    bullets: [
      "A guided tour of every member tool",
      "Built specifically for college golf recruits",
      "Replaces $2,000+ recruiting services",
    ],
    image: ph("Welcome to CFA"),
  },
  {
    index: 2,
    title: "Your Player Dashboard",
    bullets: [
      "Single home base for everything recruiting",
      "Progress tracking across all 12 modules",
      "Quick links to every tool",
    ],
    image: ph("Player Dashboard"),
  },
  {
    index: 3,
    title: "Recruiting Timeline Calendar",
    bullets: [
      "Interactive milestones by graduation year",
      "Reminders for NCAA deadlines",
      "Personalized to your year and division",
    ],
    image: ph("Recruiting Timeline"),
  },
  {
    index: 4,
    title: "College Database — Search & Filter",
    bullets: [
      "Filter by division, state, scholarships, GPA, and ranking",
      "D1 through JUCO coverage",
      "Real-time search with autocomplete",
    ],
    image: ph("College Database"),
  },
  {
    index: 5,
    title: "School Profile Page",
    bullets: [
      "Verified roster scoring averages",
      "Cost, scholarships, and academic data",
      "Direct links to official athletics sites",
    ],
    image: ph("School Profile"),
  },
  {
    index: 6,
    title: "Coach Tracker — Log Communications",
    bullets: [
      "Track every email, call, and visit",
      "Follow-up reminders so nothing slips",
      "Status pipeline from initial → committed",
    ],
    image: ph("Coach Tracker"),
  },
  {
    index: 7,
    title: "Scholarship Calculator",
    bullets: [
      "Estimate net cost across multiple offers",
      "Side-by-side comparison view",
      "Athletic + academic + need-based aid",
    ],
    image: ph("Scholarship Calculator"),
  },
  {
    index: 8,
    title: "Swing Video Vault",
    bullets: [
      "Upload swing and tournament clips",
      "Share single link with coaches",
      "Organize by date and category",
    ],
    image: ph("Swing Video Vault"),
  },
  {
    index: 9,
    title: "Academic Eligibility Tracker",
    bullets: [
      "Track NCAA core course requirements",
      "GPA and test score monitoring",
      "Eligibility checklist with status",
    ],
    image: ph("Academic Eligibility"),
  },
  {
    index: 10,
    title: "Email Templates & Coach Outreach",
    bullets: [
      "Pre-written templates for every stage",
      "Personalize with merge fields",
      "Sent and response tracking",
    ],
    image: ph("Email Templates"),
  },
  {
    index: 11,
    title: "Program Fit Questionnaire",
    bullets: [
      "Match preferences to program style",
      "Academic, athletic, and culture fit",
      "Generates a target list automatically",
    ],
    image: ph("Program Fit Questionnaire"),
  },
  {
    index: 12,
    title: "Goal Setting & Progress Tracking",
    bullets: [
      "Set short and long-term recruiting goals",
      "Visualize progress across modules",
      "Coach-reviewed weekly",
    ],
    image: ph("Goal Setting"),
  },
  {
    index: 13,
    title: "Tournament Schedule & Results Log",
    bullets: [
      "Plan your WAGR-counting events",
      "Multi-round scoring with finish position",
      "Aggregate stats coaches can verify",
    ],
    image: ph("Tournament Log"),
  },
  {
    index: 14,
    title: "Document Vault",
    bullets: [
      "Transcripts, resumes, and release forms",
      "Secure, private, share-when-ready",
      "One source of truth",
    ],
    image: ph("Document Vault"),
  },
  {
    index: 15,
    title: "Messaging Center",
    bullets: [
      "Contact college coaches directly",
      "Threaded inbox per program",
      "Notifications when coaches respond",
    ],
    image: ph("Messaging Center"),
  },
  {
    index: 16,
    title: "View Count Analytics",
    bullets: [
      "See which coaches viewed your profile",
      "Identify warm leads to follow up",
      "Daily and weekly trends",
    ],
    image: ph("View Analytics"),
  },
  {
    index: 17,
    title: "Mobile-Friendly Access",
    bullets: [
      "Full platform works on your phone",
      "Log a coach call from the range",
      "No app install required",
    ],
    image: ph("Mobile Preview"),
  },
  {
    index: 18,
    title: "Success Stories & Testimonials",
    bullets: [
      "Real CFA members committed to D1, D2, NAIA",
      "Hear what families say",
      "Outcomes, not promises",
    ],
    image: ph("Success Stories"),
  },
  {
    index: 19,
    title: "Next Steps — How to Enroll",
    bullets: [
      "Choose Portal ($299, was $499) or Consulting ($2,499, was $3,499)",
      "Klarna available on Consulting",
      "Start onboarding the same day",
    ],
    image: ph("Enroll Today"),
  },
  {
    index: 20,
    title: "Q&A / Contact",
    bullets: [
      "contact@cfa.golf",
      "www.cfa.golf",
      "Book a free 15-minute call",
    ],
    image: ph("Questions? Contact CFA"),
  },
];
