export interface PresentationSlide {
  index: number;
  startSec: number;
  endSec: number;
  timeLabel: string;
  title: string;
  showOnScreen: string;
  speakerNotes: string[];
  shortcutUrl?: string;
  shortcutLabel?: string;
}

export const TOTAL_DURATION_SEC = 15 * 60;

export const presentationSlides: PresentationSlide[] = [
  {
    index: 0,
    startSec: 0,
    endSec: 120,
    timeLabel: "0:00 – 2:00",
    title: "Warm Welcome & Rapport",
    showOnScreen: "Camera only",
    speakerNotes: [
      "Greet the family by name with energy and a smile",
      "Quick intro: who you are and your background in golf recruiting",
      "Confirm who's on the call (player, parents, etc.)",
      "Set expectations: '15 minutes to learn about your goals and show you how we help'",
    ],
  },
  {
    index: 1,
    startSec: 120,
    endSec: 300,
    timeLabel: "2:00 – 5:00",
    title: "Discovery – Gather Info",
    showOnScreen: "Camera only",
    speakerNotes: [
      "Current grade / graduation year",
      "Handicap index and recent tournament scores",
      "GPA, test scores (if taken), academic interests",
      "Target schools / dream divisions (D1, D2, D3, NAIA, JUCO)",
      "What's their biggest recruiting challenge right now?",
    ],
  },
  {
    index: 2,
    startSec: 300,
    endSec: 420,
    timeLabel: "5:00 – 7:00",
    title: "Three Service Tiers",
    showOnScreen: "Share /pricing page",
    speakerNotes: [
      "Free: limited college database preview",
      "Self-Paced Online Course ($299, was $499 — one-time): full curriculum + Client Portal access — database, coach tracker, scholarship calc, etc.",
      "Consulting ($2,499, was $3,499 — one-time): everything + 1-on-1 strategy with Rod, 12-module HS or 6-module Transfer program",
      "Anchor against $2,000+/year competitors charging recurring fees",
    ],
    shortcutUrl: "/pricing",
    shortcutLabel: "Open Pricing Page",
  },
  {
    index: 3,
    startSec: 420,
    endSec: 450,
    timeLabel: "7:00 – 7:30",
    title: "College Database Demo",
    showOnScreen: "Live demo of college search tool",
    speakerNotes: [
      "'This is how families research schools without spending hours Googling'",
      "Show search, filters (division, state, gender, HBCU)",
      "Click into a school card to show verified stats",
    ],
    shortcutUrl: "/database",
    shortcutLabel: "Open College Database",
  },
  {
    index: 4,
    startSec: 450,
    endSec: 480,
    timeLabel: "7:30 – 8:00",
    title: "Coach Tracker / Scholarship Calc",
    showOnScreen: "15-sec peek of tools",
    speakerNotes: [
      "Coach Tracker: log every coach contact, last touch date, follow-ups",
      "Scholarship Calculator: net cost after aid, side-by-side comparisons",
      "Mention these are inside the Client Portal",
    ],
    shortcutUrl: "/tools/coach-tracker",
    shortcutLabel: "Open Coach Tracker",
  },
  {
    index: 5,
    startSec: 480,
    endSec: 540,
    timeLabel: "8:00 – 9:00",
    title: "Differentiators & Success Story",
    showOnScreen: "Camera only (or flash testimonial)",
    speakerNotes: [
      "Strong HBCU coach network — unique to CFA",
      "Founder Rod Jackson: actual recruiting expertise, not a software company",
      "One-time pricing vs competitors' recurring fees",
      "Share a quick D1 commitment success story",
    ],
    shortcutUrl: "/about",
    shortcutLabel: "Open About / Testimonials",
  },
  {
    index: 6,
    startSec: 540,
    endSec: 660,
    timeLabel: "9:00 – 11:00",
    title: "Address Objections",
    showOnScreen: "Camera only",
    speakerNotes: [
      "'It's expensive' → compare to one bad recruiting decision or 1 yr competitor sub",
      "'Need to think about it' → what specifically? Address it now",
      "'My swing coach is helping' → swing coaches build the game, CFA builds the path",
      "'We have time' → recruiting starts earlier than most parents realize",
    ],
  },
  {
    index: 7,
    startSec: 660,
    endSec: 780,
    timeLabel: "11:00 – 13:00",
    title: "Present Next Step",
    showOnScreen: "Share Calendly link",
    speakerNotes: [
      "Offer a paid onboarding / strategy session as the natural next step",
      "Walk them to your calendar live",
      "Pick a time together — don't leave it open-ended",
    ],
    shortcutUrl: "https://calendly.com/",
    shortcutLabel: "Open Calendar",
  },
  {
    index: 8,
    startSec: 780,
    endSec: 900,
    timeLabel: "13:00 – 15:00",
    title: "Confirm Action & Close",
    showOnScreen: "Camera only",
    speakerNotes: [
      "Confirm the booked time and what they'll receive",
      "Tell them you'll send a recap email + checkout link to contact@cfa.golf",
      "Thank them by name, reinforce excitement about working together",
      "End on a high note",
    ],
  },
];
