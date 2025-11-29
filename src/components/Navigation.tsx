import { Link, useLocation } from "react-router-dom";
import { FileUp, FileDown, Home, Scissors, FileText, Image, Sparkles } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navLinks = [
    { to: "/", icon: Home, label: "All Tools", short: "Home" },
    { to: "/merge-pdf", icon: FileUp, label: "Merge", short: "Merge" },
    { to: "/compress-pdf", icon: FileDown, label: "Compress", short: "Compress" },
    { to: "/split-pdf", icon: Scissors, label: "Split", short: "Split" },
    { to: "/pdf-to-word", icon: FileText, label: "To Word", short: "Word" },
    { to: "/pdf-to-jpg", icon: Image, label: "To JPG", short: "JPG" },
    { to: "/compress-image", icon: Image, label: "Img Compress", short: "Img" },
  ];

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary group-hover:shadow-glow transition-all duration-300">
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
          
          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 gradient-primary rounded-xl shadow-sm" />
                  )}
                  {!isActive && (
                    <span className="absolute inset-0 bg-accent/0 group-hover:bg-accent rounded-xl transition-colors duration-200" />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{link.label}</span>
                    <span className="hidden md:inline lg:hidden">{link.short}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
