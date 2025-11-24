import { PDFDocument } from "pdf-lib";

export type CompressionLevel = "low" | "medium" | "high";

export const compressPDF = async (file: File, level: CompressionLevel): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Get all pages
  const pages = pdfDoc.getPages();
  
  // Apply compression based on level
  // Note: pdf-lib has limited compression capabilities
  // We'll optimize by removing unused objects and compressing streams
  
  let compressionOptions: any = {};
  
  switch (level) {
    case "low":
      compressionOptions = {
        useObjectStreams: false,
      };
      break;
    case "medium":
      compressionOptions = {
        useObjectStreams: true,
      };
      break;
    case "high":
      compressionOptions = {
        useObjectStreams: true,
        addDefaultPage: false,
      };
      break;
  }
  
  // Remove metadata to reduce size
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer("");
  pdfDoc.setCreator("");
  
  // Save with compression
  const compressedPdfBytes = await pdfDoc.save(compressionOptions);
  
  return new Blob([new Uint8Array(compressedPdfBytes)], { type: "application/pdf" });
};

export const downloadPDF = (blob: Blob, filename: string = "compressed.pdf") => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const calculateCompressionRatio = (originalSize: number, compressedSize: number): number => {
  const reduction = ((originalSize - compressedSize) / originalSize) * 100;
  return Math.max(0, Math.round(reduction));
};