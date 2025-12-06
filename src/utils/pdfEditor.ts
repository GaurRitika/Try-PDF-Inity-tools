import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path - use specific version that matches pdfjs-dist 4.0.379
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

export interface TextAnnotation {
  id: string;
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  pageIndex: number;
}

export interface HighlightAnnotation {
  id: string;
  type: 'highlight';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  pageIndex: number;
}

export interface DrawAnnotation {
  id: string;
  type: 'draw';
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  pageIndex: number;
}

export interface ShapeAnnotation {
  id: string;
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'arrow';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  pageIndex: number;
}

export interface ImageAnnotation {
  id: string;
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  imageData: string;
  pageIndex: number;
}

export type Annotation = TextAnnotation | HighlightAnnotation | DrawAnnotation | ShapeAnnotation | ImageAnnotation;

export interface ExtractedTextItem {
  id: string;
  text: string;
  x: number;
  y: number; // Canvas Y coordinate (for overlay positioning)
  pdfY?: number; // Original PDF Y coordinate (for saving)
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  pageIndex: number;
  transform: number[];
  isEdited: boolean;
  originalText: string;
}

export interface PageInfo {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
  thumbnail?: string;
}

export const loadPdfDocument = async (file: File): Promise<{ pdfBytes: Uint8Array; pageCount: number; pages: PageInfo[] }> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfBytes = new Uint8Array(arrayBuffer);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();
  
  const pages: PageInfo[] = [];
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    pages.push({
      pageNumber: i + 1,
      width,
      height,
      rotation: page.getRotation().angle,
    });
  }
  
  return { pdfBytes, pageCount, pages };
};

export const renderPageToCanvas = async (
  pdfBytes: Uint8Array,
  pageIndex: number,
  scale: number = 1.5
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> => {
  // Create a copy of the bytes to avoid issues with detached buffers
  const pdfData = new Uint8Array(pdfBytes);
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageIndex + 1);
  
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Could not get canvas context');
  }
  
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  
  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;
  
  return { canvas, width: viewport.width, height: viewport.height };
};

export const generateThumbnails = async (pdfBytes: Uint8Array, pageCount: number): Promise<string[]> => {
  const thumbnails: string[] = [];
  
  try {
    // Create a copy of the bytes to avoid issues with detached buffers
    const pdfData = new Uint8Array(pdfBytes);
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    
    for (let i = 0; i < pageCount; i++) {
      try {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          thumbnails.push('');
          continue;
        }
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
        
        thumbnails.push(canvas.toDataURL('image/jpeg', 0.7));
      } catch (pageError) {
        console.error(`Error generating thumbnail for page ${i + 1}:`, pageError);
        thumbnails.push('');
      }
    }
  } catch (error) {
    console.error('Error loading PDF for thumbnails:', error);
    // Return empty thumbnails array if PDF loading fails
    return Array(pageCount).fill('');
  }
  
  return thumbnails;
};

// Extract text items from a PDF page with position information
export const extractTextFromPage = async (
  pdfBytes: Uint8Array,
  pageIndex: number
): Promise<ExtractedTextItem[]> => {
  const pdfData = new Uint8Array(pdfBytes);
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageIndex + 1);
  const textContent = await page.getTextContent();
  const viewport = page.getViewport({ scale: 1 });
  
  const textItems: ExtractedTextItem[] = [];
  
  for (const item of textContent.items) {
    if ('str' in item && item.str.trim()) {
      const tx = item.transform;
      // Transform array: [scaleX, skewX, skewY, scaleY, translateX, translateY]
      const fontSize = Math.sqrt(tx[0] * tx[0] + tx[1] * tx[1]);
      const x = tx[4];
      const canvasY = viewport.height - tx[5]; // For canvas overlay positioning
      const pdfY = tx[5]; // Original PDF Y coordinate for saving
      
      textItems.push({
        id: generateId(),
        text: item.str,
        x,
        y: canvasY,
        pdfY, // Store original PDF Y for accurate saving
        width: item.width || fontSize * item.str.length * 0.6,
        height: fontSize * 1.2,
        fontSize,
        fontName: item.fontName || 'Helvetica',
        pageIndex,
        transform: tx,
        isEdited: false,
        originalText: item.str,
      });
    }
  }
  
  return textItems;
};

// Extract all text from all pages
export const extractAllText = async (
  pdfBytes: Uint8Array,
  pageCount: number
): Promise<ExtractedTextItem[]> => {
  const allText: ExtractedTextItem[] = [];
  
  for (let i = 0; i < pageCount; i++) {
    try {
      const pageText = await extractTextFromPage(pdfBytes, i);
      allText.push(...pageText);
    } catch (error) {
      console.error(`Error extracting text from page ${i + 1}:`, error);
    }
  }
  
  return allText;
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
};

