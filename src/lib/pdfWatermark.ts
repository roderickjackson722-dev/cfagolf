import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib';
import watermarkAsset from '@/assets/cfa-watermark.png.asset.json';

let cachedLogoBytes: Uint8Array | null = null;

async function getLogoBytes(): Promise<Uint8Array> {
  if (cachedLogoBytes) return cachedLogoBytes;
  const res = await fetch(watermarkAsset.url);
  if (!res.ok) throw new Error('Failed to load watermark logo');
  const buf = await res.arrayBuffer();
  cachedLogoBytes = new Uint8Array(buf);
  return cachedLogoBytes;
}

/**
 * Stamps the CFA logo + "COLLEGE FAIRWAY ADVISORS" text as a visible
 * diagonal watermark on every page of the given PDF.
 */
export async function watermarkPdf(input: ArrayBuffer | Uint8Array): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(input);
  const logoBytes = await getLogoBytes();
  const logo = await pdfDoc.embedPng(logoBytes);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();

    // Centered logo watermark
    const targetWidth = width * 0.7;
    const scale = targetWidth / logo.width;
    const logoW = logo.width * scale;
    const logoH = logo.height * scale;

    page.drawImage(logo, {
      x: (width - logoW) / 2,
      y: (height - logoH) / 2,
      width: logoW,
      height: logoH,
      opacity: 0.18,
      rotate: degrees(-30),
    });

    // Diagonal text watermark — guarantees visibility even on text-heavy pages
    const text = 'COLLEGE FAIRWAY ADVISORS  •  CFA.GOLF';
    const fontSize = Math.max(28, width * 0.045);
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    // Draw a few repeating diagonal stripes
    const stripes = 3;
    for (let i = 0; i < stripes; i++) {
      const yPos = (height / (stripes + 1)) * (i + 1);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: yPos,
        size: fontSize,
        font,
        color: rgb(0.08, 0.25, 0.15), // forest green
        opacity: 0.12,
        rotate: degrees(-30),
      });
    }
  }

  return await pdfDoc.save();
}

export async function watermarkPdfFile(file: File): Promise<File> {
  const buf = await file.arrayBuffer();
  const stamped = await watermarkPdf(buf);
  return new File([stamped as BlobPart], file.name, { type: 'application/pdf' });
}
