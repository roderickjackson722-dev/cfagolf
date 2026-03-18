import jsPDF from 'jspdf';
import cfaWatermark from '@/assets/cfa-logo-watermark.jpg';

interface AgendaItem {
  topic: string;
  duration: string;
  details?: string[];
}

interface ModuleAgendaData {
  moduleNumber: number;
  title: string;
  totalDuration: string;
  objective: string;
  agenda: AgendaItem[];
  deliverables: string[];
  pageNumber?: string;
}

const addWatermark = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.saveGraphicsState();
  // @ts-ignore
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  const ww = 120, wh = 80;
  doc.addImage(cfaWatermark, 'JPEG', (pageWidth - ww) / 2, (pageHeight - wh) / 2, ww, wh);
  doc.restoreGraphicsState();
};

const addHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(26, 46, 37);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.addImage(cfaWatermark, 'JPEG', 10, 5, 30, 25);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 50, 22);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('College Fairway Advisors', 50, 28);
  doc.setTextColor(0, 0, 0);
};

const addFooter = (doc: jsPDF, pageNum: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('www.cfa.golf | College Fairway Advisors', pageWidth / 2, pageHeight - 10, { align: 'center' });
  doc.text(`Page ${pageNum}`, pageWidth - 20, pageHeight - 10);
};

const checkPageBreak = (doc: jsPDF, y: number, needed: number): number => {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 20) {
    doc.addPage();
    addWatermark(doc);
    return 45;
  }
  return y;
};

export function generateModuleAgendaPdf(modules: ModuleAgendaData[], programTitle: string) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Title page
  addWatermark(doc);
  doc.setFillColor(26, 46, 37);
  doc.rect(0, 0, pageWidth, 80, 'F');
  doc.addImage(cfaWatermark, 'JPEG', pageWidth / 2 - 25, 15, 50, 35);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(programTitle, pageWidth / 2, 65, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Session-by-Session Agenda Guide', pageWidth / 2, 73, { align: 'center' });

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(11);
  let ty = 95;
  doc.text('Table of Contents', margin, ty);
  ty += 8;
  doc.setFontSize(10);
  modules.forEach((m) => {
    const label = m.moduleNumber === 0 ? 'Intro' : `Module ${m.moduleNumber}`;
    doc.text(`${label}: ${m.title}`, margin + 5, ty);
    doc.text(m.totalDuration, pageWidth - margin, ty, { align: 'right' });
    ty += 6;
  });

  addFooter(doc, 1);

  // Each module on new page(s)
  let pageNum = 2;
  modules.forEach((module) => {
    doc.addPage();
    addWatermark(doc);
    const label = module.moduleNumber === 0 ? 'Introduction' : `Module ${module.moduleNumber}`;
    addHeader(doc, `${label}: ${module.title}`);

    let y = 45;

    // Objective
    doc.setFillColor(240, 245, 240);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 46, 37);
    doc.text('OBJECTIVE', margin + 4, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    const objLines = doc.splitTextToSize(module.objective, contentWidth - 8);
    doc.text(objLines, margin + 4, y + 10);
    y += 18;

    // Duration & page ref
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    let meta = `Duration: ${module.totalDuration}`;
    if (module.pageNumber) meta += ` · Roadmap Reference: ${module.pageNumber}`;
    doc.text(meta, margin, y);
    y += 8;

    // Agenda items
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 46, 37);
    doc.text('Session Agenda', margin, y);
    y += 6;

    module.agenda.forEach((item, idx) => {
      const detailCount = item.details?.length || 0;
      const neededHeight = 10 + detailCount * 4.5;
      y = checkPageBreak(doc, y, neededHeight);

      // Topic bar
      doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 248 : 255);
      doc.rect(margin, y - 3, contentWidth, 7, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(item.topic, margin + 3, y + 1);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(26, 46, 37);
      doc.text(item.duration, pageWidth - margin - 3, y + 1, { align: 'right' });
      y += 7;

      if (item.details) {
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        item.details.forEach((detail) => {
          y = checkPageBreak(doc, y, 5);
          const lines = doc.splitTextToSize(`• ${detail}`, contentWidth - 12);
          doc.text(lines, margin + 6, y);
          y += lines.length * 3.8;
        });
        y += 2;
      }
    });

    // Deliverables
    y = checkPageBreak(doc, y, 15 + module.deliverables.length * 5);
    y += 4;
    doc.setDrawColor(26, 46, 37);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 46, 37);
    doc.text('Session Deliverables', margin, y);
    y += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    module.deliverables.forEach((d) => {
      y = checkPageBreak(doc, y, 5);
      doc.text(`✓  ${d}`, margin + 3, y);
      y += 5;
    });

    addFooter(doc, pageNum);
    pageNum++;
  });

  return doc;
}
