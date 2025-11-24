import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import CompressHeroSection from "@/components/CompressHeroSection";
import CompressFileUpload from "@/components/CompressFileUpload";
import FeaturesSection from "@/components/FeaturesSection";
import CompressFAQSection from "@/components/CompressFAQSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { compressPDF, downloadPDF, formatFileSize, calculateCompressionRatio, type CompressionLevel } from "@/utils/pdfCompressor";

const CompressPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setCompressedBlob(null);
    toast({
      title: "File uploaded",
      description: `${selectedFile.name} is ready to compress`,
    });
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressed = await compressPDF(file, compressionLevel);
      setCompressedBlob(compressed);
      
      const reduction = calculateCompressionRatio(file.size, compressed.size);
      toast({
        title: "Compression complete!",
        description: `File size reduced by ${reduction}%`,
      });
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "There was an error compressing your PDF. Please try again.",
        variant: "destructive",
      });
      console.error("Compression error:", error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (compressedBlob && file) {
      const filename = file.name.replace(".pdf", "_compressed.pdf");
      downloadPDF(compressedBlob, filename);
      toast({
        title: "Download started",
        description: "Your compressed PDF is downloading",
      });
    }
  };

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFile(null);
    setCompressedBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Helmet>
        <title>Compress PDF Online – Free PDF Compressor | Reduce PDF Size</title>
        <meta name="description" content="Free online PDF compressor to reduce file size without losing quality. Fast, secure, no watermark, and no signup required." />
        <meta name="keywords" content="compress pdf online, reduce pdf size, shrink pdf tool, free pdf compressor, pdf size reducer, compress pdf free" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Compress PDF Online – Free PDF Compressor | Reduce PDF Size" />
        <meta property="og:description" content="Free online PDF compressor to reduce file size without losing quality. Fast, secure, no watermark, and no signup required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yoursite.com/compress-pdf" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compress PDF Online – Free PDF Compressor" />
        <meta name="twitter:description" content="Free online PDF compressor to reduce file size without losing quality. Fast, secure, no watermark, and no signup required." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <CompressHeroSection onFileSelect={handleFileSelectClick} />
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileSelected(selectedFile);
          }}
          className="hidden"
        />

        <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <CompressFileUpload onFileSelected={handleFileSelected} hasFile={!!file} />

            {file && (
              <div className="space-y-6 animate-fade-in">
                {/* File Info */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-card">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Original size: {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="flex-shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Compression Level Selector */}
                {!compressedBlob && (
                  <div className="bg-card rounded-xl border border-border p-6 shadow-card">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Choose Compression Level
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => setCompressionLevel("low")}
                        className={`p-4 rounded-xl border-2 transition-base text-left ${
                          compressionLevel === "low"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold text-foreground mb-1">Low</div>
                        <div className="text-sm text-muted-foreground">Light compression, best quality</div>
                      </button>
                      <button
                        onClick={() => setCompressionLevel("medium")}
                        className={`p-4 rounded-xl border-2 transition-base text-left ${
                          compressionLevel === "medium"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold text-foreground mb-1">Medium</div>
                        <div className="text-sm text-muted-foreground">Balanced compression</div>
                      </button>
                      <button
                        onClick={() => setCompressionLevel("high")}
                        className={`p-4 rounded-xl border-2 transition-base text-left ${
                          compressionLevel === "high"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold text-foreground mb-1">High</div>
                        <div className="text-sm text-muted-foreground">Maximum compression</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Compress Button */}
                {!compressedBlob && (
                  <Button
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="w-full h-14 text-lg"
                    size="lg"
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Compressing PDF...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-5 h-5 mr-2" />
                        Compress PDF
                      </>
                    )}
                  </Button>
                )}

                {/* Compressed Result */}
                {compressedBlob && (
                  <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground mb-1">Compression Complete!</p>
                        <p className="text-sm text-muted-foreground">
                          Original: {formatFileSize(file.size)} → Compressed: {formatFileSize(compressedBlob.size)}
                        </p>
                        <p className="text-sm font-medium text-primary mt-1">
                          Reduced by {calculateCompressionRatio(file.size, compressedBlob.size)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button onClick={handleDownload} className="flex-1" size="lg">
                        <Download className="w-5 h-5 mr-2" />
                        Download Compressed PDF
                      </Button>
                      <Button onClick={handleReset} variant="outline" size="lg">
                        Compress Another
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* SEO Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">
              Free Online PDF Compressor – Reduce PDF File Size
            </h2>
            <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
              <p>
                Need to reduce PDF file size? Our free online PDF compressor helps you shrink large PDF files 
                quickly and easily. Whether you need to compress PDF for email, upload to a website, or save 
                storage space, our tool handles it all in your browser.
              </p>
              <p>
                <strong className="text-foreground">Why choose our PDF compressor?</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>100% Free:</strong> No hidden fees, no watermarks, no signup required</li>
                <li><strong>Secure & Private:</strong> Files are processed locally in your browser, never uploaded to servers</li>
                <li><strong>Fast Processing:</strong> Compress PDF files in seconds with our optimized algorithm</li>
                <li><strong>Quality Preserved:</strong> Choose compression levels to balance size and quality</li>
                <li><strong>No Limits:</strong> Compress as many PDFs as you need, no restrictions</li>
                <li><strong>Works Everywhere:</strong> Compatible with all devices and browsers</li>
              </ul>
            </div>
          </div>
        </section>

        <FeaturesSection />
        <CompressFAQSection />
        <Footer />
      </div>
    </>
  );
};

export default CompressPDF;