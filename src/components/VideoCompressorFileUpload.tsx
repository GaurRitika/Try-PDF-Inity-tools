import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Video, Trash2, Download, Loader2, Film, AlertCircle, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  compressVideo,
  downloadVideo,
  isValidVideoFile,
  formatFileSize,
  estimateCompressedSize,
  loadFFmpeg,
  CompressionLevel,
  VideoCompressionResult,
} from "@/utils/videoCompressor";

type CompressionStatus = 'idle' | 'loading-ffmpeg' | 'compressing' | 'completed' | 'error';

const VideoCompressorFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('balanced');
  const [status, setStatus] = useState<CompressionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoCompressionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const videoFile = acceptedFiles[0];
    
    if (!videoFile) return;
    
    if (!isValidVideoFile(videoFile)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid video file (MP4, MOV, AVI, MKV, WebM)",
        variant: "destructive",
      });
      return;
    }

    if (videoFile.size > 500 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 500MB",
        variant: "destructive",
      });
      return;
    }

    setFile(videoFile);
    setResult(null);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    
    toast({
      title: "Video uploaded",
      description: `${videoFile.name} is ready to compress`,
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
    },
    maxFiles: 1,
  });

  const handleCompress = async () => {
    if (!file) return;

    try {
      setStatus('loading-ffmpeg');
      setProgress(0);
      
      toast({
        title: "Loading video processor...",
        description: "This may take a moment on first use",
      });

      await loadFFmpeg();
      
      setStatus('compressing');
      
      toast({
        title: "Compressing video...",
        description: "Please wait while we process your video",
      });

      const compressionResult = await compressVideo(file, compressionLevel, (p) => {
        setProgress(p);
      });

      setResult(compressionResult);
      setStatus('completed');
      
      toast({
        title: "Compression complete!",
        description: `Reduced by ${compressionResult.compressionPercentage}%`,
      });
    } catch (error) {
      console.error('Compression error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during compression');
      
      toast({
        title: "Compression failed",
        description: "Please try again or use a different video",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (result && file) {
      downloadVideo(result.blob, file.name);
      
      toast({
        title: "Download started",
        description: "Your compressed video is downloading",
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
  };

  const estimatedSize = file ? estimateCompressedSize(file.size, compressionLevel) : 0;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {!file ? (
            /* Upload Area */
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-primary">
                  <Upload className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {isDragActive ? "Drop your video here" : "Drag & Drop Video"}
                  </h3>
                  <p className="text-muted-foreground">
                    or click to browse • MP4, MOV, AVI, MKV, WebM • Max 500MB
                  </p>
                  
                  {/* Processing Time Warning */}
                  <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left max-w-md">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-medium text-amber-600 dark:text-amber-400">Processing Time Estimates</p>
                        <ul className="text-muted-foreground mt-1 space-y-0.5">
                          <li>• Small videos (under 50MB): 1-3 minutes</li>
                          <li>• Medium videos (50-200MB): 3-10 minutes</li>
                          <li>• Large videos (200-500MB): 10-20+ minutes</li>
                        </ul>
                        <p className="text-muted-foreground mt-1 italic">Times vary based on your device's processing power</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="mt-4">
                  <Video className="w-4 h-4 mr-2" />
                  Select Video
                </Button>
              </div>
            </div>
          ) : (
            /* Video Processing Area */
            <div className="glass-strong rounded-3xl p-8">
              {/* File Info */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Film className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Original size: {formatFileSize(file.size)}
                  </p>
                  {status === 'idle' && (
                    <p className="text-sm text-primary">
                      Estimated compressed size: ~{formatFileSize(estimatedSize)}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  disabled={status === 'loading-ffmpeg' || status === 'compressing'}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Compression Level Selector */}
              {status === 'idle' && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Compression Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'high', label: 'High', desc: 'Smallest size', reduction: '~70%' },
                      { value: 'balanced', label: 'Balanced', desc: 'Recommended', reduction: '~50%' },
                      { value: 'low', label: 'Low', desc: 'Best quality', reduction: '~30%' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setCompressionLevel(option.value as CompressionLevel)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          compressionLevel === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 hover:border-primary/30'
                        }`}
                      >
                        <span className="block font-semibold text-foreground">{option.label}</span>
                        <span className="block text-xs text-muted-foreground">{option.desc}</span>
                        <span className="block text-xs text-primary mt-1">{option.reduction} reduction</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Time Estimate Warning */}
                  <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <p><span className="font-medium text-blue-600 dark:text-blue-400">Estimated time:</span> {
                          file.size < 50 * 1024 * 1024 ? '1-3 minutes' :
                          file.size < 200 * 1024 * 1024 ? '3-10 minutes' :
                          '10-20+ minutes'
                        } for {formatFileSize(file.size)} video</p>
                        <p className="mt-1">Processing happens entirely on your device for privacy. Larger files and older devices take longer.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress */}
              {(status === 'loading-ffmpeg' || status === 'compressing') && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {status === 'loading-ffmpeg' ? 'Loading video processor...' : 'Compressing video...'}
                    </span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {status === 'loading-ffmpeg' 
                      ? 'First-time setup, this only happens once'
                      : 'This may take a few minutes for large videos'
                    }
                  </p>
                </div>
              )}

              {/* Error State */}
              {status === 'error' && (
                <div className="mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Compression failed</p>
                      <p className="text-sm text-muted-foreground">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Result */}
              {status === 'completed' && result && (
                <div className="mb-8 p-6 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Original</p>
                      <p className="text-lg font-bold text-foreground">{formatFileSize(result.originalSize)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Compressed</p>
                      <p className="text-lg font-bold text-green-500">{formatFileSize(result.compressedSize)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Saved</p>
                      <p className="text-lg font-bold text-primary">{result.compressionPercentage}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {status === 'idle' && (
                  <Button
                    onClick={handleCompress}
                    className="flex-1 gradient-primary text-primary-foreground"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Compress Video
                  </Button>
                )}
                
                {(status === 'loading-ffmpeg' || status === 'compressing') && (
                  <Button disabled className="flex-1">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </Button>
                )}

                {status === 'completed' && (
                  <>
                    <Button
                      onClick={handleDownload}
                      className="flex-1 gradient-primary text-primary-foreground"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Compressed Video
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Compress Another
                    </Button>
                  </>
                )}

                {status === 'error' && (
                  <Button onClick={handleReset} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: '🔒', text: '100% Private' },
              { icon: '⚡', text: 'Fast Processing' },
              { icon: '💾', text: 'Up to 500MB' },
              { icon: '🎬', text: 'All Formats' },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30 text-sm"
              >
                <span>{feature.icon}</span>
                <span className="text-muted-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCompressorFileUpload;
