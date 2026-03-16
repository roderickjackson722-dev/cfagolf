import JSZip from 'jszip';
import jsPDF from 'jspdf';
import cfaWatermark from '@/assets/cfa-logo-watermark.jpg';
import { MODULES } from '@/data/huddleLessons';
import { EMAIL_TEMPLATES } from '@/data/emailTemplates';

/**
 * Generates all toolkit PDFs and bundles them into a single ZIP download.
 * Re-implements the PDF generation inline to capture ArrayBuffers instead of triggering saves.
 */
export const downloadToolkitBundle = async () => {
  const zip = new JSZip();

  // 1. Recruiting Roadmap PDF
  zip.file('CFA-Recruiting-Roadmap.pdf', generateRoadmapBlob());

  // 2. Athlete Resume PDF
  zip.file('CFA-Athlete-Resume-Template.pdf', generateResumeBlob());

  // 3. Recruiting Timeline (all lessons)
  zip.file('CFA-Recruiting-Timeline-Complete.pdf', generateTimelineBlob());

  // 4. Email Templates PDF
  zip.file('CFA-Email-Templates.pdf', generateEmailTemplatesBlob());

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'CFA-Recruiting-Toolkit.zip';
  a.click();
  URL.revokeObjectURL(url);
};

// ---- Internal helpers (mirrored from pdfTemplates.ts / huddlePdf.ts) ----

function addWatermark(doc: jsPDF) {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.saveGraphicsState();
  // @ts-ignore
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.addImage(cfaWatermark, 'JPEG', (pw - 120) / 2, (ph - 80) / 2, 120, 80);
  doc.restoreGraphicsState();
}

function addHeader(doc: jsPDF, title: string) {
  const pw = doc.internal.pageSize.getWidth();
  doc.setFillColor(26, 46, 37);
  doc.rect(0, 0, pw, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pw / 2, 20, { align: 'center' });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text('College Fairway Advisors | www.cfa.golf', pw / 2, 30, { align: 'center' });
}

function addFooter(doc: jsPDF) {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('© College Fairway Advisors — www.cfa.golf', pw / 2, ph - 8, { align: 'center' });
}

function addSectionHeader(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 46, 37);
  doc.text(title, 14, y);
  y += 2;
  doc.setDrawColor(26, 46, 37);
  doc.setLineWidth(0.5);
  doc.line(14, y, 80, y);
  return y + 6;
}

