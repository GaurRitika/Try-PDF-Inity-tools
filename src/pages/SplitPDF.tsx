import { useState } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SplitHeroSection from "@/components/SplitHeroSection";
import SplitFileUpload from "@/components/SplitFileUpload";
import SplitFAQSection from "@/components/SplitFAQSection";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Scissors } from "lucide-react";
import {
  loadPdfPages,
  splitPdfByPages,
  splitPdfIntoSinglePages,
  downloadPdf,
  formatFileSize,
} from "@/utils/pdfSplitter";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SplitPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitMode, setSplitMode] = useState<"selected" | "ranges" | "all">("selected");
  const [rangeInput, setRangeInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitComplete, setSplitComplete] = useState(false);
  const [splitFiles, setSplitFiles] = useState<Uint8Array[]>([]);
  const { toast } = useToast();

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setSplitComplete(false);
    setSelectedPages([]);
    setProgress(0);

    try {
      const { pageCount: count, pdfBytes: bytes } = await loadPdfPages(selectedFile);
      setPageCount(count);
      setPdfBytes(bytes);
      toast({
        title: "PDF loaded",
        description: `Your PDF has ${count} pages`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load PDF file",
        variant: "destructive",
      });
    }
  };

  const togglePageSelection = (pageIndex: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageIndex)
        ? prev.filter((p) => p !== pageIndex)
        : [...prev, pageIndex].sort((a, b) => a - b)
    );
  };

  const selectAllPages = () => {
    setSelectedPages(Array.from({ length: pageCount }, (_, i) => i));
  };

  const deselectAllPages = () => {
    setSelectedPages([]);
  };

  const parseRanges = (input: string): number[] => {
    const pages: number[] = [];
    const parts = input.split(",").map((s) => s.trim());

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n.trim()) - 1);
        if (!isNaN(start) && !isNaN(end) && start >= 0 && end < pageCount && start <= end) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const page = parseInt(part) - 1;
        if (!isNaN(page) && page >= 0 && page < pageCount && !pages.includes(page)) {
          pages.push(page);
        }
      }
    }

    return pages.sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!pdfBytes) return;

    setIsProcessing(true);
    setProgress(0);
    setSplitComplete(false);

    try {
      let results: Uint8Array[] = [];

      if (splitMode === "all") {
        setProgress(20);
        results = await splitPdfIntoSinglePages(pdfBytes);
        setProgress(80);
      } else if (splitMode === "ranges" && rangeInput) {
        const pages = parseRanges(rangeInput);
        if (pages.length === 0) {
          toast({
            title: "Invalid range",
            description: "Please enter valid page ranges (e.g., 1-3, 5, 8-10)",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        setProgress(20);
        const splitPdf = await splitPdfByPages(pdfBytes, pages);
        results = [splitPdf];
        setProgress(80);
      } else if (splitMode === "selected" && selectedPages.length > 0) {
        setProgress(20);
        const splitPdf = await splitPdfByPages(pdfBytes, selectedPages);
        results = [splitPdf];
        setProgress(80);
      } else {
        toast({
          title: "No pages selected",
          description: "Please select pages to split",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      setSplitFiles(results);
      setProgress(100);
      setSplitComplete(true);

      toast({
        title: "Success!",
        description: `Split into ${results.length} file(s)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to split PDF",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (splitFiles.length === 1) {
      downloadPdf(splitFiles[0], `${file?.name.replace(".pdf", "")}_split.pdf`);
    } else {
      splitFiles.forEach((pdfData, index) => {
        downloadPdf(pdfData, `${file?.name.replace(".pdf", "")}_page_${index + 1}.pdf`);
      });
    }

    toast({
      title: "Downloaded",
      description: `${splitFiles.length} file(s) downloaded successfully`,
    });
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Split PDF Online",
    description: "Free online PDF splitter tool to extract and split PDF pages instantly",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I split a PDF file online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply upload your PDF file, select the pages or ranges you want to extract, and click Split PDF. Your split files will be ready to download instantly.",
        },
      },
      {
        "@type": "Question",
        name: "Is it free to split PDF files?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Our PDF splitter is 100% free with no hidden charges, no watermarks, and no signup required.",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Split PDF Online — Free PDF Splitter Tool (Fast & Secure)</title>
        <meta
          name="description"
          content="Use our free online PDF splitter to split PDF pages instantly. No signup required. Works on mobile & desktop."
        />
        <meta
          name="keywords"
          content="split pdf online, pdf splitter, extract pdf pages, split pdf free, divide pdf, pdf page extractor, free pdf splitter tool"
        />
        <meta property="og:title" content="Split PDF Online — Free PDF Splitter Tool" />
        <meta
          property="og:description"
          content="Split PDF pages instantly with our free online tool. Fast, secure, and no signup required."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />

        <main className="flex-1">
          <SplitHeroSection />

          <section className="max-w-4xl mx-auto px-4 pb-16">
            <SplitFileUpload onFileSelected={handleFileSelected} hasFile={!!file} />

            {file && pageCount > 0 && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pageCount} pages · {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <RadioGroup value={splitMode} onValueChange={(v: any) => setSplitMode(v)} className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="selected" id="selected" />
                      <div className="flex-1">
                        <Label htmlFor="selected" className="font-medium cursor-pointer">
                          Select specific pages
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Choose individual pages to extract
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="ranges" id="ranges" />
                      <div className="flex-1">
                        <Label htmlFor="ranges" className="font-medium cursor-pointer">
                          Split by page ranges
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          Enter page ranges (e.g., 1-3, 5, 8-10)
                        </p>
                        {splitMode === "ranges" && (
                          <Input
                            placeholder="e.g., 1-3, 5, 8-10"
                            value={rangeInput}
                            onChange={(e) => setRangeInput(e.target.value)}
                            className="max-w-sm"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="all" id="all" />
                      <div className="flex-1">
                        <Label htmlFor="all" className="font-medium cursor-pointer">
                          Extract all pages
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Split every page into separate PDF files
                        </p>
                      </div>
                    </div>
                  </RadioGroup>

                  {splitMode === "selected" && (
                    <div className="mt-6 space-y-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={selectAllPages}>
                          Select All
                        </Button>
                        <Button variant="outline" size="sm" onClick={deselectAllPages}>
                          Deselect All
                        </Button>
                        <span className="text-sm text-muted-foreground flex items-center ml-auto">
                          {selectedPages.length} of {pageCount} pages selected
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
                        {Array.from({ length: pageCount }, (_, i) => (
                          <div
                            key={i}
                            onClick={() => togglePageSelection(i)}
                            className={`
                              relative border-2 rounded-lg p-4 cursor-pointer transition-base
                              flex flex-col items-center justify-center h-32
                              ${
                                selectedPages.includes(i)
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50 bg-card"
                              }
                            `}
                          >
                            <Checkbox
                              checked={selectedPages.includes(i)}
                              className="absolute top-2 right-2"
                            />
                            <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-sm font-medium">Page {i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isProcessing && (
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-3">
                      <Scissors className="w-5 h-5 text-primary animate-pulse" />
                      <span className="font-medium text-foreground">Splitting PDF...</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {splitComplete && (
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Scissors className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Split Complete!</h3>
                        <p className="text-sm text-muted-foreground">
                          {splitFiles.length} file{splitFiles.length > 1 ? "s" : ""} ready
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleDownload} className="w-full" size="lg">
                      <Download className="w-5 h-5 mr-2" />
                      Download Split PDF{splitFiles.length > 1 ? "s" : ""}
                    </Button>
                  </div>
                )}

                {!splitComplete && !isProcessing && (
                  <Button
                    onClick={handleSplit}
                    disabled={
                      (splitMode === "selected" && selectedPages.length === 0) ||
                      (splitMode === "ranges" && !rangeInput)
                    }
                    className="w-full gradient-primary shadow-primary"
                    size="lg"
                  >
                    <Scissors className="w-5 h-5 mr-2" />
                    Split PDF
                  </Button>
                )}
              </div>
            )}
          </section>

          <section className="bg-accent/30 py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
                Why Use Our PDF Splitter?
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Fast, secure, and completely free PDF splitting tool that works in your browser
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                  <h3 className="font-semibold text-foreground mb-2">100% Free Forever</h3>
                  <p className="text-sm text-muted-foreground">
                    No hidden fees, no watermarks, no signup required. Split unlimited PDFs for free.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                  <h3 className="font-semibold text-foreground mb-2">Fast & Lightweight</h3>
                  <p className="text-sm text-muted-foreground">
                    Lightning-fast processing in your browser. No waiting, no uploads to servers.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                  <h3 className="font-semibold text-foreground mb-2">Secure & Private</h3>
                  <p className="text-sm text-muted-foreground">
                    Your files never leave your device. Complete privacy and security guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <SplitFAQSection />

          <section className="bg-card py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Related PDF Tools
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <a href="/merge-pdf">Merge PDF</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/compress-pdf">Compress PDF</a>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SplitPDF;
