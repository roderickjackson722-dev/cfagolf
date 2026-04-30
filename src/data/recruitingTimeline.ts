export interface TimelineTask {
  id: string;
  text: string;
}

export interface TimelineSeason {
  season: string;
  tasks: TimelineTask[];
}

export interface TimelineYear {
  id: string;
  year: string;
  grade: string;
  color: string; // tailwind classes
  emoji: string;
  goal: string;
  seasons: TimelineSeason[];
  checklist: TimelineTask[];
  proTip: string;
}

const mk = (prefix: string, items: string[]): TimelineTask[] =>
  items.map((text, i) => ({ id: `${prefix}-${i}`, text }));

export const RECRUITING_TIMELINE: TimelineYear[] = [
  {
    id: 'freshman',
    year: 'Freshman Year',
    grade: '9th Grade',
    emoji: '🟢',
    color: 'bg-emerald-500',
    goal: 'Build the Foundation — Develop skills, establish academic habits, and start learning about the recruiting process without pressure.',
    seasons: [
      {
        season: 'Fall',
        tasks: mk('fr-fall', [
          'Stay focused on academics — GPA matters now more than ever',
          'Join a local junior golf tour or play in 2–3 regional events',
          'Create a simple log of tournament scores',
          'Start watching college golf online to learn what level interests you',
        ]),
      },
      {
        season: 'Winter',
        tasks: mk('fr-win', [
          'Work with a coach on swing fundamentals',
          'Research 10–15 colleges that have your intended major (don\'t worry about golf yet)',
          'Set up a free recruiting profile on a junior golf platform',
        ]),
      },
      {
        season: 'Spring',
        tasks: mk('fr-spr', [
          'Play high school golf (if available)',
          'Add tournament results to your profile',
          'Build a basic athletic resume (name, GPA, tournament finishes, coach contact info)',
        ]),
      },
      {
        season: 'Summer',
        tasks: mk('fr-sum', [
          'Play in 3–4 junior events (local or regional)',
          'Take an unofficial campus tour of a nearby college',
          'Keep practicing — summer is for getting better, not stressing over recruiting',
        ]),
      },
    ],
    checklist: mk('fr-chk', [
      'Maintain a 3.0+ GPA',
      'Play 6–8 tournaments total',
      'Create an athletic resume',
      'Research 10–15 colleges academically',
      'Start a tournament results log',
    ]),
    proTip: 'Focus on fun and fundamentals. Don\'t stress recruiting yet.',
  },
  {
    id: 'sophomore',
    year: 'Sophomore Year',
    grade: '10th Grade',
    emoji: '🟡',
    color: 'bg-yellow-500',
    goal: 'Get on the Radar — Build measurable performance data and begin understanding where you might fit.',
    seasons: [
      {
        season: 'Fall',
        tasks: mk('so-fall', [
          'Play in tournaments that publish results online (e.g., Junior Golf Scoreboard)',
          'Update your athletic resume with scores',
          'Register with the NCAA Eligibility Center (free account)',
        ]),
      },
      {
        season: 'Winter',
        tasks: mk('so-win', [
          'Take the PSAT (good practice for SAT/ACT)',
          'Review core course requirements for NCAA eligibility',
          'Meet with your high school counselor to confirm you\'re on track',
        ]),
      },
      {
        season: 'Spring',
        tasks: mk('so-spr', [
          'Play high school golf',
          'Start tracking your scoring average (18-hole)',
          'Research divisions (D1, D2, D3, NAIA, JUCO) and note which fit your scores',
        ]),
      },
      {
        season: 'Summer',
        tasks: mk('so-sum', [
          'Compete in 4–5 events, including at least one multi-day tournament',
          'Build a list of 20–30 target schools (academic + athletic interest)',
          'Record a simple swing video (driver, iron, wedge, putter — 30 seconds total)',
        ]),
      },
    ],
    checklist: mk('so-chk', [
      'Maintain 3.0+ GPA (higher for selective schools)',
      'Play 8–10 tournaments',
      'Know your scoring average',
      'Register with NCAA Eligibility Center',
      'Build target school list (20–30 schools)',
      'Create a basic swing video',
    ]),
    proTip: 'Start learning the process. Build habits, not pressure.',
  },
  {
    id: 'junior',
    year: 'Junior Year',
    grade: '11th Grade',
    emoji: '🟠',
    color: 'bg-orange-500',
    goal: 'The Most Important Year — Actively communicate with coaches, narrow your list, and showcase your game.',
    seasons: [
      {
        season: 'Fall',
        tasks: mk('jr-fall', [
          'Send introductory emails to coaches at your target schools (include resume, schedule, swing video link)',
          'Play fall tournaments — update coaches with results',
          'Begin official or unofficial campus visits',
        ]),
      },
      {
        season: 'Winter',
        tasks: mk('jr-win', [
          'Take SAT/ACT (aim for scores that meet NCAA and school requirements)',
          'Update your athletic resume with junior year grades and recent finishes',
          'Upload your swing video to a recruiting platform or personal website',
        ]),
      },
      {
        season: 'Spring',
        tasks: mk('jr-spr', [
          'Play high school golf and update coaches with results',
          'Narrow your target list to 15–20 realistic schools',
          'Respond promptly to any coach inquiries',
          'Complete the NCAA Eligibility Center registration (pay the fee)',
        ]),
      },
      {
        season: 'Summer',
        tasks: mk('jr-sum', [
          'Play in high-visibility tournaments (AJGA, HJGT, state events)',
          'Send summer tournament schedule to coaches',
          'Take official visits (if offered)',
          'Update coaches every 2–3 weeks with results',
        ]),
      },
    ],
    checklist: mk('jr-chk', [
      'Maintain or improve GPA',
      'Take SAT/ACT (send scores using NCAA code 9999)',
      'Send intro emails to 20–30 coaches',
      'Complete NCAA Eligibility Center registration',
      'Narrow target list to 15–20 schools',
      'Take campus visits (2–5 schools)',
      'Update coaches regularly',
    ]),
    proTip: 'Be proactive. Coaches are watching — update them regularly.',
  },
  {
    id: 'senior',
    year: 'Senior Year',
    grade: '12th Grade',
    emoji: '🔴',
    color: 'bg-red-500',
    goal: 'Seal the Deal — Finalize your choice, sign, and prepare for college golf.',
    seasons: [
      {
        season: 'August – October',
        tasks: mk('sr-fall', [
          'Send updated tournament results and academic information to coaches',
          'Take official visits (if not already done)',
          'Receive and compare offers (athletic + academic scholarships)',
          'Narrow list to 3–5 final schools',
        ]),
      },
      {
        season: 'November – February',
        tasks: mk('sr-win', [
          'Early Signing Period (November) — Sign National Letter of Intent if you have a firm offer',
          'If not signed, continue communicating with coaches',
          'Complete all college applications',
          'Request final transcripts to be sent to schools and NCAA',
        ]),
      },
      {
        season: 'March – July',
        tasks: mk('sr-spr', [
          'Regular Signing Period (April – August) — Sign NLI or athletic aid agreement',
          'Announce your commitment (with coach\'s permission)',
          'Complete FAFSA and any financial aid forms',
          'Connect with future teammates',
          'Prepare for college golf (fitness, practice plan, course management)',
        ]),
      },
    ],
    checklist: mk('sr-chk', [
      'Final transcripts sent to NCAA and college',
      'Sign National Letter of Intent or athletic aid agreement',
      'Complete college application & financial aid',
      'Announce commitment',
      'Prepare for college golf (mentally and physically)',
    ]),
    proTip: 'Stay patient. The right fit will appear if you\'ve done the work.',
  },
];

export interface CriticalDate {
  date: string;
  event: string;
  division: string;
}

export const CRITICAL_DATES: CriticalDate[] = [
  { date: 'Any time', event: 'Unofficial visits allowed', division: 'All divisions' },
  { date: 'June 15 after sophomore year', event: 'Coaches can begin direct contact (calls, texts, emails)', division: 'D1, D2' },
  { date: 'August 1 before junior year', event: 'Official visits begin (paid 48-hour visits)', division: 'D1, D2' },
  { date: 'January 1 of junior year', event: 'Official visits begin', division: 'D3' },
  { date: 'November (senior year)', event: 'Early Signing Period', division: 'D1, D2' },
  { date: 'April – August (senior year)', event: 'Regular Signing Period', division: 'All divisions' },
];
