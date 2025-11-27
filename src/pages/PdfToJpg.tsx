import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FileText, Download, Trash2, ChevronRight, Image, CheckSquare, Square, ImageIcon } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PdfToJpgHeroSection from "@/components/PdfToJpgHeroSection";
import PdfToJpgFileUpload from "@/components/PdfToJpgFileUpload";
import PdfToJpgFAQSection from "@/components/PdfToJpgFAQSection";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  loadPdfForConversion,
  convertPdfToJpg,
  downloadSingleImage,
  downloadImagesAsZip,
  formatFileSize,
  cleanupImages,
  type QualityLevel,
  type ConvertedImage,
  type PdfDocument,
} from "@/utils/pdfToJpg";

const PdfToJpg = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [quality, setQuality] = useState<QualityLevel>("high");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (convertedImages.length > 0) {
        cleanupImages(convertedImages);
      }
    };
  }, [convertedImages]);

  const handleFileSelected = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      setConvertedImages([]);
      setProgress(0);

      const { pageCount: count, pdfDoc: doc } = await loadPdfForConversion(selectedFile);
      setPdfDoc(doc);
      setPageCount(count);
      setSelectedPages(Array.from({ length: count }, (_, i) => i + 1));

      toast({
        title: "PDF loaded",
        description: `${count} page${count > 1 ? "s" : ""} ready for conversion`,
      });
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast({
        title: "Error loading PDF",
        description: "Please try uploading a valid PDF file",
        variant: "destructive",
      });
    }
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber].sort((a, b) => a - b)
    );
  };

  const selectAllPages = () => {
    setSelectedPages(Array.from({ length: pageCount }, (_, i) => i + 1));
  };

  const deselectAllPages = () => {
    setSelectedPages([]);
  };

  const handleConvert = async () => {
    if (!pdfDoc || selectedPages.length === 0) return;

    setIsConverting(true);
    setProgress(0);

    try {
      const images = await convertPdfToJpg(pdfDoc, selectedPages, quality, (current, total) => {
        setProgress(Math.round((current / total) * 100));
      });

      setConvertedImages(images);

      toast({
        title: "Conversion complete",
        description: `${images.length} image${images.length > 1 ? "s" : ""} ready for download`,
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: "An error occurred during conversion",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    if (convertedImages.length === 0 || !file) return;

    const baseName = file.name.replace(".pdf", "");

    if (convertedImages.length === 1) {
      downloadSingleImage(convertedImages[0], baseName);
    } else {
      await downloadImagesAsZip(convertedImages, baseName);
    }

    toast({
      title: "Download started",
      description: convertedImages.length === 1 ? "Your JPG is downloading" : "Your ZIP file is downloading",
    });
  };

  const handleReset = () => {
    if (convertedImages.length > 0) {
      cleanupImages(convertedImages);
    }
    setFile(null);
    setPdfDoc(null);
    setPageCount(0);
    setSelectedPages([]);
    setConvertedImages([]);
    setProgress(0);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is PDF to JPG conversion free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our PDF to JPG converter is completely free to use with no hidden fees or limits.",
        },
      },
      {
        "@type": "Question",
        name: "Will the image quality stay the same?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can choose between low, medium, and high quality settings to preserve original resolution.",
        },
      },
      {
        "@type": "Question",
        name: "Are my files safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All conversion happens in your browser. Files are never uploaded to servers.",
        },
      },
      {
        "@type": "Question",
        name: "Can I convert multiple pages?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, convert all pages or select specific ones. Multiple pages are delivered as a ZIP file.",
        },
      },
    ],
  };

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF to JPG Converter",
    description: "Convert PDF pages to high-quality JPG images online for free",
    url: "https://pdftools.com/pdf-to-jpg",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <Helmet>
        <title>PDF to JPG Converter — Free Online High-Quality Tool</title>
        <meta
          name="description"
          content="Convert PDF to JPG images online for free. High-resolution PDF to JPG converter, fast and secure. No signup required."
        />
        <meta
          name="keywords"
          content="pdf to jpg, convert pdf to image, pdf to jpeg, free pdf to jpg online, pdf to jpg converter, extract images from pdf"
        />
        <meta property="og:title" content="PDF to JPG Converter — Free Online High-Quality Tool" />
        <meta
          property="og:description"
          content="Convert PDF to JPG images online for free. High-resolution output, fast and secure."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pdftools.com/pdf-to-jpg" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(toolSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Breadcrumbs */}
        <nav className="max-w-6xl mx-auto px-4 py-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li className="text-foreground font-medium">PDF to JPG</li>
          </ol>
        </nav>

        <main className="max-w-6xl mx-auto px-4 pb-16">
          <PdfToJpgHeroSection />

          {!file ? (
            <PdfToJpgFileUpload onFileSelected={handleFileSelected} />
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* File Info Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{file.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {pageCount} page{pageCount > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                {convertedImages.length === 0 && (
                  <>
                    {/* Quality Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Image Quality
                      </label>
                      <div className="flex gap-2">
                        {(["low", "medium", "high"] as QualityLevel[]).map((q) => (
                          <button
                            key={q}
                            onClick={() => setQuality(q)}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                              quality === q
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {q.charAt(0).toUpperCase() + q.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Page Selection */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">
                          Select Pages ({selectedPages.length} of {pageCount})
                        </label>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={selectAllPages}>
                            <CheckSquare className="w-4 h-4 mr-1" />
                            All
                          </Button>
                          <Button variant="ghost" size="sm" onClick={deselectAllPages}>
                            <Square className="w-4 h-4 mr-1" />
                            None
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                        {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => togglePage(pageNum)}
                            className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                              selectedPages.includes(pageNum)
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Progress */}
                {isConverting && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Converting...</span>
                      <span className="text-foreground font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Converted Images Preview */}
                {convertedImages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-3">
                      Converted Images ({convertedImages.length})
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {convertedImages.slice(0, 8).map((img) => (
                        <div
                          key={img.pageNumber}
                          className="aspect-[3/4] rounded-lg overflow-hidden border border-border bg-muted"
                        >
                          <img
                            src={img.url}
                            alt={`Page ${img.pageNumber}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {convertedImages.length > 8 && (
                        <div className="aspect-[3/4] rounded-lg border border-border bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">
                            +{convertedImages.length - 8} more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {convertedImages.length === 0 ? (
                  <Button
                    onClick={handleConvert}
                    disabled={isConverting || selectedPages.length === 0}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {isConverting ? (
                      <>Converting...</>
                    ) : (
                      <>
                        <Image className="w-5 h-5 mr-2" />
                        Convert to JPG
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleDownload}
                      className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {convertedImages.length === 1 ? "Download JPG" : "Download ZIP"}
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="h-12">
                      Convert Another
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Why Use Section */}
          <section className="py-16">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
              Why Use Our PDF to JPG Tool?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">High Quality Output</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred quality level for crisp, clear images
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Page Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Convert all pages or pick specific ones you need
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Easy Download</h3>
                <p className="text-sm text-muted-foreground">
                  Single image or ZIP file for multiple pages
                </p>
              </div>
            </div>
          </section>

          {/* Steps Section */}
          <section className="py-16 border-t border-border">
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
              Steps to Convert PDF to JPG
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                {[
                  { step: 1, title: "Upload PDF", desc: "Drag & drop or click to select your PDF file" },
                  { step: 2, title: "Choose Settings", desc: "Select quality level and pages to convert" },
                  { step: 3, title: "Convert", desc: "Click the convert button and wait for processing" },
                  { step: 4, title: "Download", desc: "Download your JPG images or ZIP file" },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      {step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{title}</h3>
                      <p className="text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <PdfToJpgFAQSection />

          {/* Related Tools */}
          <section className="py-16 border-t border-border">
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
              Related Tools
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { name: "Split PDF", path: "/split-pdf" },
                { name: "Compress PDF", path: "/compress-pdf" },
                { name: "Merge PDF", path: "/merge-pdf" },
                { name: "PDF to Word", path: "/pdf-to-word" },
              ].map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/50 hover:bg-accent/50 transition-all"
                >
                  <span className="font-medium text-foreground">{tool.name}</span>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PdfToJpg;
