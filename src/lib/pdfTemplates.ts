import jsPDF from 'jspdf';
import cfaWatermark from '@/assets/cfa-watermark.png';

// Helper to add watermark to each page
const addWatermark = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add semi-transparent watermark in center
  doc.saveGraphicsState();
  // @ts-ignore - setGState exists in jsPDF
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  
  // Calculate centered position for watermark
  const watermarkWidth = 120;
  const watermarkHeight = 80;
  const x = (pageWidth - watermarkWidth) / 2;
  const y = (pageHeight - watermarkHeight) / 2;
  
  doc.addImage(cfaWatermark, 'PNG', x, y, watermarkWidth, watermarkHeight);
  doc.restoreGraphicsState();
};

// Helper to add header to PDF
const addHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background
  doc.setFillColor(26, 46, 37); // Deep forest green
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Logo
  doc.addImage(cfaWatermark, 'PNG', 10, 5, 30, 25);
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 50, 22);
  
  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('College Fairway Advisors', 50, 28);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
};

// Helper to add footer
const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('www.cfa.golf | College Fairway Advisors', pageWidth / 2, pageHeight - 10, { align: 'center' });
  doc.text(`Page ${doc.internal.pages.length - 1}`, pageWidth - 20, pageHeight - 10);
};

// Helper for section headers
const addSectionHeader = (doc: jsPDF, text: string, y: number): number => {
  doc.setFillColor(102, 140, 115); // Sage green
  doc.rect(10, y, doc.internal.pageSize.getWidth() - 20, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(text, 14, y + 5.5);
  doc.setTextColor(0, 0, 0);
  return y + 12;
};

// Helper for table rows
const addTableRow = (doc: jsPDF, label: string, y: number, isEven: boolean = false): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  if (isEven) {
    doc.setFillColor(245, 243, 239); // Light beige
    doc.rect(10, y, pageWidth - 20, 8, 'F');
  }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(label, 14, y + 5.5);
  
  // Draw line for writing
  doc.setDrawColor(200, 200, 200);
  doc.line(80, y + 6, pageWidth - 14, y + 6);
  
  return y + 10;
};

