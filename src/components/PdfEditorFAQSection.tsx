import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PdfEditorFAQSection = () => {
  const faqs = [
    {
      question: "How do I edit a PDF online?",
      answer:
        "Simply upload your PDF file, then use our editor tools to add text, images, shapes, highlights, or draw on your document. You can also rotate, delete, and rearrange pages. When done, click Download to save your edited PDF.",
    },
    {
      question: "Is the PDF editor completely free?",
      answer:
        "Yes! Our PDF editor is 100% free with no hidden charges, no watermarks, and no signup required. Edit unlimited PDFs at no cost.",
    },
    {
      question: "Are my PDF files secure?",
      answer:
        "Absolutely. All processing happens directly in your browser. Your files are never uploaded to any server, ensuring complete privacy and security.",
    },
    {
      question: "Can I add images to my PDF?",
      answer:
        "Yes! You can easily add images to any page of your PDF. Simply select the Image tool, click on the page where you want to add the image, and choose your image file.",
    },
    {
      question: "How do I rearrange pages in my PDF?",
      answer:
        "Use the page thumbnail sidebar on the left. Simply drag and drop pages to reorder them. You can also rotate or delete individual pages.",
    },
    {
      question: "What types of annotations can I add?",
      answer:
        "You can add text, highlights, freehand drawings, shapes (rectangles, circles, arrows), and images. Each annotation type has customizable colors and sizes.",
    },
    {
      question: "Does this work on mobile devices?",
      answer:
        "Yes! Our PDF editor is fully responsive and works on smartphones and tablets. Though for the best experience, we recommend using a desktop or laptop.",
    },
    {
      question: "Can I undo changes I've made?",
      answer:
        "Currently, you can delete any annotation you've added by selecting it. For page operations like rotation or deletion, these are applied when you download, so you can reload the original file to start over.",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Everything you need to know about our PDF editor
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 shadow-card"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary">
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

export default PdfEditorFAQSection;
