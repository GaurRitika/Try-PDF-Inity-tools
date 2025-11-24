import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { mergePDFs, downloadPDF } from "@/utils/pdfMerger";
import { Button } from "@/components/ui/button";

interface FileItem {
  id: string;
  file: File;
}

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    const newFiles: FileItem[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    toast.success(`Added ${selectedFiles.length} file(s)`);
  };

  const handleReorder = (reorderedFiles: FileItem[]) => {
    setFiles(reorderedFiles);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.info("File removed");
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please select at least 2 PDF files to merge");
      return;
    }

    setIsProcessing(true);
    try {
      const filesToMerge = files.map((f) => f.file);
      const mergedBlob = await mergePDFs(filesToMerge);
      downloadPDF(mergedBlob, "merged-document.pdf");
      toast.success("PDFs merged successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast.error("Failed to merge PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files || []);
          handleFilesSelected(selectedFiles);
          e.target.value = "";
        }}
      />

      <HeroSection onFileSelect={handleFileSelect} />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FileUpload onFilesSelected={handleFilesSelected} hasFiles={files.length > 0} />

          {files.length > 0 && (
            <div className="mt-8 space-y-6">
              <FileList files={files} onReorder={handleReorder} onRemove={handleRemove} />

              <div className="flex justify-center">
                <Button
                  onClick={handleMerge}
                  disabled={isProcessing || files.length < 2}
                  size="lg"
                  className="gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-primary hover:scale-105 transition-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Merging PDFs...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Merge PDF Files
                    </>
                  )}
                </Button>
              </div>

              {files.length === 1 && (
                <p className="text-center text-sm text-muted-foreground">
                  Add at least one more PDF file to merge
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <FeaturesSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