// 1. Target School List Builder
export const generateTargetSchoolList = (): void => {
  const doc = new jsPDF();
  
  addWatermark(doc);
  addHeader(doc, 'Target School List Builder');
  
  let y = 45;
  
  // Instructions
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('Use this worksheet to research and evaluate potential college golf programs.', 14, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  
  // Dream Schools Section
  y = addSectionHeader(doc, 'DREAM SCHOOLS (Reach)', y);
  for (let i = 0; i < 5; i++) {
    y = addTableRow(doc, `${i + 1}. School Name:`, y, i % 2 === 0);
  }
  y += 5;
  
  // Target Schools Section
  y = addSectionHeader(doc, 'TARGET SCHOOLS (Match)', y);
  for (let i = 0; i < 5; i++) {
    y = addTableRow(doc, `${i + 1}. School Name:`, y, i % 2 === 0);
  }
  y += 5;
  
  // Safety Schools Section
  y = addSectionHeader(doc, 'SAFETY SCHOOLS', y);
  for (let i = 0; i < 5; i++) {
    y = addTableRow(doc, `${i + 1}. School Name:`, y, i % 2 === 0);
  }
  
  // Page 2 - Evaluation Criteria
  doc.addPage();
  addWatermark(doc);
  addHeader(doc, 'School Evaluation Criteria');
  
  y = 45;
  y = addSectionHeader(doc, 'EVALUATION CHECKLIST', y);
  
  const criteria = [
    'Academic programs / Major availability',
    'Division level (D1, D2, D3, NAIA, JUCO)',
    'Team scoring average',
    'Location / Distance from home',
    'Cost of attendance',
    'Scholarship opportunities',
    'Coach communication responsiveness',
    'Campus culture / Team culture',
    'Practice facility quality',
    'Academic support for athletes'
  ];
  
  criteria.forEach((item, i) => {
    y = addTableRow(doc, item, y, i % 2 === 0);
  });
  
  addFooter(doc);
  doc.save('CFA_Target_School_List.pdf');
};

// 2. Swing Video Shot List
export const generateVideoSpecs = (): void => {
  const doc = new jsPDF();
  
  addWatermark(doc);
  addHeader(doc, 'Swing Video Shot List & Specs');
  
  let y = 45;
  
  // Instructions
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('Create a professional highlight video following these specifications.', 14, y);
  y += 10;
  
  doc.setTextColor(0, 0, 0);
  
  // Technical Specs
  y = addSectionHeader(doc, 'TECHNICAL SPECIFICATIONS', y);
  const specs = [
    'Video Format: MP4 or MOV',
    'Resolution: 1080p minimum',
    'Duration: 3-5 minutes',
    'File Size: Under 100MB for email',
    'Audio: Background music (optional)'
  ];
  specs.forEach((spec, i) => {
    y = addTableRow(doc, spec, y, i % 2 === 0);
  });
  y += 5;
  
  // Required Shots
  y = addSectionHeader(doc, 'REQUIRED SHOTS CHECKLIST', y);
  const shots = [
    '☐ Driver - Face on view (3 swings)',
    '☐ Driver - Down the line view (3 swings)',
    '☐ Iron - Face on view (3 swings)',
    '☐ Iron - Down the line view (3 swings)',
    '☐ Wedge - Face on & down line',
    '☐ Putting - Face on view',
    '☐ Putting - Down the line view',
    '☐ Chipping - Various lies',
    '☐ Bunker shot',
    '☐ On-course playing footage'
  ];
  shots.forEach((shot, i) => {
    y = addTableRow(doc, shot, y, i % 2 === 0);
  });
  
  // Page 2 - Tips
  doc.addPage();
  addWatermark(doc);
  addHeader(doc, 'Video Recording Tips');
  
  y = 45;
  y = addSectionHeader(doc, 'FILMING BEST PRACTICES', y);
  
  const tips = [
    'Film during golden hour (early morning/late afternoon)',
    'Use a tripod or stabilizer for steady footage',
    'Camera at waist height for swing shots',
    'Include trajectory of ball in flight',
    'Show course management decision-making',
    'Keep swing segments to 10-15 seconds each',
    'Include text overlays with stats when possible',
    'Add intro slide with name, grad year, contact'
  ];
  
  tips.forEach((tip, i) => {
    y = addTableRow(doc, tip, y, i % 2 === 0);
  });
  
  addFooter(doc);
  doc.save('CFA_Video_Shot_List.pdf');
};

// 3. Tournament Result Log
export const generateTournamentLog = (): void => {
  const doc = new jsPDF('landscape');
  
  addWatermark(doc);
  
  // Custom header for landscape
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(26, 46, 37);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.addImage(cfaWatermark, 'PNG', 10, 3, 25, 19);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Tournament Result Log', 45, 15);
  
  let y = 35;
  
  // Player Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text('Player Name: _______________________', 14, y);
  doc.text('Graduation Year: _______', 120, y);
  doc.text('Handicap: _______', 200, y);
  y += 15;
  
  // Table Header
  doc.setFillColor(102, 140, 115);
  doc.rect(10, y, pageWidth - 20, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  const headers = ['Date', 'Tournament Name', 'Course', 'R1', 'R2', 'R3', 'Total', 'Place', 'Field Size'];
  const colWidths = [25, 60, 50, 18, 18, 18, 22, 25, 30];
  let x = 14;
  headers.forEach((header, i) => {
    doc.text(header, x, y + 7);
    x += colWidths[i];
  });
  y += 12;
  
  // Table Rows
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  for (let row = 0; row < 12; row++) {
    if (row % 2 === 0) {
      doc.setFillColor(245, 243, 239);
      doc.rect(10, y, pageWidth - 20, 10, 'F');
    }
    
    x = 14;
    colWidths.forEach((width) => {
      doc.line(x, y + 8, x + width - 4, y + 8);
      x += width;
    });
    y += 10;
  }
  
  addFooter(doc);
  doc.save('CFA_Tournament_Log.pdf');
};

// 4. Coach Contact Tracker
export const generateCoachTracker = (): void => {
  const doc = new jsPDF();
  
  addWatermark(doc);
  addHeader(doc, 'Coach Contact Tracker');
  
  let y = 45;
  
  // Instructions
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('Track all communications with college coaches. Keep detailed notes on each interaction.', 14, y);
  y += 12;
  
  doc.setTextColor(0, 0, 0);
  
  // Contact Entry Template - Multiple entries per page
  for (let entry = 0; entry < 3; entry++) {
    y = addSectionHeader(doc, `COACH CONTACT ${entry + 1}`, y);
    
    const fields = [
      'School Name:',
      'Coach Name:',
      'Title (Head/Assistant):',
      'Email:',
      'Phone:',
      'Date of First Contact:',
      'Type of Contact (email/call/visit):',
      'Response Received (Y/N):',
      'Follow-up Date:',
      'Notes:'
    ];
    
    fields.forEach((field, i) => {
      y = addTableRow(doc, field, y, i % 2 === 0);
    });
    y += 8;
    
    if (y > 250 && entry < 2) {
      doc.addPage();
      addWatermark(doc);
      addHeader(doc, 'Coach Contact Tracker (Continued)');
      y = 45;
    }
  }
  
  addFooter(doc);
  doc.save('CFA_Coach_Contact_Tracker.pdf');
};

// 5. Pre-Call Question Prep
export const generatePreCallPrep = (): void => {
  const doc = new jsPDF();
  
  addWatermark(doc);
  addHeader(doc, 'Pre-Call Question Prep Sheet');
  
  let y = 45;
  
  // Call Info
  y = addSectionHeader(doc, 'CALL DETAILS', y);
  const callInfo = [
    'School:',
    'Coach Name:',
    'Date/Time:',
    'Phone Number:'
  ];
  callInfo.forEach((field, i) => {
    y = addTableRow(doc, field, y, i % 2 === 0);
  });
  y += 5;
  
  // Questions to Ask
  y = addSectionHeader(doc, 'QUESTIONS TO ASK THE COACH', y);
  const questions = [
    '1. What does your recruiting timeline look like?',
    '2. What are you looking for in a recruit?',
    '3. What is the team culture like?',
    '4. What academic support is available?',
    '5. What is the typical practice schedule?',
    '6. How many spots do you have for my class?',
    '7. What is the path to earning playing time?',
    '8. Can I schedule an official/unofficial visit?'
  ];
  questions.forEach((q, i) => {
    y = addTableRow(doc, q, y, i % 2 === 0);
  });
  y += 5;
  
  // Your Talking Points
  y = addSectionHeader(doc, 'YOUR TALKING POINTS', y);
  const points = [
    'My current scoring average:',
    'Recent tournament results:',
    'Academic strengths:',
    'Why I\'m interested in this school:'
  ];
  points.forEach((p, i) => {
    y = addTableRow(doc, p, y, i % 2 === 0);
  });
  
  // Page 2 - Notes
  doc.addPage();
  addWatermark(doc);
  addHeader(doc, 'Call Notes & Follow-up');
  
  y = 45;
  y = addSectionHeader(doc, 'NOTES FROM THE CALL', y);
  
  // Lined note section
  for (let i = 0; i < 15; i++) {
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y + 8, doc.internal.pageSize.getWidth() - 14, y + 8);
    y += 10;
  }
  
  y += 5;
  y = addSectionHeader(doc, 'FOLLOW-UP ACTIONS', y);
  const followUp = [
    '☐ Send thank you email by:',
    '☐ Send requested materials:',
    '☐ Schedule next contact:',
    '☐ Other:'
  ];
  followUp.forEach((item, i) => {
    y = addTableRow(doc, item, y, i % 2 === 0);
  });
  
  addFooter(doc);
  doc.save('CFA_Pre_Call_Prep.pdf');
};

// 6. Campus Visit Comparison
export const generateCampusVisit = (): void => {
  const doc = new jsPDF('landscape');
  
  addWatermark(doc);
  
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(26, 46, 37);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.addImage(cfaWatermark, 'PNG', 10, 3, 25, 19);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Campus Visit Comparison Worksheet', 45, 15);
  
  let y = 35;
  
  // Table Header
  doc.setFillColor(102, 140, 115);
  doc.rect(10, y, pageWidth - 20, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  const headers = ['Criteria', 'School 1', 'School 2', 'School 3', 'School 4'];
  const colWidth = (pageWidth - 20) / 5;
  headers.forEach((header, i) => {
    doc.text(header, 14 + (i * colWidth), y + 7);
  });
  y += 12;
  
  // Criteria rows
  doc.setTextColor(0, 0, 0);
  const criteria = [
    'School Name',
    'Visit Date',
    'Academics (1-10)',
    'Golf Facilities (1-10)',
    'Campus Feel (1-10)',
    'Team Chemistry (1-10)',
    'Coach Impression (1-10)',
    'Location Appeal (1-10)',
    'Cost/Scholarship',
    'Academic Support',
    'Dorm/Housing',
    'Food/Dining',
    'Overall Score',
    'Gut Feeling (1-10)'
  ];
  
  doc.setFont('helvetica', 'normal');
  criteria.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(245, 243, 239);
      doc.rect(10, y, pageWidth - 20, 10, 'F');
    }
    
    doc.text(item, 14, y + 7);
    
    // Draw lines for other columns
    for (let col = 1; col < 5; col++) {
      doc.setDrawColor(200, 200, 200);
      doc.line(14 + (col * colWidth), y + 8, 10 + ((col + 1) * colWidth), y + 8);
    }
    y += 10;
  });
  
  addFooter(doc);
  doc.save('CFA_Campus_Visit_Comparison.pdf');
};

