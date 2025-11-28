import { Helmet } from "react-helmet";
import { FileUp, FileDown, Scissors, FileText, FileImage, Lock, RotateCw, Shield, Zap, Sparkles, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import ToolCard from "@/components/ToolCard";
import Footer from "@/components/Footer";

const Index = () => {
  const tools = [
    {
      icon: FileUp,
      title: "Merge PDF",
      description: "Combine multiple PDF files into one document instantly",
      route: "/merge-pdf"
    },
    {
      icon: FileDown,
      title: "Compress PDF",
      description: "Reduce PDF file size without losing quality",
      route: "/compress-pdf"
    },
    {
      icon: Scissors,
      title: "Split PDF",
      description: "Extract pages or split PDF into multiple files",
      route: "/split-pdf"
    },
    {
      icon: FileText,
      title: "PDF to Word",
      description: "Convert PDF to editable Word (.docx) files",
      route: "/pdf-to-word"
    },
    {
      icon: FileText,
      title: "Word to PDF",
      description: "Convert DOC/DOCX files to professional PDFs",
      route: "/word-to-pdf"
    },
    {
      icon: FileImage,
      title: "PDF to JPG",
      description: "Convert PDF pages to high-quality JPG images",
      route: "/pdf-to-jpg"
    },
    {
      icon: FileImage,
      title: "JPG to PDF",
      description: "Convert JPG, PNG images to PDF documents",
      route: "/jpg-to-pdf"
    },
    {
      icon: Lock,
      title: "Protect PDF",
      description: "Add password protection to your PDF files",
      route: "/protect-pdf",
      comingSoon: true
    },
    {
      icon: RotateCw,
      title: "Rotate PDF",
      description: "Rotate PDF pages to the correct orientation",
      route: "/rotate-pdf",
      comingSoon: true
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "All files are processed locally in your browser. Nothing is uploaded to our servers."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant processing with no waiting for uploads or downloads from servers."
    },
    {
      icon: FileUp,
      title: "No File Limits",
      description: "Process PDFs of any size with no restrictions or limitations."
    },
    {
      icon: Sparkles,
      title: "No Watermarks",
      description: "All tools are completely free with no watermarks or branding added."
    }
  ];

  const benefits = [
    "100% Free Forever",
    "No Watermarks",
    "Secure & Private",
    "No Signup Required"
  ];

  return (
    <>
      <Helmet>
        <title>Free PDF Tools Online – Merge, Compress, Split & More | No Signup Required</title>
        <meta name="description" content="Free online PDF tools to merge, compress, split, convert, and edit PDF files. Fast, secure, no watermark, and no signup required. All processing done in your browser." />
        <meta name="keywords" content="pdf tools, merge pdf, compress pdf, split pdf, pdf converter, pdf editor online, free pdf tools, online pdf, pdf merger, pdf compressor" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free PDF Tools Online – Merge, Compress, Split & More" />
        <meta property="og:description" content="Free online PDF tools to merge, compress, split, convert, and edit PDF files. Fast, secure, no watermark, and no signup required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yoursite.com/" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free PDF Tools Online – Merge, Compress, Split & More" />
        <meta name="twitter:description" content="Free online PDF tools to merge, compress, split, convert, and edit PDF files. Fast, secure, no watermark, and no signup required." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative gradient-hero py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 gradient-mesh" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Free Online PDF Tools</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground mb-6 leading-[1.1] tracking-tight animate-fade-in-up">
              Every PDF Tool You Need{" "}
              <span className="gradient-text">in One Place</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Merge, compress, split, convert, and edit PDF files online for free. 
              Fast, secure processing in your browser with no signup required.
            </p>
            
            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
                Our Tools
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                All PDF Tools
              </h2>
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {tools.map((tool, index) => (
                <div key={index} className="relative">
                  <ToolCard
                    icon={tool.icon}
                    title={tool.title}
                    description={tool.description}
                    route={tool.route}
                  />
                  {tool.comingSoon && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      Coming Soon
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border/50">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                Why Choose Our PDF Tools?
              </h2>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="group text-center">
                    <div className="relative inline-flex mb-5">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-14 h-14 rounded-2xl bg-card border border-border/50 shadow-card flex items-center justify-center group-hover:border-primary/30 group-hover:shadow-card-hover transition-all duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-3xl border border-border/50 p-8 sm:p-12 shadow-card">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-6">
                Free Online PDF Tools – Work with PDFs Easily
              </h2>
              <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
                <p className="text-base leading-relaxed">
                  Welcome to the most comprehensive collection of free online PDF tools. Whether you need to 
                  merge multiple PDFs, compress large files, split documents, or convert PDFs to images, 
                  we've got you covered with fast, secure, browser-based tools that require no signup.
                </p>
                
                <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
                  Popular PDF Tools
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span><strong className="text-foreground">Merge PDF:</strong> Combine multiple PDF files into a single document with drag-and-drop simplicity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span><strong className="text-foreground">Compress PDF:</strong> Reduce file size without quality loss using advanced compression algorithms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span><strong className="text-foreground">Split PDF:</strong> Extract specific pages or divide large PDFs into smaller files</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span><strong className="text-foreground">PDF to Image:</strong> Convert PDF pages to high-quality JPG or PNG images</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span><strong className="text-foreground">Protect PDF:</strong> Add password encryption to secure sensitive documents</span>
                  </li>
                </ul>
                
                <h3 className="text-xl font-display font-bold text-foreground mt-8 mb-4">
                  Why Use Browser-Based PDF Tools?
                </h3>
                <p className="text-base leading-relaxed">
                  Unlike traditional online PDF services that upload your files to remote servers, our tools 
                  process everything directly in your browser using modern web technologies. This means your 
                  sensitive documents never leave your device, ensuring maximum privacy and security. Plus, 
                  processing is instant with no waiting for uploads or downloads.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Index;
