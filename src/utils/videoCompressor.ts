import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
let ffmpeg: FFmpeg | null = null;

export type CompressionLevel = 'high' | 'balanced' | 'low';

export interface VideoCompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionPercentage: number;
}

const getCompressionSettings = (level: CompressionLevel) => {
  switch (level) {
    case 'high':
      return { crf: '35', preset: 'veryfast', scale: '0.5' };
    case 'balanced':
      return { crf: '28', preset: 'medium', scale: '0.75' };
    case 'low':
      return { crf: '23', preset: 'slow', scale: '1' };
    default:
      return { crf: '28', preset: 'medium', scale: '0.75' };
  }
};

export const loadFFmpeg = async (onProgress?: (progress: number) => void): Promise<FFmpeg> => {
  if (ffmpeg && ffmpeg.loaded) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) {
      onProgress(Math.round(progress * 100));
    }
  });

  // Load FFmpeg core from same-origin URLs (required for COEP/SharedArrayBuffer)
  await ffmpeg.load({
    coreURL,
    wasmURL,
  });

  return ffmpeg;
};

export const compressVideo = async (
  file: File,
  level: CompressionLevel,
  onProgress?: (progress: number) => void
): Promise<VideoCompressionResult> => {
  const ff = await loadFFmpeg(onProgress);
  
  const inputName = 'input' + getFileExtension(file.name);
  const outputName = 'output.mp4';
  
  await ff.writeFile(inputName, await fetchFile(file));
  
  const settings = getCompressionSettings(level);
  
  // Build FFmpeg command based on compression level
  const scaleFilter = settings.scale !== '1' 
    ? `-vf scale=iw*${settings.scale}:ih*${settings.scale}` 
    : '';
  
  const args = [
    '-i', inputName,
    '-c:v', 'libx264',
    '-crf', settings.crf,
    '-preset', settings.preset,
    ...(scaleFilter ? scaleFilter.split(' ') : []),
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    '-y',
    outputName
  ];
  
  await ff.exec(args);
  
  const data = await ff.readFile(outputName);
  // Handle the FileData type properly - cast to work with Blob
  const blob = new Blob([data as BlobPart], { type: 'video/mp4' });
  
  // Cleanup
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  const originalSize = file.size;
  const compressedSize = blob.size;
  const compressionPercentage = Math.round((1 - compressedSize / originalSize) * 100);
  
  return {
    blob,
    originalSize,
    compressedSize,
    compressionPercentage,
  };
};

const getFileExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? `.${ext}` : '.mp4';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const downloadVideo = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace(/\.[^/.]+$/, '') + '_compressed.mp4';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const isValidVideoFile = (file: File): boolean => {
  const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm', 'video/avi'];
  const validExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  return hasValidType || hasValidExtension;
};

export const estimateCompressedSize = (originalSize: number, level: CompressionLevel): number => {
  const reductionRates: Record<CompressionLevel, number> = {
    high: 0.3,    // ~70% reduction
    balanced: 0.5, // ~50% reduction
    low: 0.7,     // ~30% reduction
  };
  
  return Math.round(originalSize * reductionRates[level]);
};
