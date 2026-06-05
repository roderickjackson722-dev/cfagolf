import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ResumeData } from '@/hooks/useStudentResume';

export function generateGolfResumePdf(r: ResumeData): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pw = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  // Header
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text(r.fullName || 'Student Name', pw / 2, y, { align: 'center' });
  y += 18;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  const contact = [r.cityState, r.phone, r.email].filter(Boolean).join('  |  ');
  if (contact) {
    doc.text(contact, pw / 2, y, { align: 'center' });
    y += 12;
  }
  if (r.jgsLink) {
    doc.setTextColor(0, 0, 200);
    doc.textWithLink(r.jgsLink, pw / 2, y, { url: r.jgsLink, align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 12;
  }
  y += 4;
  doc.setDrawColor(0);
  doc.line(margin, y, pw - margin, y);
  y += 14;

  const sectionTitle = (title: string) => {
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text(title.toUpperCase(), margin, y);
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pw - margin, y);
    y += 12;
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
  };

  const kv = (pairs: [string, string][]) => {
    const colW = (pw - margin * 2) / 2;
    let row = 0;
    for (let i = 0; i < pairs.length; i += 2) {
      const left = pairs[i];
      const right = pairs[i + 1];
      if (left) {
        doc.setFont('times', 'bold');
        doc.text(`${left[0]}:`, margin, y);
        doc.setFont('times', 'normal');
        doc.text(left[1] || '—', margin + 110, y);
      }
      if (right) {
        doc.setFont('times', 'bold');
        doc.text(`${right[0]}:`, margin + colW, y);
        doc.setFont('times', 'normal');
        doc.text(right[1] || '—', margin + colW + 110, y);
      }
      y += 14;
      row++;
    }
  };

  // Academic
  sectionTitle('Academic Profile');
  kv([
    ['High School', [r.highSchool, r.highSchoolCityState].filter(Boolean).join(', ')],
    ['Graduation', r.graduationYear],
    ['GPA', r.gpa],
    ['SAT / ACT', [r.sat && `SAT ${r.sat}`, r.act && `ACT ${r.act}`].filter(Boolean).join(' · ')],
    ['NCAA ID', r.ncaaId],
    ['Intended Major', r.intendedMajor],
  ]);
  if (r.apHonorsCourses) {
    doc.setFont('times', 'bold');
    doc.text('AP/Honors:', margin, y);
    doc.setFont('times', 'normal');
    const lines = doc.splitTextToSize(r.apHonorsCourses, pw - margin * 2 - 80);
    doc.text(lines, margin + 80, y);
    y += lines.length * 12;
  }
  y += 6;

  // Athletic
  sectionTitle('Athletic Profile');
  kv([
    ['Scoring Avg (18)', r.scoringAverage],
    ['Scoring Avg (9)', r.scoringAverage9],
    ['Handicap Index', r.handicap],
    ['Driving Distance', r.drivingDistance],
    ['Fairways Hit %', r.fairwaysHitPercent],
    ['GIR %', r.greensInRegPercent],
    ['Putts/Round', r.puttsPerRound],
  ]);
  y += 6;

  // Tournament Results
  if (r.tournamentResults.length) {
    sectionTitle('Key Tournament Results');
    autoTable(doc, {
      startY: y,
      head: [['Tournament', 'Date', 'Score', 'Finish', 'Field']],
      body: r.tournamentResults.map(t => [t.tournament, t.date, t.score, t.finish, t.fieldSize]),
      theme: 'grid',
      headStyles: { fillColor: [40, 60, 40], textColor: 255, font: 'times' },
      styles: { font: 'times', fontSize: 9, cellPadding: 4 },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Summary
  const s = r.tournamentSummary;
  if (s.totalTournaments || s.wins || s.top10Finishes) {
    sectionTitle('Tournament Summary');
    kv([
      ['Total Tournaments', s.totalTournaments],
      ['Wins', s.wins],
      ['Top 5 Finishes', s.top5Finishes],
      ['Top 10 Finishes', s.top10Finishes],
      ['Avg (Last 10)', s.avgLast10Scores],
    ]);
    y += 6;
  }

  // Upcoming
  if (r.upcomingSchedule.length) {
    sectionTitle('Upcoming Schedule');
    autoTable(doc, {
      startY: y,
      head: [['Event', 'Course', 'Location', 'Date']],
      body: r.upcomingSchedule.map(u => [u.eventName, u.course, u.cityState, u.date]),
      theme: 'grid',
      headStyles: { fillColor: [40, 60, 40], textColor: 255, font: 'times' },
      styles: { font: 'times', fontSize: 9, cellPadding: 4 },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Videos
  const v = r.videoLinks;
  const vids = [
    ['Highlight Reel', v.highlightReel],
    ['Swing Video', v.swingVideo],
    ['Course Management', v.courseManagement],
    ['Short Game', v.shortGame],
  ].filter(([, url]) => !!url);
  if (vids.length) {
    sectionTitle('Video Links');
    vids.forEach(([label, url]) => {
      if (y > 740) { doc.addPage(); y = margin; }
      doc.setFont('times', 'bold');
      doc.text(`${label}:`, margin, y);
      doc.setFont('times', 'normal');
      doc.setTextColor(0, 0, 200);
      doc.textWithLink(url, margin + 110, y, { url });
      doc.setTextColor(0, 0, 0);
      y += 14;
    });
    y += 4;
  }

  // References
  if (r.references.length) {
    if (y > 680) { doc.addPage(); y = margin; }
    sectionTitle('References');
    autoTable(doc, {
      startY: y,
      head: [['Name', 'Title', 'Phone', 'Email']],
      body: r.references.map(rf => [rf.name, rf.title, rf.phone, rf.email]),
      theme: 'grid',
      headStyles: { fillColor: [40, 60, 40], textColor: 255, font: 'times' },
      styles: { font: 'times', fontSize: 9, cellPadding: 4 },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  const longText = (title: string, text: string) => {
    if (!text) return;
    if (y > 700) { doc.addPage(); y = margin; }
    sectionTitle(title);
    const lines = doc.splitTextToSize(text, pw - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 12 + 8;
  };

  longText('Awards & Honors', r.awardsHonors);
  longText('Community Service', r.communityService);
  longText('Extracurriculars', r.extracurriculars);
  longText('Why I Want to Play College Golf', r.personalStatement);

  // Footer with CFA branding on every page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text('College Fairway Advisors  |  www.cfa.golf', pw / 2, 770, { align: 'center' });
    doc.text(`Page ${i} of ${pages}`, pw - margin, 770, { align: 'right' });
    doc.setTextColor(0);
  }

  return doc;
}

export function downloadResumePdf(r: ResumeData) {
  const doc = generateGolfResumePdf(r);
  const safe = (r.fullName || 'Student').replace(/[^a-z0-9]+/gi, '_');
  doc.save(`${safe}_Golf_Resume.pdf`);
}
