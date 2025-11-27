import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MergePDF from "./pages/MergePDF";
import CompressPDF from "./pages/CompressPDF";
import SplitPDF from "./pages/SplitPDF";
import PdfToWord from "./pages/PdfToWord";
import WordToPdf from "./pages/WordToPdf";
import PdfToJpg from "./pages/PdfToJpg";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/merge-pdf" element={<MergePDF />} />
          <Route path="/compress-pdf" element={<CompressPDF />} />
          <Route path="/split-pdf" element={<SplitPDF />} />
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/word-to-pdf" element={<WordToPdf />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