// 7. Scholarship Offer Calculator
export const generateScholarshipCalc = (): void => {
  const doc = new jsPDF();
  
  addWatermark(doc);
  addHeader(doc, 'Scholarship Offer Analysis');
  
  let y = 45;
  
  // School Info
  y = addSectionHeader(doc, 'SCHOOL INFORMATION', y);
  const schoolInfo = [
    'School Name:',
    'Division:',
    'In-State / Out-of-State:'
  ];
  schoolInfo.forEach((field, i) => {
    y = addTableRow(doc, field, y, i % 2 === 0);
  });
  y += 5;
  
  // Cost Breakdown
  y = addSectionHeader(doc, 'ANNUAL COST BREAKDOWN', y);
  const costs = [
    'Tuition & Fees: $',
    'Room & Board: $',
    'Books & Supplies: $',
    'Personal Expenses: $',
    'Transportation: $',
    'TOTAL COST OF ATTENDANCE: $'
  ];
  costs.forEach((cost, i) => {
    y = addTableRow(doc, cost, y, i % 2 === 0);
  });
  y += 5;
  
  // Scholarship Offer
  y = addSectionHeader(doc, 'SCHOLARSHIP & AID OFFERED', y);
  const aid = [
    'Athletic Scholarship: $',
    'Academic Scholarship: $',
    'Need-Based Grant: $',
    'Other Grants: $',
    'Work-Study: $',
    'TOTAL AID PACKAGE: $'
  ];
  aid.forEach((item, i) => {
    y = addTableRow(doc, item, y, i % 2 === 0);
  });
  y += 5;
  
  // Net Cost
  y = addSectionHeader(doc, 'NET COST CALCULATION', y);
  const netCost = [
    'Total Cost of Attendance: $',
    'Minus: Total Aid Package: $',
    '= OUT-OF-POCKET COST: $',
    'x 4 Years = TOTAL 4-YEAR COST: $'
  ];
  netCost.forEach((item, i) => {
    y = addTableRow(doc, item, y, i % 2 === 0);
  });
  
  // Page 2 - Comparison
  doc.addPage();
  addWatermark(doc);
  addHeader(doc, 'Multi-School Comparison');
  
  y = 45;
  
  // Quick comparison table
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(102, 140, 115);
  doc.rect(10, y, pageWidth - 20, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  const headers = ['', 'School 1', 'School 2', 'School 3'];
  const colWidth = (pageWidth - 20) / 4;
  headers.forEach((header, i) => {
    doc.text(header, 14 + (i * colWidth), y + 7);
  });
  y += 12;
  
  doc.setTextColor(0, 0, 0);
  const compRows = [
    'School Name',
    'Total COA',
    'Total Aid',
    'Net Annual Cost',
    '4-Year Total',
    'Scholarship %'
  ];
  
  doc.setFont('helvetica', 'normal');
  compRows.forEach((row, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(245, 243, 239);
      doc.rect(10, y, pageWidth - 20, 10, 'F');
    }
    doc.text(row, 14, y + 7);
    for (let col = 1; col < 4; col++) {
      doc.setDrawColor(200, 200, 200);
      doc.line(14 + (col * colWidth), y + 8, 10 + ((col + 1) * colWidth), y + 8);
    }
    y += 10;
  });
  
  addFooter(doc);
  doc.save('CFA_Scholarship_Calculator.pdf');
};

