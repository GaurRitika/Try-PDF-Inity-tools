import * as pdfjs from 'pdfjs-dist';
import JSZip from 'jszip';

// Set up the worker using CDN
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

export type QualityLevel = 'low' | 'medium' | 'high';

const qualitySettings: Record<QualityLevel, { scale: number; quality: number }> = {
  low: { scale: 1, quality: 0.6 },
  medium: { scale: 1.5, quality: 0.8 },
  high: { scale: 2, quality: 0.95 },
};

export interface PageInfo {
  pageNumber: number;
  selected: boolean;
}

export interface ConvertedImage {
  pageNumber: number;
  blob: Blob;
  url: string;
}

export interface PdfDocument {
  numPages: number;
  getPage: (pageNum: number) => Promise<any>;
}

export const loadPdfForConversion = async (file: File): Promise<{ pageCount: number; pdfDoc: PdfDocument }> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  return { pageCount: pdfDoc.numPages, pdfDoc: pdfDoc as PdfDocument };
};

export const convertPageToJpg = async (
  pdfDoc: PdfDocument,
  pageNumber: number,
  quality: QualityLevel = 'high'
): Promise<ConvertedImage> => {
  const page = await pdfDoc.getPage(pageNumber);
  const settings = qualitySettings[quality];
  const viewport = page.getViewport({ scale: settings.scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not create canvas context');
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve({ pageNumber, blob, url });
        } else {
          reject(new Error(`Failed to convert page ${pageNumber}`));
        }
      },
      'image/jpeg',
      settings.quality
    );
  });
};

export const convertPdfToJpg = async (
  pdfDoc: PdfDocument,
  selectedPages: number[],
  quality: QualityLevel = 'high',
  onProgress?: (current: number, total: number) => void
): Promise<ConvertedImage[]> => {
  const images: ConvertedImage[] = [];
  const total = selectedPages.length;

  for (let i = 0; i < selectedPages.length; i++) {
    const pageNumber = selectedPages[i];
    const image = await convertPageToJpg(pdfDoc, pageNumber, quality);
    images.push(image);
    onProgress?.(i + 1, total);
  }

  return images;
};

export const downloadSingleImage = (image: ConvertedImage, fileName: string) => {
  const link = document.createElement('a');
  link.href = image.url;
  link.download = `${fileName}_page_${image.pageNumber}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadImagesAsZip = async (
  images: ConvertedImage[],
  fileName: string
): Promise<void> => {
  const zip = new JSZip();

  for (const image of images) {
    zip.file(`${fileName}_page_${image.pageNumber}.jpg`, image.blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}_images.zip`;
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
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const cleanupImages = (images: ConvertedImage[]) => {
  images.forEach((image) => URL.revokeObjectURL(image.url));
};
