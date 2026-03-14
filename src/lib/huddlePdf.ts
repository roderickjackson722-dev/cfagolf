import jsPDF from 'jspdf';
import cfaWatermark from '@/assets/cfa-logo-watermark.jpg';
import { MODULES, LessonContent } from '@/data/huddleLessons';

const addWatermark = (doc: jsPDF) => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.saveGraphicsState();
  // @ts-ignore
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.addImage(cfaWatermark, 'PNG', (pw - 120) / 2, (ph - 80) / 2, 120, 80);
  doc.restoreGraphicsState();
};

const addHeader = (doc: jsPDF, title: string) => {
  const pw = doc.internal.pageSize.getWidth();
  doc.setFillColor(26, 46, 37);
  doc.rect(0, 0, pw, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pw / 2, 18, { align: 'center' });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text('College Fairway Advisors — The Recruiting Huddle', pw / 2, 26, { align: 'center' });
};

const addFooter = (doc: jsPDF) => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('© College Fairway Advisors. For personal use only.', pw / 2, ph - 8, { align: 'center' });
};

const renderLesson = (doc: jsPDF, lesson: LessonContent, startY: number): number => {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxW = pw - margin * 2;
  let y = startY;

  const checkPage = (needed: number) => {
    if (y + needed > ph - 20) {
      doc.addPage();
      addWatermark(doc);
      addFooter(doc);
      y = 20;
    }
  };

  // Lesson title
  checkPage(20);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 46, 37);
  doc.text(lesson.title, margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(lesson.description, margin, y);
  y += 8;

  // Content paragraphs
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  for (const para of lesson.content) {
    const lines = doc.splitTextToSize(para, maxW);
    for (const line of lines) {
      checkPage(5);
      doc.text(line, margin, y);
      y += 5;
    }
    y += 3;
  }

  // Key Takeaways
  checkPage(15);
  y += 2;
  doc.setFillColor(240, 247, 240);
  const boxH = 8 + lesson.keyTakeaways.length * 6;
  checkPage(boxH + 5);
  doc.roundedRect(margin, y - 3, maxW, boxH, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 46, 37);
  doc.text('Key Takeaways', margin + 4, y + 3);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  for (const t of lesson.keyTakeaways) {
    doc.text(`•  ${t}`, margin + 6, y);
    y += 6;
  }
  y += 6;

  return y;
};

export const generateHuddleLessonPDF = (lessonId?: string) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

  if (lessonId) {
    // Single lesson
    const lesson = MODULES.flatMap(m => m.lessons).find(l => l.id === lessonId);
    if (!lesson) return;
    addWatermark(doc);
    addHeader(doc, lesson.title);
    addFooter(doc);
    renderLesson(doc, lesson, 40);
    doc.save(`CFA-Huddle-${lesson.id}-${lesson.title.replace(/\s+/g, '-').substring(0, 30)}.pdf`);
  } else {
    // All lessons
    let first = true;
    for (const mod of MODULES) {
      for (const lesson of mod.lessons) {
        if (!first) doc.addPage();
        first = false;
        addWatermark(doc);
        addHeader(doc, mod.title);
        addFooter(doc);
        renderLesson(doc, lesson, 40);
      }
    }
    doc.save('CFA-Recruiting-Huddle-Complete.pdf');
  }
};