export const applyAnnotationsAndSave = async (
  pdfBytes: Uint8Array,
  annotations: Annotation[],
  pageOrder: number[],
  deletedPages: number[],
  rotations: { [pageIndex: number]: number },
  editedTextItems?: ExtractedTextItem[]
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Apply rotations
  for (const [pageIndexStr, rotation] of Object.entries(rotations)) {
    const pageIndex = parseInt(pageIndexStr);
    if (!deletedPages.includes(pageIndex)) {
      const page = pdfDoc.getPage(pageIndex);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotation));
    }
  }
  
  // Apply edited text items - draw white rectangles to cover original text, then draw new text
  if (editedTextItems && editedTextItems.length > 0) {
    for (const textItem of editedTextItems) {
      if (!textItem.isEdited || deletedPages.includes(textItem.pageIndex)) continue;
      
      const page = pdfDoc.getPage(textItem.pageIndex);
      const { height: pageHeight } = page.getSize();
      
      // Use pdfY if available, otherwise calculate from canvas Y
      const originalPdfY = textItem.pdfY !== undefined ? textItem.pdfY : (pageHeight - textItem.y);
      
      // Cover original text with white rectangle
      // Position the rectangle at the baseline minus a bit for descenders
      page.drawRectangle({
        x: textItem.x - 2,
        y: originalPdfY - textItem.fontSize * 0.3,
        width: textItem.width + 4,
        height: textItem.fontSize * 1.3,
        color: rgb(1, 1, 1),
      });
      
      // Draw new text at the original baseline position
      page.drawText(textItem.text, {
        x: textItem.x,
        y: originalPdfY,
        size: textItem.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }
  }
  
  // Apply annotations
  for (const annotation of annotations) {
    if (deletedPages.includes(annotation.pageIndex)) continue;
    
    const page = pdfDoc.getPage(annotation.pageIndex);
    const { height: pageHeight } = page.getSize();
    
    switch (annotation.type) {
      case 'text': {
        const color = hexToRgb(annotation.color);
        page.drawText(annotation.text, {
          x: annotation.x,
          y: pageHeight - annotation.y - annotation.fontSize,
          size: annotation.fontSize,
          font,
          color: rgb(color.r, color.g, color.b),
        });
        break;
      }
      case 'highlight': {
        const color = hexToRgb(annotation.color);
        page.drawRectangle({
          x: annotation.x,
          y: pageHeight - annotation.y - annotation.height,
          width: annotation.width,
          height: annotation.height,
          color: rgb(color.r, color.g, color.b),
          opacity: 0.3,
        });
        break;
      }
      case 'draw': {
        const color = hexToRgb(annotation.color);
        if (annotation.points.length > 1) {
          for (let i = 1; i < annotation.points.length; i++) {
            page.drawLine({
              start: { x: annotation.points[i - 1].x, y: pageHeight - annotation.points[i - 1].y },
              end: { x: annotation.points[i].x, y: pageHeight - annotation.points[i].y },
              thickness: annotation.strokeWidth,
              color: rgb(color.r, color.g, color.b),
            });
          }
        }
        break;
      }
      case 'shape': {
        const color = hexToRgb(annotation.color);
        if (annotation.shapeType === 'rectangle') {
          page.drawRectangle({
            x: annotation.x,
            y: pageHeight - annotation.y - annotation.height,
            width: annotation.width,
            height: annotation.height,
            borderColor: rgb(color.r, color.g, color.b),
            borderWidth: annotation.strokeWidth,
          });
        } else if (annotation.shapeType === 'circle') {
          const radius = Math.min(annotation.width, annotation.height) / 2;
          page.drawCircle({
            x: annotation.x + radius,
            y: pageHeight - annotation.y - radius,
            size: radius,
            borderColor: rgb(color.r, color.g, color.b),
            borderWidth: annotation.strokeWidth,
          });
        } else if (annotation.shapeType === 'arrow') {
          // Draw arrow line
          page.drawLine({
            start: { x: annotation.x, y: pageHeight - annotation.y },
            end: { x: annotation.x + annotation.width, y: pageHeight - annotation.y - annotation.height },
            thickness: annotation.strokeWidth,
            color: rgb(color.r, color.g, color.b),
          });
          // Draw arrowhead
          const angle = Math.atan2(annotation.height, annotation.width);
          const headLength = 15;
          const endX = annotation.x + annotation.width;
          const endY = pageHeight - annotation.y - annotation.height;
          page.drawLine({
            start: { x: endX, y: endY },
            end: { 
              x: endX - headLength * Math.cos(angle - Math.PI / 6), 
              y: endY + headLength * Math.sin(angle - Math.PI / 6) 
            },
            thickness: annotation.strokeWidth,
            color: rgb(color.r, color.g, color.b),
          });
          page.drawLine({
            start: { x: endX, y: endY },
            end: { 
              x: endX - headLength * Math.cos(angle + Math.PI / 6), 
              y: endY + headLength * Math.sin(angle + Math.PI / 6) 
            },
            thickness: annotation.strokeWidth,
            color: rgb(color.r, color.g, color.b),
          });
        }
        break;
      }
      case 'image': {
        try {
          const imageBytes = await fetch(annotation.imageData).then(res => res.arrayBuffer());
          let image;
          if (annotation.imageData.includes('image/png')) {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            image = await pdfDoc.embedJpg(imageBytes);
          }
          page.drawImage(image, {
            x: annotation.x,
            y: pageHeight - annotation.y - annotation.height,
            width: annotation.width,
            height: annotation.height,
          });
        } catch (e) {
          console.error('Failed to embed image:', e);
        }
        break;
      }
    }
  }
  
  // Handle page deletion and reordering
  if (deletedPages.length > 0 || pageOrder.length > 0) {
    const newPdfDoc = await PDFDocument.create();
    const originalPageCount = pdfDoc.getPageCount();
    
    // Use pageOrder if provided, otherwise use original order minus deleted pages
    const finalOrder = pageOrder.length > 0 
      ? pageOrder.filter(i => !deletedPages.includes(i))
      : Array.from({ length: originalPageCount }, (_, i) => i).filter(i => !deletedPages.includes(i));
    
    for (const pageIndex of finalOrder) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
      newPdfDoc.addPage(copiedPage);
    }
    
    return await newPdfDoc.save();
  }
  
  return await pdfDoc.save();
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

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
