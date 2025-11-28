import { Helmet } from "react-helmet";
import { FileUp, FileDown, Scissors, FileText, FileImage, Lock, RotateCw } from "lucide-react";
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
        <section className="gradient-hero py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
                Every PDF Tool You Need in{" "}
                <span className="text-primary">One Place</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Merge, compress, split, convert, and edit PDF files online for free. 
                Fast, secure processing in your browser with no signup required.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>No Watermarks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>No Signup</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground text-center mb-12">
              All PDF Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <div key={index} className="relative">
                  <ToolCard
                    icon={tool.icon}
                    title={tool.title}
                    description={tool.description}
                    route={tool.route}
                  />
                  {tool.comingSoon && (
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
              Why Choose Our PDF Tools?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">100% Secure</h3>
                <p className="text-sm text-muted-foreground">
                  All files are processed locally in your browser. Nothing is uploaded to our servers.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No File Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Process PDFs of any size with no restrictions or limitations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <RotateCw className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Instant processing with no waiting for uploads or downloads from servers.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileDown className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Watermarks</h3>
                <p className="text-sm text-muted-foreground">
                  All tools are completely free with no watermarks or branding added.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">
              Free Online PDF Tools – Work with PDFs Easily
            </h2>
            <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
              <p>
                Welcome to the most comprehensive collection of free online PDF tools. Whether you need to 
                merge multiple PDFs, compress large files, split documents, or convert PDFs to images, 
                we've got you covered with fast, secure, browser-based tools that require no signup.
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
                Popular PDF Tools
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-foreground">Merge PDF:</strong> Combine multiple PDF files into a single document with drag-and-drop simplicity</li>
                <li><strong className="text-foreground">Compress PDF:</strong> Reduce file size without quality loss using advanced compression algorithms</li>
                <li><strong className="text-foreground">Split PDF:</strong> Extract specific pages or divide large PDFs into smaller files</li>
                <li><strong className="text-foreground">PDF to Image:</strong> Convert PDF pages to high-quality JPG or PNG images</li>
                <li><strong className="text-foreground">Protect PDF:</strong> Add password encryption to secure sensitive documents</li>
                <li><strong className="text-foreground">Rotate PDF:</strong> Fix page orientation with easy rotation tools</li>
              </ul>
              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
                Why Use Browser-Based PDF Tools?
              </h3>
              <p>
                Unlike traditional online PDF services that upload your files to remote servers, our tools 
                process everything directly in your browser using modern web technologies. This means your 
                sensitive documents never leave your device, ensuring maximum privacy and security. Plus, 
                processing is instant with no waiting for uploads or downloads.
              </p>
              <p className="text-xs text-muted-foreground mt-8 pt-8 border-t border-border">
                <strong className="text-foreground">SEO Keywords:</strong> pdf tools online, merge pdf, 
                compress pdf, split pdf, pdf converter, pdf editor, free pdf tools, online pdf merger, 
                pdf compressor, combine pdf, reduce pdf size, pdf joiner, edit pdf online, pdf to image, 
                protect pdf, rotate pdf, pdf manipulation tools
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Index;