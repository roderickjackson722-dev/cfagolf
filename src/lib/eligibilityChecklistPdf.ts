import jsPDF from 'jspdf';
import cfaLogo from '@/assets/cfa-logo-watermark.jpg';

const addWatermark = (doc: jsPDF) => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.saveGraphicsState();
  // @ts-ignore
  doc.setGState(new doc.GState({ opacity: 0.06 }));
  const ww = 100;
  const wh = 60;
  doc.addImage(cfaLogo, 'JPEG', (pw - ww) / 2, (ph - wh) / 2, ww, wh);
  doc.restoreGraphicsState();
};

export function generateEligibilityChecklistPdf() {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Watermark on first page
  addWatermark(doc);

  // Header
  doc.setFillColor(26, 55, 46); // cfa-dark-green
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('College Golf Eligibility Checklist', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('College Fairway Advisors  •  cfagolf.com', pageWidth / 2, 30, { align: 'center' });

  y = 52;
  doc.setTextColor(30, 30, 30);

  const sections = [
    {
      title: 'NCAA Division I & II Requirements',
      items: [
        'Complete 16 core courses (D1) or 16 core courses (D2)',
        'Earn minimum 2.3 GPA in core courses (D1) or 2.2 GPA (D2)',
        'Earn qualifying ACT/SAT score on the sliding scale',
        'Register with NCAA Eligibility Center at eligibilitycenter.org',
        'Request official transcript be sent to NCAA Eligibility Center',
        'Request ACT/SAT scores sent directly (use code 9999)',
        'Complete amateurism questionnaire before competition',
      ],
    },
    {
      title: 'NCAA Division III',
      items: [
        'No NCAA Eligibility Center registration required',
        'Meet school-specific admission requirements',
        'Maintain full-time enrollment status',
        'Verify with each school about their academic minimums',
      ],
    },
    {
      title: 'NAIA Requirements',
      items: [
        'Register with NAIA Eligibility Center at playnaia.org',
        'Meet 2 of 3: GPA ≥ 2.0, ACT ≥ 18 / SAT ≥ 970, top 50% of class',
        'Graduate from an accredited high school',
        'Request official transcripts and test scores be sent to NAIA',
      ],
    },
    {
      title: 'JUCO (NJCAA) Requirements',
      items: [
        'Graduate from high school or earn GED',
        'Meet individual college admission requirements',
        'Complete NJCAA eligibility paperwork through the school',
        'Verify transfer credit policies if transferring later',
      ],
    },
    {
      title: 'Timeline Reminders',
      items: [
        'Freshman year: Start building core course plan with counselor',
        'Sophomore year: Register with eligibility center, take PSAT/PreACT',
        'Junior year: Take SAT/ACT, begin contacting coaches',
        'Senior year: Submit final transcripts, confirm eligibility, sign NLI',
      ],
    },
  ];

  for (const section of sections) {
    if (y > 250) {
      doc.addPage();
      addWatermark(doc);
      y = 20;
    }

    // Section title
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 55, 46);
    doc.text(section.title, margin, y);
    y += 7;

    // Checklist items
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);

    for (const item of section.items) {
      if (y > 275) {
        doc.addPage();
        addWatermark(doc);
        y = 20;
      }
      // Checkbox
      doc.rect(margin, y - 3.5, 4, 4);
      const lines = doc.splitTextToSize(item, pageWidth - margin * 2 - 8);
      doc.text(lines, margin + 7, y);
      y += lines.length * 5 + 3;
    }

    y += 5;
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('© College Fairway Advisors  |  www.cfa.golf', pageWidth / 2, 288, { align: 'center' });

  doc.save('College-Golf-Eligibility-Checklist.pdf');
}
