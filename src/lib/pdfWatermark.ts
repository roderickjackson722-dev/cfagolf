import { PDFDocument, degrees } from 'pdf-lib';
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
 * Stamps the CFA logo as a low-opacity centered background watermark
 * on every page of the given PDF. Returns new PDF bytes.
 */
export async function watermarkPdf(input: ArrayBuffer | Uint8Array): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(input);
  const logoBytes = await getLogoBytes();
  const logo = await pdfDoc.embedPng(logoBytes);

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    // Scale logo to ~60% of page width
    const targetWidth = width * 0.6;
    const scale = targetWidth / logo.width;
    const logoW = logo.width * scale;
    const logoH = logo.height * scale;

    page.drawImage(logo, {
      x: (width - logoW) / 2,
      y: (height - logoH) / 2,
      width: logoW,
      height: logoH,
      opacity: 0.08,
      rotate: degrees(-20),
    });
  }

  return await pdfDoc.save();
}

export async function watermarkPdfFile(file: File): Promise<File> {
  const buf = await file.arrayBuffer();
  const stamped = await watermarkPdf(buf);
  return new File([stamped as BlobPart], file.name, { type: 'application/pdf' });
}
