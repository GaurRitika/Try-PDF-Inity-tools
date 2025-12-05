import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PdfEditorHeroSection from "@/components/PdfEditorHeroSection";
import PdfEditorFileUpload from "@/components/PdfEditorFileUpload";
import PdfEditorFAQSection from "@/components/PdfEditorFAQSection";
import PdfEditorCanvas from "@/components/PdfEditorCanvas";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { loadPdfDocument } from "@/utils/pdfEditor";

const PdfEditor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (selectedFile: File) => {
    setIsLoading(true);
    try {
      const { pdfBytes: bytes, pageCount: count } = await loadPdfDocument(selectedFile);
      setFile(selectedFile);
      setPdfBytes(bytes);
      setPageCount(count);
      toast({
        title: "PDF loaded successfully",
        description: `${count} page${count > 1 ? "s" : ""} ready to edit`,
      });
    } catch (error) {
      toast({
        title: "Error loading PDF",
        description: "Please try a different file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfBytes(null);
    setPageCount(0);
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF Editor – Edit PDFs Online Free",
    description: "Edit PDF files online for free. Add text, images, highlights, shapes, and draw on your PDF instantly. No signup required.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Add text to PDF",
      "Add images to PDF",
      "Draw on PDF",
      "Add shapes to PDF",
      "Highlight text",
      "Rotate pages",
      "Delete pages",
      "Rearrange pages",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I edit a PDF online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upload your PDF, use our tools to add text, images, shapes, or draw. Rotate, delete, or rearrange pages as needed. Download your edited PDF when done.",
        },
      },
      {
        "@type": "Question",
        name: "Is this PDF editor free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Our PDF editor is 100% free with no watermarks, no signup required, and no file size limits.",
        },
      },
      {
        "@type": "Question",
        name: "Are my files secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. All processing happens in your browser. Your files are never uploaded to any server.",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>PDF Editor – Edit PDFs Online Free | Add Text, Images & Notes</title>
        <meta
          name="description"
          content="Edit PDF files online for free. Add text, images, highlights, shapes, and draw on your PDF instantly. No signup required."
        />
        <meta
          name="keywords"
          content="pdf editor, edit pdf online, free pdf editor, add text to pdf, annotate pdf, pdf annotation, draw on pdf, add image to pdf, rotate pdf pages, delete pdf pages, rearrange pdf"
        />
        <meta property="og:title" content="PDF Editor – Edit PDFs Online Free | Add Text, Images & Notes" />
        <meta
          property="og:description"
          content="Edit PDF files online for free. Add text, images, highlights, shapes, and draw on your PDF instantly. No signup required."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pdf-inity.vercel.app/pdf-editor" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDF Editor – Edit PDFs Online Free" />
        <meta
          name="twitter:description"
          content="Edit PDF files online for free. Add text, images, highlights, shapes, and draw on your PDF instantly."
        />
        <link rel="canonical" href="https://pdf-inity.vercel.app/pdf-editor" />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />

        <main className="flex-1">
          {!file && (
            <PdfEditorHeroSection onFileSelect={() => fileInputRef.current?.click()} />
          )}

          <section className="max-w-6xl mx-auto px-4 pb-16">
            {!file ? (
              <PdfEditorFileUpload onFileSelected={handleFileSelected} hasFile={!!file} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{file.name}</h2>
                    <p className="text-sm text-muted-foreground">{pageCount} page{pageCount > 1 ? "s" : ""}</p>
                  </div>
                  <Button variant="outline" onClick={handleReset}>
                    Edit Different PDF
                  </Button>
                </div>
                
                {pdfBytes && (
                  <PdfEditorCanvas
                    pdfBytes={pdfBytes}
                    pageCount={pageCount}
                    fileName={file.name}
                  />
                )}
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
              className="hidden"
            />
          </section>

          {!file && (
            <>
              <section className="bg-accent/30 py-16 px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
                    Powerful PDF Editing Features
                  </h2>
                  <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Everything you need to edit PDFs, completely free and in your browser
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-card hover-lift">
                      <h3 className="font-semibold text-foreground mb-2">Add Text & Images</h3>
                      <p className="text-sm text-muted-foreground">
                        Insert text anywhere on your PDF. Add images, logos, or signatures with ease.
                      </p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 shadow-card hover-lift">
                      <h3 className="font-semibold text-foreground mb-2">Draw & Annotate</h3>
                      <p className="text-sm text-muted-foreground">
                        Freehand drawing, highlights, shapes, and arrows for marking up documents.
                      </p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 shadow-card hover-lift">
                      <h3 className="font-semibold text-foreground mb-2">Organize Pages</h3>
                      <p className="text-sm text-muted-foreground">
                        Rotate, delete, and drag-to-rearrange pages. Full control over your PDF.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <PdfEditorFAQSection />

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
                      <a href="/split-pdf">Split PDF</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/compress-pdf">Compress PDF</a>
                    </Button>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PdfEditor;
