import JSZip from 'jszip';

export type CompressionLevel = 'low' | 'medium' | 'high';

export interface CompressedImage {
  id: string;
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressionRatio: number;
  previewUrl: string;
  compressedUrl: string | null;
  status: 'pending' | 'compressing' | 'done' | 'error';
  error?: string;
}

const compressionSettings: Record<CompressionLevel, number> = {
  low: 0.9,
  medium: 0.7,
  high: 0.5,
};

export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const calculateSavings = (original: number, compressed: number): number => {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
};

const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const compressImage = async (
  file: File,
  level: CompressionLevel,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const quality = compressionSettings[level];
  
  onProgress?.(10);
  
  const img = await loadImage(file);
  
  onProgress?.(30);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Calculate dimensions - for high compression, reduce dimensions slightly
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  
  if (level === 'high' && (width > 2000 || height > 2000)) {
    const maxDimension = 2000;
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }
  
  canvas.width = width;
  canvas.height = height;
  
  onProgress?.(50);
  
  // Draw image
  ctx.drawImage(img, 0, 0, width, height);
  
  onProgress?.(70);
  
  // Determine output type - use webp for better compression if supported
  let outputType = file.type;
  if (outputType === 'image/png' && level === 'high') {
    // PNG doesn't support quality, convert to JPEG for high compression
    outputType = 'image/jpeg';
  }
  
  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        onProgress?.(100);
        if (blob) {
          // Clean up
          URL.revokeObjectURL(img.src);
          resolve(blob);
        } else {
          reject(new Error('Failed to compress image'));
        }
      },
      outputType,
      quality
    );
  });
};

export const downloadImage = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/\.[^/.]+$/, '') + '_compressed' + getExtension(blob.type);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getExtension = (mimeType: string): string => {
  const extensions: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  return extensions[mimeType] || '.jpg';
};

export const downloadAllAsZip = async (images: CompressedImage[]): Promise<void> => {
  const zip = new JSZip();
  
  images.forEach((image, index) => {
    if (image.compressedBlob) {
      const filename = image.originalFile.name.replace(/\.[^/.]+$/, '') + '_compressed' + getExtension(image.compressedBlob.type);
      zip.file(filename, image.compressedBlob);
    }
  });
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'compressed_images.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const cleanupImages = (images: CompressedImage[]): void => {
  images.forEach((image) => {
    if (image.previewUrl) URL.revokeObjectURL(image.previewUrl);
    if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
  });
};
