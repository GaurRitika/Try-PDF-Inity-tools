import { Image, Shield, Zap, Download } from "lucide-react";
import { Helmet } from "react-helmet";

const ImageCompressorHeroSection = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is the image compressor free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our image compressor is 100% free to use. There are no hidden fees, no signup required, and no limits on the number of images you can compress."
        }
      },
      {
        "@type": "Question",
        "name": "Will image quality be reduced?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our smart compression algorithm minimizes quality loss while significantly reducing file size. You can choose from Low, Medium, or High compression levels to balance between quality and file size."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! All image compression happens directly in your browser. Your images are never uploaded to our servers, ensuring complete privacy and security."
        }
      },
      {
        "@type": "Question",
        "name": "Can I compress multiple images?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can compress multiple images at once. Simply drag and drop or select multiple files, and download them individually or as a ZIP file."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Image Compressor — Free Online Tool to Compress Images</title>
        <meta 
          name="description" 
          content="Compress JPG, JPEG, PNG, and WEBP images online for free. Reduce image size without losing quality. Fast, secure & mobile-friendly compressor tool." 
        />
        <meta name="keywords" content="image compressor, compress jpg online, reduce image size, online photo compressor, png compressor, webp compressor, free image compression" />
        <link rel="canonical" href="/compress-image" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
      <section className="relative py-16 sm:py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Image className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Image Compressor</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in-up">
            Compress Images{" "}
            <span className="gradient-text">Online</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Compress JPG, PNG, JPEG, or WEBP images without losing quality. 
            Fast, free, and secure online image compressor.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-accent-foreground" />
              <span>Free Download</span>
            </div>
          </div>

          {/* Breadcrumbs for SEO */}
          <nav className="mt-8 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.3s' }} aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li>/</li>
              <li><a href="/" className="hover:text-primary transition-colors">Tools</a></li>
              <li>/</li>
              <li className="text-foreground">Image Compressor</li>
            </ol>
          </nav>
        </div>
      </section>
    </>
  );
};

export default ImageCompressorHeroSection;
