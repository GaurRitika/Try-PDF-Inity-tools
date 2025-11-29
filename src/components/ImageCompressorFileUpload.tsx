import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Download, FileArchive, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  CompressedImage,
  CompressionLevel,
  isValidImageFile,
  formatFileSize,
  calculateSavings,
  compressImage,
  downloadImage,
  downloadAllAsZip,
  cleanupImages,
} from "@/utils/imageCompressor";

const ImageCompressorFileUpload = () => {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const [isCompressing, setIsCompressing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(isValidImageFile);
    
    if (validFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid files skipped",
        description: "Only JPG, JPEG, PNG, and WEBP files are supported.",
        variant: "destructive",
      });
    }

    const newImages: CompressedImage[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      originalFile: file,
      originalSize: file.size,
      compressedBlob: null,
      compressedSize: 0,
      compressionRatio: 0,
      previewUrl: URL.createObjectURL(file),
      compressedUrl: null,
      status: "pending",
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        if (image.previewUrl) URL.revokeObjectURL(image.previewUrl);
        if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleCompress = async () => {
    if (images.length === 0) return;

    setIsCompressing(true);
    setOverallProgress(0);

    const totalImages = images.filter((img) => img.status === "pending").length;
    let completedImages = 0;

    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      if (updatedImages[i].status !== "pending") continue;

      updatedImages[i].status = "compressing";
      setImages([...updatedImages]);

      try {
        const compressedBlob = await compressImage(
          updatedImages[i].originalFile,
          compressionLevel,
          (progress) => {
            const baseProgress = (completedImages / totalImages) * 100;
            const currentProgress = (progress / totalImages);
            setOverallProgress(Math.round(baseProgress + currentProgress));
          }
        );

        updatedImages[i].compressedBlob = compressedBlob;
        updatedImages[i].compressedSize = compressedBlob.size;
        updatedImages[i].compressionRatio = calculateSavings(
          updatedImages[i].originalSize,
          compressedBlob.size
        );
        updatedImages[i].compressedUrl = URL.createObjectURL(compressedBlob);
        updatedImages[i].status = "done";
      } catch (error) {
        updatedImages[i].status = "error";
        updatedImages[i].error = "Failed to compress";
      }

      completedImages++;
      setImages([...updatedImages]);
    }

    setOverallProgress(100);
    setIsCompressing(false);

    toast({
      title: "Compression complete!",
      description: `Successfully compressed ${completedImages} image(s).`,
    });
  };

  const handleDownloadAll = async () => {
    const completedImages = images.filter((img) => img.status === "done" && img.compressedBlob);
    if (completedImages.length === 0) return;

    try {
      await downloadAllAsZip(completedImages);
      toast({
        title: "Download started",
        description: "Your compressed images are being downloaded as a ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to create ZIP file.",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = () => {
    cleanupImages(images);
    setImages([]);
    setOverallProgress(0);
  };

  const completedCount = images.filter((img) => img.status === "done").length;
  const totalSaved = images
    .filter((img) => img.status === "done")
    .reduce((acc, img) => acc + (img.originalSize - img.compressedSize), 0);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-primary bg-primary/5 shadow-glow"
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-primary">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground mb-1">
                {isDragActive ? "Drop images here" : "Drag & drop images here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse • JPG, PNG, WEBP supported
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Your images are compressed instantly and never stored.
          </p>
        </div>

        {/* Compression Level Selector */}
        {images.length > 0 && (
          <div className="mt-8 animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Select Compression Level
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {(["low", "medium", "high"] as CompressionLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setCompressionLevel(level)}
                  disabled={isCompressing}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    compressionLevel === level
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  } ${isCompressing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <p className="font-semibold text-foreground capitalize">{level}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {level === "low" && "Minimal compression"}
                    {level === "medium" && "Balanced (Recommended)"}
                    {level === "high" && "Maximum compression"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image List */}
        {images.length > 0 && (
          <div className="mt-8 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Images ({images.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={isCompressing}
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={image.previewUrl}
                      alt={image.originalFile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {image.originalFile.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Original: {formatFileSize(image.originalSize)}</span>
                      {image.status === "done" && (
                        <>
                          <span>→</span>
                          <span className="text-success">
                            {formatFileSize(image.compressedSize)}
                          </span>
                          <span className="text-success font-semibold">
                            (-{image.compressionRatio}%)
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status/Actions */}
                  <div className="flex items-center gap-2">
                    {image.status === "pending" && (
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                    {image.status === "compressing" && (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    )}
                    {image.status === "done" && (
                      <>
                        <CheckCircle className="w-5 h-5 text-success" />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            downloadImage(image.compressedBlob!, image.originalFile.name)
                          }
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {image.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImage(image.id)}
                      disabled={isCompressing}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isCompressing && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Compressing...</span>
              <span className="text-foreground font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        {images.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            {completedCount === 0 ? (
              <Button
                size="lg"
                onClick={handleCompress}
                disabled={isCompressing || images.every((img) => img.status !== "pending")}
                className="w-full sm:w-auto gradient-primary text-primary-foreground shadow-primary hover:shadow-glow transition-all duration-300"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Compress Image{images.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            ) : (
              <>
                {completedCount > 1 && (
                  <Button
                    size="lg"
                    onClick={handleDownloadAll}
                    className="w-full sm:w-auto gradient-primary text-primary-foreground shadow-primary hover:shadow-glow transition-all duration-300"
                  >
                    <FileArchive className="w-5 h-5 mr-2" />
                    Download All (ZIP)
                  </Button>
                )}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Total saved: <span className="text-success font-semibold">{formatFileSize(totalSaved)}</span>
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageCompressorFileUpload;
