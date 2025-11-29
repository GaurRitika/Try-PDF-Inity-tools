import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, FileImage, Shield, Layers } from "lucide-react";

const ImageCompressorFAQSection = () => {
  const faqs = [
    {
      question: "Is the image compressor free?",
      answer:
        "Yes, our image compressor is 100% free to use. There are no hidden fees, no signup required, and no limits on the number of images you can compress. Use it as many times as you need!",
    },
    {
      question: "Will image quality be reduced?",
      answer:
        "Our smart compression algorithm minimizes quality loss while significantly reducing file size. You can choose from Low, Medium, or High compression levels to balance between quality and file size. For most uses, the Medium setting provides excellent results with minimal visible quality loss.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Absolutely! All image compression happens directly in your browser using client-side processing. Your images are never uploaded to our servers, ensuring complete privacy and security. Once you close the page, all data is gone.",
    },
    {
      question: "Can I compress multiple images?",
      answer:
        "Yes, you can compress multiple images at once. Simply drag and drop or select multiple files, choose your compression level, and compress them all together. You can download them individually or as a convenient ZIP file.",
    },
    {
      question: "What image formats are supported?",
      answer:
        "Our compressor supports the most common image formats: JPG/JPEG, PNG, and WEBP. These cover the vast majority of images used on the web and in everyday use.",
    },
    {
      question: "How much can I reduce image size?",
      answer:
        "Compression results vary based on the original image and compression level selected. Typically, you can expect 20-40% reduction with Low compression, 40-60% with Medium, and 50-80% with High compression.",
    },
  ];

  const relatedTools = [
    { to: "/jpg-to-pdf", label: "JPG to PDF", icon: FileImage },
    { to: "/pdf-to-jpg", label: "PDF to JPG", icon: FileImage },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Why Use Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-6 text-center">
            Why Use Our Image Compressor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card text-center">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">100% Private</h3>
              <p className="text-sm text-muted-foreground">
                All processing happens in your browser. Your images never leave your device.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card text-center">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Smart Compression</h3>
              <p className="text-sm text-muted-foreground">
                Advanced algorithms preserve quality while dramatically reducing file size.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card text-center">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <FileImage className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Batch Processing</h3>
              <p className="text-sm text-muted-foreground">
                Compress multiple images at once and download as ZIP for convenience.
              </p>
            </div>
          </div>
        </div>

        {/* How To Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-6 text-center">
            How to Compress Images?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Upload Images</h3>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to select JPG, PNG, or WEBP images.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Choose Level</h3>
              <p className="text-sm text-muted-foreground">
                Select Low, Medium, or High compression based on your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Download</h3>
              <p className="text-sm text-muted-foreground">
                Click compress and download your optimized images instantly.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              FAQs
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Related Tools */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-6 text-center">
            Related Tools
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
              >
                <tool.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCompressorFAQSection;
