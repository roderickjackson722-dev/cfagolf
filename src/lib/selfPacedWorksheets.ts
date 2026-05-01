// Maps every "module-guide" worksheet ID in src/data/selfPacedCourse.ts to
// concrete PDF content for the generic generateModuleWorksheetPDF generator.

import { generateModuleWorksheetPDF, pdfGenerators } from '@/lib/pdfTemplates';
import { SELF_PACED_MODULES, type ModuleWorksheet, type SelfPacedModule } from '@/data/selfPacedCourse';

interface GuideContent {
  intro: string;
  sections: Array<{ heading: string; lines: string[] }>;
  filename: string;
}

const GUIDES: Record<string, GuideContent> = {
  'intro-goals': {
    intro:
      'Use this worksheet to lock in three written goals and a weekly schedule before you begin Module 1. Print it and keep it visible.',
    filename: 'CFA_M0_Goals_Roadmap.pdf',
    sections: [
      {
        heading: 'Three Goals',
        lines: ['Academic goal (target GPA & test score):', 'Performance goal (target scoring average):', 'Recruiting goal (division/school list size):'],
      },
      {
        heading: 'Weekly Schedule',
        lines: ['Day & time blocked for course work:', 'Accountability partner (parent/coach):', 'Date you will start Module 1:'],
      },
      {
        heading: 'Course Roadmap Checklist',
        lines: [
          'Read each module top to bottom before downloading worksheets.',
          'Print every worksheet and fill it in by hand.',
          'Re-read your three goals every Sunday.',
          'Move at one module per week minimum.',
        ],
      },
    ],
  },
  'eligibility': {
    intro:
      'Step-by-step NCAA Eligibility checklist. Complete each section by the end of sophomore year (D1/D2). Keep this sheet updated through senior year.',
    filename: 'CFA_M2_Eligibility_Checklist.pdf',
    sections: [
      {
        heading: 'Account & Registration',
        lines: [
          'Created NCAA Eligibility Center account.',
          'Submitted official high school transcript.',
          'Linked SAT/ACT scores to NCAA Eligibility Center.',
        ],
      },
      {
        heading: 'Core Course Audit',
        lines: [
          'Verified all current classes appear on high school NCAA list of approved core courses.',
          'Confirmed schedule covers all 16 core courses by graduation.',
          'Identified any low grades that may need a retake.',
        ],
      },
      {
        heading: 'Testing',
        lines: [
          'Registered for SAT or ACT (date 1):',
          'Registered for SAT or ACT (date 2):',
          'Started a structured test-prep plan (Khan Academy or paid).',
        ],
      },
    ],
  },
  'core-course': {
    intro:
      'Track each of your 16 NCAA core courses by category. Bring this to every counselor meeting.',
    filename: 'CFA_M2_Core_Course_Tracker.pdf',
    sections: [
      { heading: 'English (4 required)', lines: ['Course 1 / Year / Grade:', 'Course 2 / Year / Grade:', 'Course 3 / Year / Grade:', 'Course 4 / Year / Grade:'] },
      { heading: 'Math (3 required, Algebra I or higher)', lines: ['Course 1 / Year / Grade:', 'Course 2 / Year / Grade:', 'Course 3 / Year / Grade:'] },
      { heading: 'Natural / Physical Science (2 required)', lines: ['Course 1 / Year / Grade:', 'Course 2 / Year / Grade:'] },
      { heading: 'Social Science (2 required)', lines: ['Course 1 / Year / Grade:', 'Course 2 / Year / Grade:'] },
      { heading: 'Additional English / Math / Science (1 required)', lines: ['Course / Year / Grade:'] },
      { heading: 'Foreign Language / Comparative Religion / Philosophy (4 required)', lines: ['Course 1 / Year / Grade:', 'Course 2 / Year / Grade:', 'Course 3 / Year / Grade:', 'Course 4 / Year / Grade:'] },
    ],
  },
  'benchmarks': {
    intro:
      'Use these benchmarks as guidelines, not rules. Track your last 10 tournament rounds and compare against your target divisions.',
    filename: 'CFA_M3_Scoring_Benchmarks.pdf',
    sections: [
      {
        heading: "Men's Scoring Benchmarks (Tournament Rounds)",
        lines: [
          'D1: 73 or better average',
          'D2: 75–77 average',
          'D3 / NAIA: 76–80 average',
          'JUCO: 80+ (development pathway)',
        ],
      },
      {
        heading: "Women's Scoring Benchmarks (Tournament Rounds)",
        lines: [
          'D1: 76 or better average',
          'D2: 78–80 average',
          'D3 / NAIA: 80–84 average',
          'JUCO: 84+ (development pathway)',
        ],
      },
      {
        heading: 'Recognized Tournament Tiers',
        lines: [
          'Tier 1: AJGA Invitationals, USGA qualifiers, state championships.',
          'Tier 2: AJGA Open, FCWT majors, regional PGA Junior, Hurricane Junior majors.',
          'Tier 3: Local tour events, junior club championships.',
        ],
      },
      {
        heading: 'Your Numbers',
        lines: ['Last 10 tournament rounds — scoring average:', 'WAGR ranking (if applicable):', 'Junior Golf Scoreboard ranking:'],
      },
    ],
  },
  'practice-plan': {
    intro:
      'Build a productive week with measurable objectives, not "hit balls." Print one per week and grade yourself each Sunday.',
    filename: 'CFA_M4_Practice_Plan.pdf',
    sections: [
      {
        heading: 'Weekly Blocks',
        lines: [
          'Short Game Block 1 (objective + duration):',
          'Short Game Block 2 (objective + duration):',
          'Putting Block (objective + duration):',
          'Full Swing Block (objective + duration):',
          'On-Course Round With Purpose (objective):',
          'Fitness / Recovery Day:',
        ],
      },
      {
        heading: 'Sunday Self-Review',
        lines: [
          'Did I hit each block this week?',
          'What measurable improvement did I see?',
          'What is the #1 weakness to work on next week?',
        ],
      },
    ],
  },
  'fitness': {
    intro:
      'Baseline mobility, strength, and conditioning assessment. Re-test every 8 weeks and bring results to your future college coach.',
    filename: 'CFA_M4_Fitness_Assessment.pdf',
    sections: [
      {
        heading: 'Mobility',
        lines: [
          'Toe-touch (forward fold) — pass / fail:',
          'Shoulder mobility (hand behind back, both sides) — pass / fail:',
          'Trunk rotation seated (each side, degrees):',
        ],
      },
      {
        heading: 'Strength',
        lines: [
          'Bodyweight squats — reps in 60s:',
          'Push-ups — strict reps:',
          'Plank hold — seconds:',
          'Glute bridge hold — seconds:',
        ],
      },
      {
        heading: 'Conditioning & Power',
        lines: [
          'Mile run / 1.5-mile run — time:',
          'Vertical jump — inches:',
          'Medicine-ball rotational throw — feet (both sides):',
        ],
      },
    ],
  },
  'resume': {
    intro:
      'Fill in every field. Then transcribe to a one-page Word/Google Doc and export as PDF for outreach. Keep numbers updated monthly.',
    filename: 'CFA_M5_Athlete_Resume.pdf',
    sections: [
      {
        heading: 'Header',
        lines: ['Full name:', 'Graduation year:', 'Email (professional address):', 'Phone:', 'High school + city/state:'],
      },
      {
        heading: 'Academics',
        lines: ['Unweighted GPA:', 'Core GPA (NCAA):', 'SAT score:', 'ACT score:', 'Intended major(s):'],
      },
      {
        heading: 'Golf Performance',
        lines: [
          'Tournament scoring average (last 10 rounds):',
          'Best 18-hole tournament round:',
          'Rounds in the 70s (or 80s for women, divisional):',
          'Junior Golf Scoreboard ranking:',
          'WAGR ranking:',
        ],
      },
      {
        heading: 'Schedule & References',
        lines: [
          'Top 3 upcoming tournaments + dates:',
          'Swing coach name + contact:',
          'High school coach name + contact:',
          'Swing video link:',
        ],
      },
    ],
  },
  'decision': {
    intro:
      'Build your weighted rubric BEFORE offers come in. Score each finalist school and trust the rubric, not the most recent campus visit.',
    filename: 'CFA_M7_Decision_Matrix.pdf',
    sections: [
      {
        heading: 'Weighted Factors (1–10 importance)',
        lines: [
          'Academic fit / major:',
          'Golf development trajectory:',
          'Total four-year net cost:',
          'Distance from home:',
          'Coach relationship:',
          'Team chemistry:',
        ],
      },
      {
        heading: 'Score Each School (1–10 per factor)',
        lines: [
          'School 1 — name and totals:',
          'School 2 — name and totals:',
          'School 3 — name and totals:',
          'School 4 — name and totals:',
        ],
      },
      {
        heading: 'Decision Timeline',
        lines: [
          'Date offers expected:',
          'Internal decision deadline:',
          'Verbal commitment date:',
          'NLI / official signing date:',
        ],
      },
    ],
  },
  'portfolio': {
    intro:
      'Use this checklist to assemble your final recruiting portfolio. Save as one PDF or one tightly organized cloud folder.',
    filename: 'CFA_M8_Portfolio_Checklist.pdf',
    sections: [
      {
        heading: 'Required Pieces',
        lines: [
          'Cover page (name, grad year, contact, headshot).',
          'One-page athletic resume (PDF).',
          'Most recent transcript.',
          'Tournament schedule (next 6 months) + recent results.',
          'Swing video link (3–5 minutes, current).',
          'References (swing coach + high school coach).',
          'Academic interest statement (1 paragraph).',
        ],
      },
      {
        heading: 'Maintenance Plan',
        lines: [
          'Update after every tournament result.',
          'Update after every new test score.',
          'Re-record swing video every 6 months.',
          'Audit social media before any new outreach round.',
        ],
      },
    ],
  },
  'action-plan': {
    intro:
      'A 90-day action plan with weekly checkpoints across outreach, performance, academics, and personal commitments.',
    filename: 'CFA_M8_90_Day_Action_Plan.pdf',
    sections: [
      {
        heading: 'Weeks 1–4 — Foundation',
        lines: [
          'Outreach: number of new emails this block:',
          'Performance: scoring goal this block:',
          'Academics: milestone this block:',
          'Personal: recovery / fitness commitment:',
        ],
      },
      {
        heading: 'Weeks 5–8 — Acceleration',
        lines: [
          'Outreach: follow-up count + new contacts:',
          'Performance: scoring goal this block:',
          'Academics: milestone this block:',
          'Personal: recovery / fitness commitment:',
        ],
      },
      {
        heading: 'Weeks 9–12 — Decision Window',
        lines: [
          'Outreach: campus visits scheduled:',
          'Performance: scoring goal this block:',
          'Academics: milestone this block:',
          'Personal: recovery / fitness commitment:',
        ],
      },
    ],
  },
  'transition': {
    intro:
      'Summer-to-fall transition checklist. Most freshmen who play their first fall arrived already in tournament shape — use this to be one of them.',
    filename: 'CFA_M9_College_Transition_Guide.pdf',
    sections: [
      {
        heading: 'Summer Golf',
        lines: [
          'Tournament schedule through July:',
          'Strength program from future coach started:',
          'Stat tracking system in place for summer:',
          'Equipment list verified (clubs, bag, rangefinder):',
        ],
      },
      {
        heading: 'Academic & Logistical',
        lines: [
          'Course registration completed:',
          'Housing / move-in date confirmed:',
          'NCAA compliance / medical paperwork submitted:',
          'Banking / phone plan / travel logistics handled:',
        ],
      },
      {
        heading: 'Life Skills',
        lines: [
          'Sunday weekly-planning routine started.',
          'Sleep target set (7–9 hours).',
          'Laundry / cooking / time-management habits built.',
          'Communication plan with family established.',
        ],
      },
    ],
  },
};

export function downloadModuleWorksheet(
  module: SelfPacedModule,
  worksheet: ModuleWorksheet,
): boolean {
  if (worksheet.generator !== 'module-guide') {
    const fn = pdfGenerators[worksheet.generator];
    if (fn) {
      fn();
      return true;
    }
    return false;
  }

  const guide = GUIDES[worksheet.id];
  if (!guide) return false;

  generateModuleWorksheetPDF({
    moduleNumber: module.moduleNumber,
    moduleTitle: module.title,
    worksheetTitle: worksheet.title,
    intro: guide.intro,
    sections: guide.sections,
    filename: guide.filename,
  });
  return true;
}

export { SELF_PACED_MODULES };
