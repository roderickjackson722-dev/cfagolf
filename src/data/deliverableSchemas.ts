export interface DeliverableField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'select' | 'number' | 'date';
  placeholder?: string;
  options?: string[];
}

export interface DeliverableSchema {
  key: string;
  title: string;
  description: string;
  moduleNumber: number;
  program: 'hs' | 'transfer';
  fields: DeliverableField[];
}

export const DELIVERABLE_SCHEMAS: DeliverableSchema[] = [
  // === HIGH SCHOOL PROGRAM ===

  // Module 0 — Onboarding
  {
    key: 'goal-setting',
    title: 'Goal-Setting Worksheet',
    description: 'Define your recruiting goals, priorities, and timeline.',
    moduleNumber: 0,
    program: 'hs',
    fields: [
      { key: 'short_term_goals', label: 'Short-Term Goals (next 3 months)', type: 'textarea', placeholder: 'What do you want to accomplish in the next 90 days?' },
      { key: 'long_term_goals', label: 'Long-Term Goals (1–2 years)', type: 'textarea', placeholder: 'Where do you want to be in your recruiting journey?' },
      { key: 'target_division', label: 'Target Division Level', type: 'select', options: ['D1', 'D2', 'D3', 'NAIA', 'JUCO', 'Undecided'] },
      { key: 'geographic_preference', label: 'Geographic Preference', type: 'textarea', placeholder: 'Close to home, specific region, willing to go anywhere?' },
      { key: 'academic_interests', label: 'Academic Interests / Intended Major', type: 'text', placeholder: 'Business, Engineering, Undecided...' },
      { key: 'current_scoring_avg', label: 'Current Scoring Average (18 holes)', type: 'number', placeholder: '78' },
      { key: 'target_scoring_avg', label: 'Target Scoring Average', type: 'number', placeholder: '74' },
      { key: 'current_gpa', label: 'Current GPA', type: 'text', placeholder: '3.5' },
      { key: 'biggest_strengths', label: 'Biggest Strengths in Your Game', type: 'textarea', placeholder: 'Driving, short game, mental toughness...' },
      { key: 'areas_to_improve', label: 'Areas to Improve', type: 'textarea', placeholder: 'Putting consistency, course management...' },
      { key: 'family_involvement', label: 'Family Involvement Notes', type: 'textarea', placeholder: 'Who is involved in your recruiting process? What are their priorities?' },
    ],
  },

  // Module 3 — Scoring Benchmarks
  {
    key: 'scoring-benchmarks',
    title: 'Scoring Benchmarks Worksheet',
    description: 'Identify target scoring averages and benchmarks by division.',
    moduleNumber: 3,
    program: 'hs',
    fields: [
      { key: 'current_18_avg', label: 'Current 18-Hole Scoring Average', type: 'number', placeholder: '78' },
      { key: 'best_18_score', label: 'Best 18-Hole Score', type: 'number', placeholder: '71' },
      { key: 'rounds_tracked', label: 'Number of Competitive Rounds Tracked', type: 'number', placeholder: '20' },
      { key: 'd1_benchmark', label: 'D1 Target Scoring Average', type: 'text', placeholder: '72-74' },
      { key: 'd2_benchmark', label: 'D2 Target Scoring Average', type: 'text', placeholder: '74-76' },
      { key: 'd3_benchmark', label: 'D3 Target Scoring Average', type: 'text', placeholder: '76-79' },
      { key: 'naia_benchmark', label: 'NAIA Target Scoring Average', type: 'text', placeholder: '76-80' },
      { key: 'realistic_division', label: 'Most Realistic Division Based on Current Scores', type: 'select', options: ['D1', 'D2', 'D3', 'NAIA', 'JUCO'] },
      { key: 'improvement_needed', label: 'Strokes Needed to Improve', type: 'textarea', placeholder: 'How many strokes do you need to drop to reach your target?' },
      { key: 'gir_percentage', label: 'Greens in Regulation %', type: 'text', placeholder: '55%' },
      { key: 'putts_per_round', label: 'Average Putts Per Round', type: 'number', placeholder: '32' },
      { key: 'up_and_down_pct', label: 'Up-and-Down %', type: 'text', placeholder: '45%' },
    ],
  },

  // Module 3 — Tournament Schedule
  {
    key: 'tournament-schedule',
    title: 'Tournament Schedule Planner',
    description: 'Plan your competitive tournament schedule for the season.',
    moduleNumber: 3,
    program: 'hs',
    fields: [
      { key: 'total_planned_events', label: 'Total Planned Events This Season', type: 'number', placeholder: '15' },
      { key: 'event_1', label: 'Event 1 (Name, Date, Location)', type: 'text', placeholder: 'AJGA Junior – March 15 – Atlanta, GA' },
      { key: 'event_2', label: 'Event 2', type: 'text', placeholder: '' },
      { key: 'event_3', label: 'Event 3', type: 'text', placeholder: '' },
      { key: 'event_4', label: 'Event 4', type: 'text', placeholder: '' },
      { key: 'event_5', label: 'Event 5', type: 'text', placeholder: '' },
      { key: 'event_6', label: 'Event 6', type: 'text', placeholder: '' },
      { key: 'event_7', label: 'Event 7', type: 'text', placeholder: '' },
      { key: 'event_8', label: 'Event 8', type: 'text', placeholder: '' },
      { key: 'wagr_events', label: 'WAGR-Rated Events Targeted', type: 'textarea', placeholder: 'List any WAGR events you plan to enter' },
      { key: 'exposure_events', label: 'College Exposure / Showcase Events', type: 'textarea', placeholder: 'Events where college coaches will be present' },
      { key: 'schedule_notes', label: 'Schedule Notes', type: 'textarea', placeholder: 'Travel considerations, conflicts with school, etc.' },
    ],
  },

  // Module 4 — Weekly Practice Plan
  {
    key: 'weekly-practice-plan',
    title: 'Weekly Practice Plan',
    description: 'Structure your weekly practice routine across skill areas.',
    moduleNumber: 4,
    program: 'hs',
    fields: [
      { key: 'total_weekly_hours', label: 'Total Weekly Practice Hours', type: 'number', placeholder: '15' },
      { key: 'monday', label: 'Monday Focus', type: 'textarea', placeholder: 'Range work — driver and long irons (2 hrs)' },
      { key: 'tuesday', label: 'Tuesday Focus', type: 'textarea', placeholder: 'Short game — chipping & putting (1.5 hrs)' },
      { key: 'wednesday', label: 'Wednesday Focus', type: 'textarea', placeholder: 'On-course play — 9 holes with targets (3 hrs)' },
      { key: 'thursday', label: 'Thursday Focus', type: 'textarea', placeholder: 'Iron accuracy drills (1.5 hrs)' },
      { key: 'friday', label: 'Friday Focus', type: 'textarea', placeholder: 'Pre-tournament warm-up routine (1 hr)' },
      { key: 'saturday', label: 'Saturday Focus', type: 'textarea', placeholder: 'Tournament round or full 18 practice (4 hrs)' },
      { key: 'sunday', label: 'Sunday Focus', type: 'textarea', placeholder: 'Rest / light putting & visualization' },
      { key: 'skill_breakdown', label: 'Skill Area Breakdown (%)', type: 'textarea', placeholder: 'Driving: 20%, Irons: 25%, Short game: 30%, Putting: 25%' },
      { key: 'practice_notes', label: 'Notes & Adjustments', type: 'textarea', placeholder: 'What to change based on recent tournament performance' },
    ],
  },

  // Module 4 — Fitness Assessment
  {
    key: 'fitness-assessment',
    title: 'Fitness Baseline Assessment',
    description: 'Establish your fitness baseline and goals for college readiness.',
    moduleNumber: 4,
    program: 'hs',
    fields: [
      { key: 'height', label: 'Height', type: 'text', placeholder: '5\'10"' },
      { key: 'weight', label: 'Weight (lbs)', type: 'number', placeholder: '160' },
      { key: 'push_ups', label: 'Push-ups (max in 1 minute)', type: 'number', placeholder: '30' },
      { key: 'plank_hold', label: 'Plank Hold (seconds)', type: 'number', placeholder: '90' },
      { key: 'mile_time', label: '1-Mile Run Time', type: 'text', placeholder: '8:30' },
      { key: 'sit_and_reach', label: 'Sit-and-Reach Flexibility (inches)', type: 'text', placeholder: '+4' },
      { key: 'club_head_speed', label: 'Driver Club Head Speed (mph)', type: 'number', placeholder: '105' },
      { key: 'carry_distance', label: 'Driver Carry Distance (yards)', type: 'number', placeholder: '260' },
      { key: 'current_fitness_routine', label: 'Current Fitness Routine', type: 'textarea', placeholder: 'Describe your current workout schedule' },
      { key: 'fitness_goals', label: 'Fitness Goals (6 months)', type: 'textarea', placeholder: 'What do you want to achieve physically?' },
      { key: 'injuries_concerns', label: 'Injuries or Physical Concerns', type: 'textarea', placeholder: 'Any current or past injuries to be aware of' },
    ],
  },

  // Module 4 — Development Priorities
  {
    key: 'development-priorities',
    title: 'Development Priority List',
    description: 'Rank and plan skill development priorities.',
    moduleNumber: 4,
    program: 'hs',
    fields: [
      { key: 'priority_1', label: 'Priority #1 (Most Important)', type: 'text', placeholder: 'e.g., Putting consistency inside 10 feet' },
      { key: 'priority_1_plan', label: 'Priority #1 — Action Plan', type: 'textarea', placeholder: 'How will you improve this? Drills, coaching, hours?' },
      { key: 'priority_2', label: 'Priority #2', type: 'text', placeholder: 'e.g., Driving accuracy' },
      { key: 'priority_2_plan', label: 'Priority #2 — Action Plan', type: 'textarea', placeholder: '' },
      { key: 'priority_3', label: 'Priority #3', type: 'text', placeholder: 'e.g., Course management decisions' },
      { key: 'priority_3_plan', label: 'Priority #3 — Action Plan', type: 'textarea', placeholder: '' },
      { key: 'priority_4', label: 'Priority #4', type: 'text', placeholder: 'e.g., Mental game under pressure' },
      { key: 'priority_4_plan', label: 'Priority #4 — Action Plan', type: 'textarea', placeholder: '' },
      { key: 'timeline', label: 'Timeline for Reassessment', type: 'text', placeholder: 'When will you review progress? (e.g., every 30 days)' },
      { key: 'accountability', label: 'Accountability Partner', type: 'text', placeholder: 'Coach, parent, or teammate who will help track progress' },
    ],
  },

  // Module 5 — Athletic Resume
  {
    key: 'athletic-resume',
    title: 'Athletic Resume Builder',
    description: 'Compile all the content needed for your recruiting resume.',
    moduleNumber: 5,
    program: 'hs',
    fields: [
      { key: 'full_name', label: 'Full Name', type: 'text', placeholder: '' },
      { key: 'grad_year', label: 'Graduation Year', type: 'number', placeholder: '2026' },
      { key: 'high_school', label: 'High School', type: 'text', placeholder: '' },
      { key: 'city_state', label: 'City, State', type: 'text', placeholder: '' },
      { key: 'height_weight', label: 'Height / Weight', type: 'text', placeholder: '5\'10" / 160 lbs' },
      { key: 'handicap', label: 'Handicap Index', type: 'text', placeholder: '+1.5' },
      { key: 'scoring_average', label: '18-Hole Scoring Average', type: 'text', placeholder: '73.5 (last 20 rounds)' },
      { key: 'best_score', label: 'Best 18-Hole Score', type: 'text', placeholder: '68' },
      { key: 'notable_results', label: 'Notable Tournament Results (top 3–5)', type: 'textarea', placeholder: '1st — AJGA Junior (72-70)\n3rd — State Championship (74-71-73)' },
      { key: 'gpa', label: 'GPA (Weighted / Unweighted)', type: 'text', placeholder: '3.8 / 3.6' },
      { key: 'test_scores', label: 'SAT / ACT Scores', type: 'text', placeholder: 'SAT: 1280 / ACT: 28' },
      { key: 'intended_major', label: 'Intended Major', type: 'text', placeholder: '' },
      { key: 'academic_honors', label: 'Academic Honors', type: 'textarea', placeholder: 'Honor Roll, AP Scholar, etc.' },
      { key: 'extracurriculars', label: 'Extracurriculars & Leadership', type: 'textarea', placeholder: '' },
      { key: 'video_link', label: 'Highlight Video Link', type: 'text', placeholder: 'https://youtube.com/...' },
      { key: 'resume_notes', label: 'Additional Notes', type: 'textarea', placeholder: 'Anything else to include on your resume' },
    ],
  },

  // Module 5 — Video Filming Plan
  {
    key: 'video-filming-plan',
    title: 'Video Filming Plan',
    description: 'Plan your highlight video shoot with a shot checklist.',
    moduleNumber: 5,
    program: 'hs',
    fields: [
      { key: 'filming_date', label: 'Planned Filming Date', type: 'date' },
      { key: 'filming_location', label: 'Filming Location (Course/Range)', type: 'text', placeholder: '' },
      { key: 'equipment', label: 'Equipment Needed', type: 'textarea', placeholder: 'Smartphone, tripod, remote trigger...' },
      { key: 'driver_face_on', label: 'Driver — Face-On Angle', type: 'checkbox' },
      { key: 'driver_down_line', label: 'Driver — Down-the-Line Angle', type: 'checkbox' },
      { key: 'iron_face_on', label: 'Iron Shots — Face-On', type: 'checkbox' },
      { key: 'iron_down_line', label: 'Iron Shots — Down-the-Line', type: 'checkbox' },
      { key: 'chipping', label: 'Short Game — Chipping', type: 'checkbox' },
      { key: 'bunker', label: 'Short Game — Bunker Shots', type: 'checkbox' },
      { key: 'putting', label: 'Putting', type: 'checkbox' },
      { key: 'on_course', label: 'On-Course Footage (routine, decisions)', type: 'checkbox' },
      { key: 'video_length', label: 'Target Video Length', type: 'select', options: ['2–3 minutes', '3–5 minutes', '5+ minutes'] },
      { key: 'hosting_platform', label: 'Hosting Platform', type: 'select', options: ['YouTube (Unlisted)', 'Vimeo', 'Google Drive', 'Other'] },
      { key: 'editing_plan', label: 'Editing Notes', type: 'textarea', placeholder: 'Title card info, music, clip order...' },
    ],
  },

  // Module 5 — Social Media Audit
  {
    key: 'social-media-audit',
    title: 'Social Media Audit',
    description: 'Review your online presence across platforms coaches check.',
    moduleNumber: 5,
    program: 'hs',
    fields: [
      { key: 'instagram_handle', label: 'Instagram Handle', type: 'text', placeholder: '@yourhandle' },
      { key: 'instagram_clean', label: 'Instagram — Profile is clean & appropriate', type: 'checkbox' },
      { key: 'instagram_golf', label: 'Instagram — Contains golf content', type: 'checkbox' },
      { key: 'twitter_handle', label: 'X (Twitter) Handle', type: 'text', placeholder: '@yourhandle' },
      { key: 'twitter_clean', label: 'X — Profile is clean & appropriate', type: 'checkbox' },
      { key: 'facebook_clean', label: 'Facebook — Profile reviewed & clean', type: 'checkbox' },
      { key: 'tiktok_handle', label: 'TikTok Handle', type: 'text', placeholder: '@yourhandle' },
      { key: 'tiktok_clean', label: 'TikTok — Content is appropriate', type: 'checkbox' },
      { key: 'privacy_settings', label: 'Privacy settings reviewed on all platforms', type: 'checkbox' },
      { key: 'old_posts_removed', label: 'Old inappropriate posts removed', type: 'checkbox' },
      { key: 'bio_updated', label: 'Bios updated with golf info & grad year', type: 'checkbox' },
      { key: 'audit_notes', label: 'Notes & Action Items', type: 'textarea', placeholder: 'What needs to be updated or removed?' },
    ],
  },

  // Module 7 — Decision Criteria
  {
    key: 'decision-criteria',
    title: 'Decision Criteria Worksheet',
    description: 'Establish the factors that matter most in your college decision.',
    moduleNumber: 7,
    program: 'hs',
    fields: [
      { key: 'criteria_1', label: 'Most Important Factor', type: 'select', options: ['Academics/Major', 'Golf Program Quality', 'Scholarship Amount', 'Location', 'School Culture', 'Coaching Staff', 'Facilities'] },
      { key: 'criteria_1_weight', label: 'Weight (1–10)', type: 'number', placeholder: '10' },
      { key: 'criteria_2', label: 'Second Most Important Factor', type: 'select', options: ['Academics/Major', 'Golf Program Quality', 'Scholarship Amount', 'Location', 'School Culture', 'Coaching Staff', 'Facilities'] },
      { key: 'criteria_2_weight', label: 'Weight (1–10)', type: 'number', placeholder: '8' },
      { key: 'criteria_3', label: 'Third Factor', type: 'select', options: ['Academics/Major', 'Golf Program Quality', 'Scholarship Amount', 'Location', 'School Culture', 'Coaching Staff', 'Facilities'] },
      { key: 'criteria_3_weight', label: 'Weight (1–10)', type: 'number', placeholder: '7' },
      { key: 'deal_breakers', label: 'Deal Breakers (non-negotiables)', type: 'textarea', placeholder: 'What would make you walk away from an offer?' },
      { key: 'family_priorities', label: 'Family Priorities & Concerns', type: 'textarea', placeholder: 'What matters most to your parents/guardians?' },
      { key: 'decision_deadline', label: 'Target Decision Deadline', type: 'date' },
      { key: 'decision_notes', label: 'Additional Decision Notes', type: 'textarea', placeholder: '' },
    ],
  },

  // Module 8 — 90-Day Action Plan
  {
    key: 'ninety-day-plan',
    title: '90-Day Action Plan',
    description: 'Create a structured 90-day roadmap with measurable milestones.',
    moduleNumber: 8,
    program: 'hs',
    fields: [
      { key: 'plan_start_date', label: 'Plan Start Date', type: 'date' },
      { key: 'month_1_goals', label: 'Month 1 — Key Goals', type: 'textarea', placeholder: 'Finalize outreach emails, update resume, schedule 2 campus visits...' },
      { key: 'month_1_milestones', label: 'Month 1 — Measurable Milestones', type: 'textarea', placeholder: 'Send 10 emails, complete video, GPA above 3.5...' },
      { key: 'month_2_goals', label: 'Month 2 — Key Goals', type: 'textarea', placeholder: '' },
      { key: 'month_2_milestones', label: 'Month 2 — Measurable Milestones', type: 'textarea', placeholder: '' },
      { key: 'month_3_goals', label: 'Month 3 — Key Goals', type: 'textarea', placeholder: '' },
      { key: 'month_3_milestones', label: 'Month 3 — Measurable Milestones', type: 'textarea', placeholder: '' },
      { key: 'accountability_checkpoints', label: 'Accountability Checkpoints', type: 'textarea', placeholder: 'Weekly check-in with coach, bi-weekly family review...' },
      { key: 'biggest_risk', label: 'Biggest Risk / Obstacle', type: 'textarea', placeholder: 'What could derail your plan?' },
      { key: 'contingency', label: 'Contingency Plan', type: 'textarea', placeholder: 'What will you do if things don\'t go as planned?' },
    ],
  },

  // Module 8 — Commitment Readiness Checklist
  {
    key: 'commitment-checklist',
    title: 'Commitment Readiness Checklist',
    description: 'Verify you are ready to commit to a program.',
    moduleNumber: 8,
    program: 'hs',
    fields: [
      { key: 'visited_campus', label: 'I have visited the campus', type: 'checkbox' },
      { key: 'met_coach', label: 'I have met with the head coach in person', type: 'checkbox' },
      { key: 'met_team', label: 'I have met current team members', type: 'checkbox' },
      { key: 'understand_finances', label: 'I fully understand the financial package', type: 'checkbox' },
      { key: 'academic_fit', label: 'The school offers my intended major', type: 'checkbox' },
      { key: 'family_aligned', label: 'My family supports this decision', type: 'checkbox' },
      { key: 'compared_offers', label: 'I have compared all offers I received', type: 'checkbox' },
      { key: 'nli_understanding', label: 'I understand the NLI and commitment process', type: 'checkbox' },
      { key: 'transfer_portal_aware', label: 'I understand transfer portal implications', type: 'checkbox' },
      { key: 'gut_check', label: 'I feel genuinely excited about this school', type: 'checkbox' },
      { key: 'remaining_concerns', label: 'Remaining Concerns or Questions', type: 'textarea', placeholder: 'Anything still keeping you from committing?' },
    ],
  },

  // Module 9 — Transition Checklist
  {
    key: 'transition-checklist',
    title: 'College Transition Checklist',
    description: 'Prepare for the transition from high school to college golf.',
    moduleNumber: 9,
    program: 'hs',
    fields: [
      { key: 'housing_secured', label: 'Housing arranged', type: 'checkbox' },
      { key: 'orientation_registered', label: 'Orientation registered', type: 'checkbox' },
      { key: 'courses_registered', label: 'Course registration completed', type: 'checkbox' },
      { key: 'coach_communication', label: 'Connected with future coach about summer expectations', type: 'checkbox' },
      { key: 'teammates_connected', label: 'Connected with future teammates', type: 'checkbox' },
      { key: 'equipment_ready', label: 'Equipment updated and ready', type: 'checkbox' },
      { key: 'fitness_plan', label: 'Summer fitness plan established', type: 'checkbox' },
      { key: 'practice_schedule', label: 'Summer practice schedule set', type: 'checkbox' },
      { key: 'academic_advisor', label: 'Academic advisor meeting scheduled', type: 'checkbox' },
      { key: 'financial_aid_confirmed', label: 'Financial aid package confirmed', type: 'checkbox' },
      { key: 'medical_forms', label: 'Athletic medical forms submitted', type: 'checkbox' },
      { key: 'transition_notes', label: 'Additional Transition Notes', type: 'textarea', placeholder: 'Anything else to prepare before arriving on campus?' },
    ],
  },

  // Module 9 — Summer Action Plan
  {
    key: 'summer-action-plan',
    title: 'Summer Action Plan',
    description: 'Plan your summer before starting college golf.',
    moduleNumber: 9,
    program: 'hs',
    fields: [
      { key: 'summer_tournaments', label: 'Summer Tournaments Planned', type: 'textarea', placeholder: 'List events you plan to compete in' },
      { key: 'practice_goals', label: 'Practice Goals for Summer', type: 'textarea', placeholder: 'Hours per week, specific drills, areas of focus' },
      { key: 'fitness_goals', label: 'Fitness Goals for Summer', type: 'textarea', placeholder: 'Workout schedule, target metrics' },
      { key: 'scoring_target', label: 'Scoring Target by End of Summer', type: 'number', placeholder: '73' },
      { key: 'reading_list', label: 'Mental Game / Golf Books to Read', type: 'textarea', placeholder: '' },
      { key: 'coach_check_ins', label: 'Planned Check-ins with College Coach', type: 'textarea', placeholder: 'How often will you communicate?' },
      { key: 'campus_prep', label: 'Campus Preparation Tasks', type: 'textarea', placeholder: 'What to buy, pack, arrange before move-in' },
      { key: 'summer_notes', label: 'Additional Notes', type: 'textarea', placeholder: '' },
    ],
  },

  // === TRANSFER PROGRAM ===

  // Transfer Module 1 — Transfer Readiness Assessment
  {
    key: 'transfer-readiness',
    title: 'Transfer Readiness Assessment',
    description: 'Assess your readiness and reasons for transferring.',
    moduleNumber: 1,
    program: 'transfer',
    fields: [
      { key: 'reasons_for_transfer', label: 'Primary Reasons for Transferring', type: 'textarea', placeholder: 'Playing time, coaching change, academics, location...' },
      { key: 'what_didnt_work', label: 'What Didn\'t Work at Current School?', type: 'textarea', placeholder: '' },
      { key: 'what_looking_for', label: 'What Are You Looking for in a New Program?', type: 'textarea', placeholder: '' },
      { key: 'ready_to_compete', label: 'I am ready to compete immediately', type: 'checkbox' },
      { key: 'gpa_in_good_standing', label: 'My GPA is in good academic standing', type: 'checkbox' },
      { key: 'no_disciplinary_issues', label: 'I have no disciplinary issues', type: 'checkbox' },
      { key: 'discussed_with_coach', label: 'I have discussed transferring with my current coach', type: 'checkbox' },
      { key: 'discussed_with_family', label: 'I have discussed with my family', type: 'checkbox' },
      { key: 'understand_risks', label: 'I understand that entering the portal may mean losing my current scholarship', type: 'checkbox' },
      { key: 'eligibility_remaining', label: 'Years of Eligibility Remaining', type: 'number', placeholder: '3' },
      { key: 'readiness_notes', label: 'Additional Notes', type: 'textarea', placeholder: '' },
    ],
  },

  // Transfer Module 1 — Transfer Timeline
  {
    key: 'transfer-timeline',
    title: 'Transfer Timeline Planner',
    description: 'Map out key dates and transfer window deadlines.',
    moduleNumber: 1,
    program: 'transfer',
    fields: [
      { key: 'sport_transfer_window_open', label: 'Transfer Window Opens (Date)', type: 'date' },
      { key: 'sport_transfer_window_close', label: 'Transfer Window Closes (Date)', type: 'date' },
      { key: 'planned_portal_entry', label: 'Planned Portal Entry Date', type: 'date' },
      { key: 'coach_notification_date', label: 'Date to Notify Current Coach', type: 'date' },
      { key: 'target_commitment_date', label: 'Target Commitment Date', type: 'date' },
      { key: 'transcript_request_date', label: 'Transcript Request Date', type: 'date' },
      { key: 'campus_visit_dates', label: 'Planned Campus Visit Dates', type: 'textarea', placeholder: 'List schools and target visit dates' },
      { key: 'division_rules', label: 'Division-Specific Rules to Follow', type: 'textarea', placeholder: 'D1/D2/D3/NAIA/JUCO specific requirements' },
      { key: 'timeline_notes', label: 'Timeline Notes', type: 'textarea', placeholder: '' },
    ],
  },

  // Transfer Module 3 — Transfer Narrative
  {
    key: 'transfer-narrative',
    title: 'Transfer Narrative & Talking Points',
    description: 'Craft your transfer story and key talking points for coaches.',
    moduleNumber: 3,
    program: 'transfer',
    fields: [
      { key: 'transfer_story', label: 'Your Transfer Story (2–3 paragraphs)', type: 'textarea', placeholder: 'Why are you transferring? Frame it positively — focus on what you\'re moving toward, not what you\'re leaving.' },
      { key: 'what_you_bring', label: 'What You Bring to a New Program', type: 'textarea', placeholder: 'Collegiate experience, proven stats, leadership, maturity...' },
      { key: 'why_transferring_answer', label: 'Answer to "Why are you transferring?"', type: 'textarea', placeholder: 'Practice this — coaches WILL ask. Keep it positive and forward-looking.' },
      { key: 'growth_at_current', label: 'What You Gained at Your Current School', type: 'textarea', placeholder: 'Show maturity by acknowledging positives from your current experience' },
      { key: 'ideal_program_description', label: 'What Your Ideal Program Looks Like', type: 'textarea', placeholder: 'Coaching style, team culture, academics, competition level...' },
      { key: 'narrative_notes', label: 'Notes & Revisions', type: 'textarea', placeholder: '' },
    ],
  },

  // Transfer Module 5 — Negotiation Strategy
  {
    key: 'negotiation-strategy',
    title: 'Negotiation Strategy Document',
    description: 'Plan your scholarship negotiation approach.',
    moduleNumber: 5,
    program: 'transfer',
    fields: [
      { key: 'current_offer_1', label: 'School 1 — Name & Offer Amount', type: 'text', placeholder: 'University X — $15,000 athletic + $5,000 academic' },
      { key: 'current_offer_2', label: 'School 2 — Name & Offer Amount', type: 'text', placeholder: '' },
      { key: 'current_offer_3', label: 'School 3 — Name & Offer Amount', type: 'text', placeholder: '' },
      { key: 'leverage_points', label: 'Leverage Points', type: 'textarea', placeholder: 'Multiple offers, strong stats, academic merit, etc.' },
      { key: 'target_package', label: 'Target Financial Package', type: 'textarea', placeholder: 'What total package would make this work financially?' },
      { key: 'negotiation_talking_points', label: 'Negotiation Talking Points', type: 'textarea', placeholder: 'Key points to raise during negotiation conversations' },
      { key: 'walk_away_point', label: 'Walk-Away Point', type: 'textarea', placeholder: 'At what point is the offer not enough?' },
      { key: 'nil_questions', label: 'NIL Questions to Ask', type: 'textarea', placeholder: 'Questions about NIL collective, opportunities, policies...' },
      { key: 'negotiation_notes', label: 'Strategy Notes', type: 'textarea', placeholder: '' },
    ],
  },

  // Transfer Module 6 — Transfer Decision Document
  {
    key: 'transfer-decision',
    title: 'Final Transfer Decision Document',
    description: 'Document your final transfer decision and reasoning.',
    moduleNumber: 6,
    program: 'transfer',
    fields: [
      { key: 'chosen_school', label: 'School I Am Committing To', type: 'text', placeholder: '' },
      { key: 'decision_date', label: 'Decision Date', type: 'date' },
      { key: 'why_this_school', label: 'Why This School?', type: 'textarea', placeholder: 'Summarize the top reasons for your decision' },
      { key: 'financial_summary', label: 'Financial Package Summary', type: 'textarea', placeholder: 'Total aid, net cost, terms...' },
      { key: 'academic_plan', label: 'Academic Plan at New School', type: 'textarea', placeholder: 'Major, expected graduation date, credits transferring...' },
      { key: 'athletic_expectations', label: 'Athletic Expectations', type: 'textarea', placeholder: 'Role on team, playing time, coaching style...' },
      { key: 'portal_exit_plan', label: 'Portal Exit & Commitment Steps', type: 'textarea', placeholder: 'Steps to formalize commitment and exit portal' },
      { key: 'decision_notes', label: 'Additional Notes', type: 'textarea', placeholder: '' },
    ],
  },

  // Transfer Module 6 — Transfer Transition Checklist
  {
    key: 'transfer-transition',
    title: 'Transfer Transition Checklist',
    description: 'Ensure a smooth transition to your new school.',
    moduleNumber: 6,
    program: 'transfer',
    fields: [
      { key: 'official_release', label: 'Official release/transfer paperwork completed', type: 'checkbox' },
      { key: 'transcripts_sent', label: 'Official transcripts sent to new school', type: 'checkbox' },
      { key: 'credits_evaluated', label: 'Credit evaluation completed with new school', type: 'checkbox' },
      { key: 'advisor_meeting', label: 'Academic advisor meeting at new school scheduled', type: 'checkbox' },
      { key: 'course_registration', label: 'Course registration completed', type: 'checkbox' },
      { key: 'housing_arranged', label: 'Housing arranged', type: 'checkbox' },
      { key: 'coach_connected', label: 'Connected with new coaching staff about expectations', type: 'checkbox' },
      { key: 'teammates_connected', label: 'Connected with new teammates', type: 'checkbox' },
      { key: 'summer_training', label: 'Summer training plan from new coach received', type: 'checkbox' },
      { key: 'medical_forms', label: 'Athletic medical/physical forms submitted', type: 'checkbox' },
      { key: 'financial_aid_finalized', label: 'Financial aid package finalized', type: 'checkbox' },
      { key: 'old_school_goodbyes', label: 'Professional goodbyes with former coaches/teammates', type: 'checkbox' },
      { key: 'transition_notes', label: 'Additional Notes', type: 'textarea', placeholder: '' },
    ],
  },

  // Transfer Module 6 — Academic Bridge Plan
  {
    key: 'academic-bridge-plan',
    title: 'Academic Bridge Plan',
    description: 'Plan your academic path at your new institution.',
    moduleNumber: 6,
    program: 'transfer',
    fields: [
      { key: 'total_credits_earned', label: 'Total Credits Earned at Previous School', type: 'number', placeholder: '60' },
      { key: 'credits_transferring', label: 'Credits Expected to Transfer', type: 'number', placeholder: '54' },
      { key: 'credits_lost', label: 'Credits That May Not Transfer', type: 'number', placeholder: '6' },
      { key: 'new_major', label: 'Major at New School', type: 'text', placeholder: '' },
      { key: 'expected_graduation', label: 'Expected Graduation Date', type: 'text', placeholder: 'May 2028' },
      { key: 'additional_semesters', label: 'Additional Semesters Needed (if any)', type: 'number', placeholder: '0' },
      { key: 'summer_courses', label: 'Summer Courses Planned', type: 'textarea', placeholder: 'Any courses to take over summer to stay on track?' },
      { key: 'key_requirements', label: 'Key Degree Requirements Still Needed', type: 'textarea', placeholder: 'Core courses, electives, prerequisites...' },
      { key: 'gpa_goals', label: 'GPA Goals at New School', type: 'text', placeholder: '3.5+' },
      { key: 'academic_support', label: 'Academic Support Resources Available', type: 'textarea', placeholder: 'Tutoring, study hall, athlete academic center...' },
      { key: 'bridge_notes', label: 'Additional Notes', type: 'textarea', placeholder: '' },
    ],
  },
];

// Helper to get deliverables for a specific module
export function getDeliverablesForModule(moduleNumber: number, program: 'hs' | 'transfer'): DeliverableSchema[] {
  return DELIVERABLE_SCHEMAS.filter(d => d.moduleNumber === moduleNumber && d.program === program);
}

// Helper to get all deliverable keys
export function getAllDeliverableKeys(): string[] {
  return DELIVERABLE_SCHEMAS.map(d => d.key);
}