// 8. 12-Month Recruiting Timeline
export const generateTimeline = (): void => {
  const doc = new jsPDF();
  
  addWatermark(doc);
  addHeader(doc, '12-Month Recruiting Timeline');
  
  let y = 45;
  
  // Grade Level
  doc.setFontSize(10);
  doc.text('Current Grade Level:  ☐ Freshman  ☐ Sophomore  ☐ Junior  ☐ Senior', 14, y);
  y += 12;
  
  // Months 1-6
  const months1 = [
    { month: 'MONTH 1', tasks: ['Research 20+ schools', 'Update academic profile', 'Set scoring goals'] },
    { month: 'MONTH 2', tasks: ['Create highlight video', 'Build target school list', 'Draft intro email template'] },
    { month: 'MONTH 3', tasks: ['Begin coach outreach', 'Register for tournaments', 'Update online profiles'] },
    { month: 'MONTH 4', tasks: ['Follow up with coaches', 'Attend college showcase event', 'Track tournament results'] },
    { month: 'MONTH 5', tasks: ['Schedule campus visits', 'Continue coach communication', 'Update video highlights'] },
    { month: 'MONTH 6', tasks: ['Complete campus visits', 'Narrow target list', 'Prepare for summer tournaments'] }
  ];
  
  months1.forEach((m, idx) => {
    y = addSectionHeader(doc, m.month, y);
    m.tasks.forEach((task, i) => {
      doc.setFontSize(10);
      doc.text(`☐ ${task}`, 18, y + 5);
      y += 8;
    });
    y += 3;
    
    if (y > 250) {
      doc.addPage();
      addWatermark(doc);
      addHeader(doc, '12-Month Recruiting Timeline (Continued)');
      y = 45;
    }
  });
  
  // Page 2 - Months 7-12
  doc.addPage();
  addWatermark(doc);
  addHeader(doc, '12-Month Recruiting Timeline (Continued)');
  y = 45;
  
  const months2 = [
    { month: 'MONTH 7', tasks: ['Compete in summer events', 'Send result updates to coaches', 'Request official visits'] },
    { month: 'MONTH 8', tasks: ['Complete official visits', 'Compare scholarship offers', 'Meet with family/advisor'] },
    { month: 'MONTH 9', tasks: ['Make final decisions', 'Communicate with top choices', 'Prepare for signing'] },
    { month: 'MONTH 10', tasks: ['Early signing period (if applicable)', 'Continue academic performance', 'Thank coaches'] },
    { month: 'MONTH 11', tasks: ['Regular signing period', 'Complete enrollment steps', 'Connect with future teammates'] },
    { month: 'MONTH 12', tasks: ['Celebrate commitment!', 'Prepare for transition', 'Stay in touch with coaching staff'] }
  ];
  
  months2.forEach((m) => {
    y = addSectionHeader(doc, m.month, y);
    m.tasks.forEach((task) => {
      doc.setFontSize(10);
      doc.text(`☐ ${task}`, 18, y + 5);
      y += 8;
    });
    y += 3;
  });
  
  addFooter(doc);
  doc.save('CFA_12_Month_Timeline.pdf');
};

