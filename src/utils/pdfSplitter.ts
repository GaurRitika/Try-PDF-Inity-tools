import { PDFDocument } from 'pdf-lib';

export interface PageSelection {
  pageNumber: number;
  selected: boolean;
}

export const loadPdfPages = async (file: File): Promise<{ pageCount: number; pdfBytes: Uint8Array }> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfBytes = new Uint8Array(arrayBuffer);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();
  
  return { pageCount, pdfBytes };
};

export const generatePageThumbnails = async (file: File): Promise<string[]> => {
  // In a real implementation, you would render each page to canvas
  // For now, we'll return placeholder thumbnails
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();
  
  // Return empty array - thumbnails would require pdf.js or similar
  return Array(pageCount).fill('');
};

export const splitPdfByPages = async (
  pdfBytes: Uint8Array,
  selectedPages: number[]
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const newPdfDoc = await PDFDocument.create();
  
  for (const pageIndex of selectedPages) {
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
    newPdfDoc.addPage(copiedPage);
  }
  
  return await newPdfDoc.save();
};

export const splitPdfByRanges = async (
  pdfBytes: Uint8Array,
  ranges: { start: number; end: number }[]
): Promise<Uint8Array[]> => {
  const results: Uint8Array[] = [];
  
  for (const range of ranges) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdfDoc = await PDFDocument.create();
    
    for (let i = range.start; i <= range.end; i++) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);
    }
    
    const pdfData = await newPdfDoc.save();
    results.push(pdfData);
  }
  
  return results;
};

export const splitPdfIntoSinglePages = async (pdfBytes: Uint8Array): Promise<Uint8Array[]> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();
  const results: Uint8Array[] = [];
  
  for (let i = 0; i < pageCount; i++) {
    const newPdfDoc = await PDFDocument.create();
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
    newPdfDoc.addPage(copiedPage);
    const pdfData = await newPdfDoc.save();
    results.push(pdfData);
  }
  
  return results;
};

export const downloadPdf = (pdfBytes: Uint8Array, filename: string) => {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