// ---- Roadmap ----
function generateRoadmapBlob(): ArrayBuffer {
  const doc = new jsPDF();
  addWatermark(doc);
  addHeader(doc, 'The Recruiting Roadmap');

  let y = 45;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const intro = doc.splitTextToSize(
    'Your complete step-by-step guide to navigating the college golf recruiting process from start to finish.',
    170
  );
  doc.text(intro, 14, y);
  y += intro.length * 6 + 6;

  const phases = [
    { title: 'Phase 1: Self-Assessment & Research', items: ['Evaluate your current skill level honestly (handicap, scoring average, tournament results)', 'Research NCAA divisions and understand the differences (D1, D2, D3, NAIA, JUCO)', 'Create a list of 20-30 potential schools based on academics, location, and golf program strength', 'Understand NCAA eligibility requirements and the Eligibility Center registration process'] },
    { title: 'Phase 2: Build Your Recruiting Profile', items: ['Create a comprehensive athlete resume (use the included template)', 'Film and edit a highlight reel showcasing your swing, short game, and on-course management', 'Set up a recruiting profile on platforms coaches actually use', 'Gather your academic transcripts, test scores, and letters of recommendation'] },
    { title: 'Phase 3: Coach Outreach Strategy', items: ['Draft personalized emails to coaches (use the included 15 email templates)', 'Follow up strategically — timing matters more than frequency', 'Attend college camps and showcases to get face time with coaches', 'Leverage your high school or club coach for introductions'] },
    { title: 'Phase 4: Campus Visits & Evaluation', items: ['Schedule unofficial and official visits to your top schools', 'Prepare questions to ask coaches, players, and academic advisors', 'Evaluate team culture, facilities, practice schedules, and academic support', 'Compare financial aid packages and scholarship offers'] },
    { title: 'Phase 5: Decision & Commitment', items: ['Narrow your list to 3-5 serious contenders', 'Negotiate scholarship offers and understand the full cost of attendance', 'Make your verbal commitment and sign your National Letter of Intent', 'Prepare for the transition to college golf with a training plan'] },
  ];

  phases.forEach((phase, idx) => {
    const est = 12 + phase.items.length * 8;
    if (y + est > 270) { doc.addPage(); addWatermark(doc); addFooter(doc); y = 20; }
    y = addSectionHeader(doc, `${idx + 1}. ${phase.title}`, y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    phase.items.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item}`, 170);
      if (y + lines.length * 5 > 270) { doc.addPage(); addWatermark(doc); addFooter(doc); y = 20; }
      doc.text(lines, 16, y);
      y += lines.length * 5 + 2;
    });
    y += 4;
  });

  addFooter(doc);
  return doc.output('arraybuffer');
}

// ---- Resume ----
function generateResumeBlob(): ArrayBuffer {
  const doc = new jsPDF();
  addWatermark(doc);
  addHeader(doc, 'Athlete Resume Template');

  let y = 45;
  const pw = doc.internal.pageSize.getWidth();

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 46, 37);
  doc.text('[YOUR FULL NAME]', pw / 2, y, { align: 'center' });
  y += 7;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Class of [Graduation Year]', pw / 2, y, { align: 'center' });
  y += 5;
  doc.text('[City, State] • [Phone Number] • [Email Address]', pw / 2, y, { align: 'center' });
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, pw - 14, y);
  y += 8;

  const sections = [
    { title: 'PERSONAL INFORMATION', rows: ['Date of Birth: [MM/DD/YYYY]', 'Height: [X\'X"]     Weight: [XXX lbs]', 'Dominant Hand: [Right/Left]', 'High School: [School Name]', 'Club/Travel Team: [Team Name]'] },
    { title: 'ACADEMIC PROFILE', rows: ['GPA: [X.XX] (Weighted/Unweighted)', 'SAT: [Score]  |  ACT: [Score]', 'Intended Major: [Major]', 'Honors/AP Courses: [List courses]'] },
    { title: 'GOLF STATISTICS', rows: ['Current Handicap: [X.X]', '18-Hole Avg: [XX.X]     Low 18: [Score]', 'Low 9: [Score]', 'Avg. Driving Distance: [XXX yds]', 'Avg. Putts/Round: [XX]'] },
    { title: 'NOTABLE TOURNAMENT RESULTS', rows: ['[Tournament — Date]  Score: [Score]  Finish: [T-Xth / XXX players]', '[Tournament — Date]  Score: [Score]  Finish: [T-Xth / XXX players]', '[Tournament — Date]  Score: [Score]  Finish: [T-Xth / XXX players]'] },
    { title: 'AWARDS & ACHIEVEMENTS', rows: ['[All-Region / All-State / All-Conference honors]', '[Junior Tour rankings or titles]', '[Academic awards: Honor Roll, NHS, etc.]', '[Community service or leadership roles]'] },
    { title: 'REFERENCES', rows: ['[Coach Name] — [Title] — [Org] | [Phone] | [Email]', '[Teacher Name] — [Title] — [School] | [Phone] | [Email]'] },
  ];

  sections.forEach(section => {
    const sH = 12 + section.rows.length * 8;
    if (y + sH > 270) { doc.addPage(); addWatermark(doc); addFooter(doc); y = 20; }
    y = addSectionHeader(doc, section.title, y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    section.rows.forEach((row, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(14, y - 4, 182, 7, 'F');
      }
      doc.text(row, 16, y);
      y += 7;
    });
    y += 4;
  });

  addFooter(doc);
  return doc.output('arraybuffer');
}

// ---- Timeline (all lessons) ----
function generateTimelineBlob(): ArrayBuffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const margin = 15;
  const pw = doc.internal.pageSize.getWidth();
  const maxW = pw - margin * 2;

  let first = true;
  for (const mod of MODULES) {
    for (const lesson of mod.lessons) {
      if (!first) doc.addPage();
      first = false;

      addWatermark(doc);

      // header
      doc.setFillColor(26, 46, 37);
      doc.rect(0, 0, pw, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(lesson.title, pw / 2, 18, { align: 'center' });
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(8);
      doc.text('College Fairway Advisors — The Recruiting Timeline', pw / 2, 26, { align: 'center' });

      addFooter(doc);

      let y = 40;

      // Content paragraphs
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      for (const paragraph of lesson.content) {
        const lines = doc.splitTextToSize(paragraph, maxW);
        if (y + lines.length * 5 > 260) { doc.addPage(); addWatermark(doc); addFooter(doc); y = 20; }
        doc.text(lines, margin, y);
        y += lines.length * 5 + 4;
      }
      y += 4;

      // Key Takeaways
      if (lesson.keyTakeaways && lesson.keyTakeaways.length > 0) {
        if (y + 20 > 260) { doc.addPage(); addWatermark(doc); addFooter(doc); y = 20; }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 46, 37);
        doc.text('Key Takeaways', margin, y);
        y += 6;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        for (const kt of lesson.keyTakeaways) {
          const lines = doc.splitTextToSize(`•  ${kt}`, maxW - 6);
          if (y + lines.length * 5 > 260) { doc.addPage(); addWatermark(doc); addFooter(doc); y = 20; }
          doc.text(lines, margin + 4, y);
          y += lines.length * 5 + 2;
        }
      }
    }
  }

  return doc.output('arraybuffer');
}

// ---- Email Templates ----
function generateEmailTemplatesBlob(): ArrayBuffer {
  const doc = new jsPDF();
  const margin = 15;
  const pw = doc.internal.pageSize.getWidth();
  const maxW = pw - margin * 2;

  addWatermark(doc);
  addHeader(doc, '15 Coach Email Templates');

  let y = 45;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const intro = doc.splitTextToSize(
    'Proven email templates for every stage of the college golf recruiting process. Customize the bracketed fields with your information before sending.',
    maxW
  );
  doc.text(intro, margin, y);
  y += intro.length * 6 + 8;

  let templateNum = 0;
  for (const category of EMAIL_TEMPLATES) {
    if (y + 20 > 265) { doc.addPage(); addWatermark(doc); addFooter(doc); y = 20; }
    y = addSectionHeader(doc, category.category, y);
    y += 2;

    for (const template of category.templates) {
      templateNum++;
      const titleLine = `${templateNum}. ${template.title}`;
      const subjectLine = `Subject: ${template.subject}`;
      const bodyLines = doc.splitTextToSize(template.body, maxW - 8);
      const estHeight = 18 + bodyLines.length * 4.5;

      if (y + Math.min(estHeight, 60) > 265) {
        doc.addPage(); addWatermark(doc); addFooter(doc); y = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 46, 37);
      doc.text(titleLine, margin, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text(subjectLine, margin, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      const boxHeight = bodyLines.length * 4.5 + 4;
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(margin, y - 3, maxW, boxHeight, 2, 2, 'F');

      for (const line of bodyLines) {
        if (y + 5 > 270) { doc.addPage(); addWatermark(doc); addFooter(doc); y = 20; }
        doc.text(line, margin + 4, y);
        y += 4.5;
      }
      y += 8;
    }
    y += 4;
  }

  addFooter(doc);
  return doc.output('arraybuffer');
}
