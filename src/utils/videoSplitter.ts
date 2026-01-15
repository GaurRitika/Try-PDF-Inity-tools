import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import coreURL from '@ffmpeg/core/dist/umd/ffmpeg-core.js?url';
import wasmURL from '@ffmpeg/core/dist/umd/ffmpeg-core.wasm?url';
import workerURL from '@ffmpeg/core/dist/umd/ffmpeg-core.worker.js?url';
import JSZip from 'jszip';

let ffmpeg: FFmpeg | null = null;

export interface SplitSegment {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface SplitResult {
  segment: SplitSegment;
  blob: Blob;
  url: string;
  filename: string;
}

export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
};

export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

export const generateVideoThumbnail = (file: File, time: number = 0): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.preload = 'metadata';
    video.muted = true;
    
    video.onloadeddata = () => {
      video.currentTime = Math.min(time, video.duration);
    };
    
    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
      URL.revokeObjectURL(video.src);
      resolve(thumbnail);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to generate thumbnail'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

const initFFmpeg = async (onProgress?: (progress: number) => void): Promise<FFmpeg> => {
  if (ffmpeg && ffmpeg.loaded) {
    return ffmpeg;
  }
  
  ffmpeg = new FFmpeg();
  
  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) {
      onProgress(Math.round(progress * 100));
    }
  });

  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg]', message);
  });

  try {
    // ffmpeg-core assets are bundled and served from the same origin by Vite (?url imports)
    await ffmpeg.load({
      coreURL,
      wasmURL,
      workerURL,
    });

    console.log('FFmpeg loaded successfully');
  } catch (error) {
    console.error('FFmpeg load error:', error);
    ffmpeg = null;

    const isolated = typeof window !== 'undefined' ? (window as any).crossOriginIsolated : undefined;
    throw new Error(
      `Failed to load video processing library. (crossOriginIsolated: ${String(isolated)}) ` +
        'Please refresh the page. If this keeps happening, the site may be missing COOP/COEP headers.'
    );
  }
  
  return ffmpeg;
};

export const splitVideoByTimeRange = async (
  file: File,
  startTime: number,
  endTime: number,
  onProgress?: (progress: number) => void
): Promise<SplitResult> => {
  const ff = await initFFmpeg(onProgress);
  
  const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
  const outputName = `split_${formatTime(startTime).replace(/:/g, '-')}_to_${formatTime(endTime).replace(/:/g, '-')}.mp4`;
  
  await ff.writeFile(inputName, await fetchFile(file));
  
  await ff.exec([
    '-i', inputName,
    '-ss', startTime.toString(),
    '-to', endTime.toString(),
    '-c', 'copy',
    '-avoid_negative_ts', 'make_zero',
    outputName
  ]);
  
  const data = await ff.readFile(outputName);
  const blob = new Blob([data as BlobPart], { type: 'video/mp4' });
  const url = URL.createObjectURL(blob);
  
  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);
  
  return {
    segment: {
      id: `${startTime}-${endTime}`,
      startTime,
      endTime,
      duration: endTime - startTime
    },
    blob,
    url,
    filename: outputName
  };
};

export const splitVideoIntoEqualParts = async (
  file: File,
  numberOfParts: number,
  onProgress?: (progress: number, currentPart: number, totalParts: number) => void
): Promise<SplitResult[]> => {
  const duration = await getVideoDuration(file);
  const partDuration = duration / numberOfParts;
  const results: SplitResult[] = [];
  
  const ff = await initFFmpeg((progress) => {
    if (onProgress) {
      const overallProgress = ((results.length * 100) + progress) / numberOfParts;
      onProgress(Math.round(overallProgress), results.length + 1, numberOfParts);
    }
  });
  
  const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
  await ff.writeFile(inputName, await fetchFile(file));
  
  for (let i = 0; i < numberOfParts; i++) {
    const startTime = i * partDuration;
    const endTime = Math.min((i + 1) * partDuration, duration);
    const outputName = `part_${i + 1}_of_${numberOfParts}.mp4`;
    
    await ff.exec([
      '-i', inputName,
      '-ss', startTime.toString(),
      '-to', endTime.toString(),
      '-c', 'copy',
      '-avoid_negative_ts', 'make_zero',
      outputName
    ]);
    
    const data = await ff.readFile(outputName);
    const blob = new Blob([data as BlobPart], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    
    results.push({
      segment: {
        id: `part-${i + 1}`,
        startTime,
        endTime,
        duration: endTime - startTime
      },
      blob,
      url,
      filename: outputName
    });
    
    await ff.deleteFile(outputName);
  }
  
  await ff.deleteFile(inputName);
  
  return results;
};

export const splitVideoByDuration = async (
  file: File,
  segmentDuration: number,
  onProgress?: (progress: number, currentPart: number, totalParts: number) => void
): Promise<SplitResult[]> => {
  const duration = await getVideoDuration(file);
  const numberOfParts = Math.ceil(duration / segmentDuration);
  const results: SplitResult[] = [];
  
  const ff = await initFFmpeg((progress) => {
    if (onProgress) {
      const overallProgress = ((results.length * 100) + progress) / numberOfParts;
      onProgress(Math.round(overallProgress), results.length + 1, numberOfParts);
    }
  });
  
  const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
  await ff.writeFile(inputName, await fetchFile(file));
  
  for (let i = 0; i < numberOfParts; i++) {
    const startTime = i * segmentDuration;
    const endTime = Math.min((i + 1) * segmentDuration, duration);
    const outputName = `segment_${i + 1}.mp4`;
    
    await ff.exec([
      '-i', inputName,
      '-ss', startTime.toString(),
      '-to', endTime.toString(),
      '-c', 'copy',
      '-avoid_negative_ts', 'make_zero',
      outputName
    ]);
    
    const data = await ff.readFile(outputName);
    const blob = new Blob([data as BlobPart], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    
    results.push({
      segment: {
        id: `segment-${i + 1}`,
        startTime,
        endTime,
        duration: endTime - startTime
      },
      blob,
      url,
      filename: outputName
    });
    
    await ff.deleteFile(outputName);
  }
  
  await ff.deleteFile(inputName);
  
  return results;
};

export const downloadAsZip = async (results: SplitResult[], zipFilename: string = 'split_videos.zip'): Promise<void> => {
  const zip = new JSZip();
  
  results.forEach((result) => {
    zip.file(result.filename, result.blob);
  });
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadSingleFile = (result: SplitResult): void => {
  const link = document.createElement('a');
  link.href = result.url;
  link.download = result.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
