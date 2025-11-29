import { Link } from "react-router-dom";
import { Sparkles, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const popularTools = [
    { to: "/merge-pdf", label: "Merge PDF" },
    { to: "/compress-pdf", label: "Compress PDF" },
    { to: "/split-pdf", label: "Split PDF" },
    { to: "/pdf-to-word", label: "PDF to Word" },
    { to: "/word-to-pdf", label: "Word to PDF" },
    { to: "/pdf-to-jpg", label: "PDF to JPG" },
    { to: "/jpg-to-pdf", label: "JPG to PDF" },
    { to: "/compress-image", label: "Image Compressor" },
  ];

  const popularSearches = [
    "Merge PDF online free",
    "Compress PDF online",
    "Split PDF online",
    "PDF to Word converter",
    "Word to PDF converter",
    "PDF to JPG converter",
    "Combine PDF files",
  ];

  const features = [
    "100% Free Forever",
    "No File Size Limits",
    "Secure & Private",
    "No Watermarks",
    "Works on All Devices",
  ];

  return (
    <footer className="relative bg-card border-t border-border/50">
      {/* Gradient Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-foreground leading-tight">
                  PDF Tools
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                  Free & Secure
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Free online PDF tools for all your document needs. Fast, secure, and no signup required.
            </p>
            <a 
              href="mailto:devritika.gaur@gmail.com" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </a>
          </div>
          
          {/* Popular Tools */}
          <div>
            <h4 className="text-sm font-display font-bold text-foreground mb-5 uppercase tracking-wider">
              Popular Tools
            </h4>
            <ul className="space-y-3">
              {popularTools.map((tool) => (
                <li key={tool.to}>
                  <Link 
                    to={tool.to} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Popular Searches */}
          <div>
            <h4 className="text-sm font-display font-bold text-foreground mb-5 uppercase tracking-wider">
              Popular Searches
            </h4>
            <ul className="space-y-3">
              {popularSearches.map((search, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {search}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Features */}
          <div>
            <h4 className="text-sm font-display font-bold text-foreground mb-5 uppercase tracking-wider">
              Features
            </h4>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © {currentYear} PDF Tools. Made with <Heart className="w-3.5 h-3.5 text-destructive fill-destructive" /> for you.
            </p>
            <p className="text-xs text-muted-foreground/60">
              pdf tools online • merge pdf • compress pdf • split pdf • pdf converter • free pdf tools
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
