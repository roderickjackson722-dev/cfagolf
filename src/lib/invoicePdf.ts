import jsPDF from 'jspdf';
import cfaWatermark from '@/assets/cfa-logo-watermark.jpg';

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number; // dollars
};

export type InvoiceData = {
  invoice_number: string;
  issue_date: string; // YYYY-MM-DD
  due_date: string;
  client_name: string;
  client_email: string;
  client_address?: string;
  notes?: string;
  items: InvoiceLineItem[];
  discount: number; // dollars
  tax_percent: number;
};

const FOREST = [26, 46, 37] as const;
const SAGE = [200, 192, 169] as const;

const money = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function calcInvoiceTotals(data: Pick<InvoiceData, 'items' | 'discount' | 'tax_percent'>) {
  const subtotal = data.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const discounted = Math.max(0, subtotal - (data.discount || 0));
  const tax = discounted * ((data.tax_percent || 0) / 100);
  const total = discounted + tax;
  return { subtotal, discounted, tax, total };
}

export function generateInvoicePdf(data: InvoiceData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Watermark
  doc.saveGraphicsState();
  // @ts-ignore
  doc.setGState(new doc.GState({ opacity: 0.06 }));
  const wmW = 140, wmH = 95;
  doc.addImage(cfaWatermark, 'JPEG', (pageW - wmW) / 2, (pageH - wmH) / 2, wmW, wmH);
  doc.restoreGraphicsState();

  // Header band
  doc.setFillColor(...FOREST);
  doc.rect(0, 0, pageW, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('INVOICE', 15, 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('College Fairway Advisors', pageW - 15, 14, { align: 'right' });
  doc.text('contact@cfa.golf  |  www.cfa.golf', pageW - 15, 20, { align: 'right' });

  // Invoice meta
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  let y = 44;
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice #', 15, y);
  doc.text('Issue Date', 70, y);
  doc.text('Due Date', 125, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.invoice_number, 15, y + 6);
  doc.text(data.issue_date, 70, y + 6);
  doc.text(data.due_date, 125, y + 6);

  // Bill to
  y = 64;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...FOREST);
  doc.text('BILL TO', 15, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 6;
  doc.text(data.client_name || '—', 15, y);
  if (data.client_email) doc.text(data.client_email, 15, y + 5);
  if (data.client_address) {
    const lines = doc.splitTextToSize(data.client_address, 90);
    doc.text(lines, 15, y + 10);
  }

  // Table header
  y = 95;
  doc.setFillColor(...FOREST);
  doc.rect(15, y, pageW - 30, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', 18, y + 6);
  doc.text('Qty', 130, y + 6, { align: 'right' });
  doc.text('Rate', 160, y + 6, { align: 'right' });
  doc.text('Amount', pageW - 18, y + 6, { align: 'right' });

  // Rows
  y += 13;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  data.items.forEach((it, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 246, 240);
      doc.rect(15, y - 5, pageW - 30, 10, 'F');
    }
    const descLines = doc.splitTextToSize(it.description || '—', 105);
    doc.text(descLines, 18, y);
    doc.text(String(it.quantity), 130, y, { align: 'right' });
    doc.text(money(it.unit_price), 160, y, { align: 'right' });
    doc.text(money(it.quantity * it.unit_price), pageW - 18, y, { align: 'right' });
    y += Math.max(10, descLines.length * 5);
    if (y > pageH - 60) {
      doc.addPage();
      y = 20;
    }
  });

  // Totals
  const totals = calcInvoiceTotals(data);
  y += 6;
  const tx = pageW - 70;
  doc.setDrawColor(...SAGE);
  doc.line(tx, y, pageW - 15, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal', tx, y);
  doc.text(money(totals.subtotal), pageW - 18, y, { align: 'right' });
  if (data.discount > 0) {
    y += 6;
    doc.text('Discount', tx, y);
    doc.text(`-${money(data.discount)}`, pageW - 18, y, { align: 'right' });
  }
  if (data.tax_percent > 0) {
    y += 6;
    doc.text(`Tax (${data.tax_percent}%)`, tx, y);
    doc.text(money(totals.tax), pageW - 18, y, { align: 'right' });
  }
  y += 8;
  doc.setFillColor(...FOREST);
  doc.rect(tx - 2, y - 5, pageW - 15 - (tx - 2), 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL DUE', tx, y + 1);
  doc.text(money(totals.total), pageW - 18, y + 1, { align: 'right' });

  // Notes
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y += 20;
  if (data.notes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', 15, y);
    doc.setFont('helvetica', 'normal');
    const nLines = doc.splitTextToSize(data.notes, pageW - 30);
    doc.text(nLines, 15, y + 5);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text(
    'College Fairway Advisors  •  contact@cfa.golf  •  www.cfa.golf',
    pageW / 2,
    pageH - 10,
    { align: 'center' },
  );

  return doc;
}
