import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CompressFAQSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">
              How does PDF compression work?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our tool compresses PDF files by optimizing internal structures, removing redundant data, 
              and applying efficient encoding techniques. All compression happens in your browser, 
              ensuring your files remain private and secure.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">
              Will compression reduce PDF quality?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our compression algorithm is designed to reduce file size while maintaining document quality. 
              You can choose between different compression levels based on your needs - from light compression 
              that preserves maximum quality to high compression for maximum file size reduction.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
              Is it safe to compress PDFs online?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely! Unlike other online tools, we process your PDFs entirely in your browser. 
              Your files never leave your device or get uploaded to any server, making it completely 
              safe and private.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">
              What compression levels are available?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              We offer three compression levels: Low (light compression, best quality), 
              Medium (balanced compression and quality), and High (maximum compression, smaller file size). 
              Choose the level that best fits your needs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">
              Is there a file size limit?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              No! Since processing happens in your browser, there are no file size limits. 
              However, very large files may take longer to process depending on your device's performance.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left">
              Do I need to sign up or pay?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              No signup or payment required! Our PDF compressor is completely free to use with no 
              hidden fees, watermarks, or limitations.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default CompressFAQSection;