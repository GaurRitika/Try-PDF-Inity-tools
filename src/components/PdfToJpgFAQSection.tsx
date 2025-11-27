import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is PDF to JPG conversion free?",
    answer:
      "Yes, our PDF to JPG converter is completely free to use. There are no hidden fees, subscriptions, or limits on the number of conversions you can perform.",
  },
  {
    question: "Will the image quality stay the same?",
    answer:
      "Yes, you can choose between low, medium, and high quality settings. High quality mode preserves the original resolution and produces crisp, clear images perfect for printing or sharing.",
  },
  {
    question: "Are my files safe?",
    answer:
      "Absolutely. All conversion happens directly in your browser using client-side processing. Your files are never uploaded to our servers or stored anywhere, ensuring complete privacy and security.",
  },
  {
    question: "Can I convert multiple pages?",
    answer:
      "Yes! You can convert all pages from your PDF or select specific pages. When converting multiple pages, you'll receive a ZIP file containing all the JPG images.",
  },
  {
    question: "What quality settings are available?",
    answer:
      "We offer three quality levels: Low (smaller file size, good for web), Medium (balanced quality and size), and High (maximum quality, ideal for printing). Choose based on your needs.",
  },
  {
    question: "Can I use this on mobile devices?",
    answer:
      "Yes, our PDF to JPG converter is fully responsive and works on all devices including smartphones, tablets, laptops, and desktops. The interface adapts to your screen size for the best experience.",
  },
];

const PdfToJpgFAQSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default PdfToJpgFAQSection;
