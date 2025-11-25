import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SplitFAQSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-left font-medium">
              How do I split a PDF file online?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Simply upload your PDF file, select the pages or ranges you want to extract, 
              and click "Split PDF". Your split files will be ready to download instantly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-left font-medium">
              Is it free to split PDF files?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! Our PDF splitter is 100% free with no hidden charges, no watermarks, 
              and no signup required. Split as many PDFs as you need.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-left font-medium">
              Is my PDF secure when splitting online?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely! All splitting happens directly in your browser. Your files never 
              leave your device and are automatically deleted after processing.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-left font-medium">
              Can I split specific pages from a PDF?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! You can select individual pages, define page ranges (e.g., 1-5, 8-10), 
              or split every page into separate PDF files.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-left font-medium">
              What file size can I split?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              There are no file size limits. Our tool processes files directly in your browser, 
              so you can split PDFs of any size without restrictions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="bg-card border border-border rounded-lg px-6">
            <AccordionTrigger className="text-left font-medium">
              Does splitting PDF reduce quality?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              No, splitting a PDF maintains 100% of the original quality. Pages are extracted 
              exactly as they appear in the original document with no compression or quality loss.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default SplitFAQSection;
