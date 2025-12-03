import { Link } from "react-router-dom";
import { Sparkles, Mail, Heart, Github, Twitter, ExternalLink } from "lucide-react";

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
    { to: "/remove-background", label: "Background Remover" },
  ];

  const features = [
    "100% Free Forever",
    "No File Size Limits",
    "Secure & Private",
    "No Watermarks",
    "Works on All Devices",
  ];

  return (
    <footer className="relative border-t border-border/30 mt-20">
      {/* Gradient Glow Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-11 h-11 rounded-xl icon-3d flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-foreground leading-tight">
                  PDF Tools
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                  Pro • Free Forever
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Professional PDF & Image tools for everyone. Fast, secure, and completely free. No signup required.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="mailto:devritika.gaur@gmail.com" 
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Popular Tools */}
          <div>
            <h4 className="text-sm font-display font-bold text-foreground mb-5 uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-primary to-transparent" />
              Tools
            </h4>
            <ul className="space-y-3">
              {popularTools.slice(0, 5).map((tool) => (
                <li key={tool.to}>
                  <Link 
                    to={tool.to} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* More Tools */}
          <div>
            <h4 className="text-sm font-display font-bold text-foreground mb-5 uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-accent to-transparent" />
              More
            </h4>
            <ul className="space-y-3">
              {popularTools.slice(5).map((tool) => (
                <li key={tool.to}>
                  <Link 
                    to={tool.to} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Features */}
          <div>
            <h4 className="text-sm font-display font-bold text-foreground mb-5 uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-success to-transparent" />
              Features
            </h4>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-md bg-success/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              © {currentYear} PDF Tools Pro. Made with 
              <Heart className="w-4 h-4 text-destructive fill-destructive animate-pulse" /> 
              for you
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Privacy <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Terms <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
