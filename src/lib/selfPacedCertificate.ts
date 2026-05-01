// Completion certificate for the CFA Self-Paced Course.
// Renders a landscape-oriented certificate with the CFA logo and the
// student's name, then either downloads or returns a blob URL for preview.

import jsPDF from 'jspdf';
import cfaLogo from '@/assets/cfa-logo-certificate.jpeg';

interface CertificateInput {
  fullName: string;
  completionDate?: Date;
}

const buildCertificate = (input: CertificateInput): jsPDF => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Cream background
  doc.setFillColor(250, 247, 240);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer border (forest green)
  doc.setDrawColor(26, 46, 37);
  doc.setLineWidth(6);
  doc.rect(24, 24, pageWidth - 48, pageHeight - 48);

  // Inner thin border (sage)
  doc.setDrawColor(102, 140, 115);
  doc.setLineWidth(1);
  doc.rect(36, 36, pageWidth - 72, pageHeight - 72);

  // Watermark logo center
  doc.saveGraphicsState();
  // @ts-ignore
  doc.setGState(new doc.GState({ opacity: 0.06 }));
  const wmW = 320;
  const wmH = 320;
  doc.addImage(cfaLogo, 'JPEG', (pageWidth - wmW) / 2, (pageHeight - wmH) / 2, wmW, wmH);
  doc.restoreGraphicsState();

  // Top logo
  const logoSize = 90;
  doc.addImage(cfaLogo, 'JPEG', (pageWidth - logoSize) / 2, 56, logoSize, logoSize);

  // "Certificate of Completion"
  doc.setTextColor(26, 46, 37);
  doc.setFont('times', 'bold');
  doc.setFontSize(34);
  doc.text('Certificate of Completion', pageWidth / 2, 188, { align: 'center' });

  // Divider
  doc.setDrawColor(102, 140, 115);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 120, 200, pageWidth / 2 + 120, 200);

  // "This is to certify that"
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('This certificate is proudly presented to', pageWidth / 2, 230, { align: 'center' });

  // Recipient name
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(38);
  doc.setTextColor(26, 46, 37);
  doc.text(input.fullName, pageWidth / 2, 280, { align: 'center' });

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  const desc =
    'for successfully completing all 10 modules of the CFA Self-Paced Recruiting Course — mastering the academic, performance, brand, outreach, and decision frameworks required to compete for college golf.';
  const descLines = doc.splitTextToSize(desc, pageWidth - 200);
  doc.text(descLines, pageWidth / 2, 320, { align: 'center' });

  // Date + signature line
  const date = (input.completionDate ?? new Date()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const baseY = pageHeight - 100;

  // Date block
  doc.setDrawColor(26, 46, 37);
  doc.setLineWidth(0.8);
  doc.line(120, baseY, 280, baseY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 46, 37);
  doc.text('Date', 200, baseY + 16, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(date, 200, baseY - 8, { align: 'center' });

  // Signature block
  doc.setDrawColor(26, 46, 37);
  doc.line(pageWidth - 280, baseY, pageWidth - 120, baseY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 46, 37);
  doc.text('Rod Jackson, Founder', pageWidth - 200, baseY + 16, { align: 'center' });
  doc.setFont('times', 'italic');
  doc.setFontSize(16);
  doc.setTextColor(26, 46, 37);
  doc.text('Rod Jackson', pageWidth - 200, baseY - 6, { align: 'center' });

  // Footer brand
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(102, 140, 115);
  doc.text(
    'College Fairway Advisors  •  www.cfa.golf  •  Guiding the path to your future',
    pageWidth / 2,
    pageHeight - 50,
    { align: 'center' },
  );

  return doc;
};

export const downloadCompletionCertificate = (input: CertificateInput): void => {
  const doc = buildCertificate(input);
  const safe = input.fullName.replace(/[^a-z0-9]+/gi, '_');
  doc.save(`CFA_Certificate_${safe}.pdf`);
};

export const getCompletionCertificateBlobUrl = (input: CertificateInput): string => {
  const doc = buildCertificate(input);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
};