// 9. Marketing One-Pager Flyer
export const generateMarketingFlyer = (): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Full page green header banner
  doc.setFillColor(26, 46, 37);
  doc.rect(0, 0, pageWidth, 60, 'F');

  // Logo
  doc.addImage(cfaWatermark, 'PNG', 14, 8, 40, 30);

  // Brand name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('College Fairway Advisors', 60, 25);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Strategic Recruiting Partner for College Golf', 60, 35);

  // Gold accent line
  doc.setFillColor(220, 180, 50);
  doc.rect(14, 48, pageWidth - 28, 2, 'F');

  // Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('www.cfa.golf', pageWidth - 14, 56, { align: 'right' });

  let y = 70;

  // Intro paragraph
  doc.setTextColor(30, 50, 40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const intro = 'Expert guidance for junior golfers and their families navigating the college golf recruiting process. We provide personalized consulting, professional tools, and direct access to college coaches and LPGA/PGA professionals.';
  const introLines = doc.splitTextToSize(intro, pageWidth - 28);
  doc.text(introLines, 14, y);
  y += introLines.length * 6 + 8;

  // What's Included section
  doc.setFillColor(102, 140, 115);
  doc.rect(14, y, pageWidth - 28, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("WHAT'S INCLUDED IN YOUR ANNUAL MEMBERSHIP", 18, y + 6.5);
  y += 14;

  const services = [
    ['12 Monthly Coaching Calls', 'One-on-one guidance through every phase of recruiting'],
    ['LPGA & PGA Pro Webinars', 'Exclusive sessions with touring professionals'],
    ['College Coach Sessions', 'Learn what coaches look for in recruits'],
    ['Target School List Builder', 'Strategic school matching based on your profile'],
    ['Tournament Result Log', 'Track competitive results for your recruiting resume'],
    ['Coach Contact Tracker', 'Organize all coach communications in one place'],
    ['Scholarship Calculator', 'Analyze and compare financial aid offers'],
    ['12-Month Recruiting Timeline', 'Grade-specific action plans to stay on track'],
  ];

  doc.setTextColor(30, 50, 40);
  services.forEach((s, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(245, 243, 239);
      doc.rect(14, y - 1, pageWidth - 28, 9, 'F');
    }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`✓  ${s[0]}`, 18, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(s[1], 90, y + 5);
    doc.setTextColor(30, 50, 40);
    y += 9;
  });

  y += 8;

  // Pricing box
  doc.setFillColor(26, 46, 37);
  doc.roundedRect(14, y, pageWidth - 28, 30, 4, 4, 'F');
  doc.setTextColor(220, 180, 50);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('$899 / Year', pageWidth / 2, y + 14, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Annual Consulting Membership — Personalized College Golf Recruiting', pageWidth / 2, y + 23, { align: 'center' });
  y += 38;

  // Why CFA section
  doc.setFillColor(102, 140, 115);
  doc.rect(14, y, pageWidth - 28, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('WHY COLLEGE FAIRWAY ADVISORS?', 18, y + 6.5);
  y += 14;

  const pillars = [
    ['Clarity', 'We simplify the recruiting process so families know exactly what to do and when.'],
    ['Advocacy', 'We connect you directly with college coaches and advocate for your student-athlete.'],
    ['Strategy', 'Every plan is customized to your academic profile, golf skills, and goals.'],
  ];

  doc.setTextColor(30, 50, 40);
  pillars.forEach((p) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${p[0]}:`, 18, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(p[1], 50, y + 5);
    y += 9;
  });

  y += 5;

  // Stats bar
  doc.setFillColor(245, 243, 239);
  doc.rect(14, y, pageWidth - 28, 14, 'F');
  doc.setTextColor(26, 46, 37);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('1,300+ College Programs', 30, y + 9);
  doc.text('D1 — NAIA All Divisions', pageWidth / 2 - 10, y + 9);
  doc.text('500+ Families Served', pageWidth - 55, y + 9);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('College Fairway Advisors  |  www.cfa.golf  |  info@cfa.golf', pageWidth / 2, pageHeight - 12, { align: 'center' });
  doc.text('Follow us on Instagram @collegefairwayadvisors', pageWidth / 2, pageHeight - 7, { align: 'center' });

  addWatermark(doc);
  doc.save('CFA_Marketing_Flyer.pdf');
};

// Export all generators in a map for easy access
export const pdfGenerators: Record<string, () => void> = {
  'target-schools': generateTargetSchoolList,
  'video-specs': generateVideoSpecs,
  'tournament-log': generateTournamentLog,
  'coach-tracker': generateCoachTracker,
  'pre-call-prep': generatePreCallPrep,
  'campus-visit': generateCampusVisit,
  'scholarship-calc': generateScholarshipCalc,
  'timeline': generateTimeline,
  'marketing-flyer': generateMarketingFlyer
};
