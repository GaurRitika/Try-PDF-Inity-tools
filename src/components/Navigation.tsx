import { Link, useLocation } from "react-router-dom";
import { FileUp, FileDown, Home, Scissors, FileText, Image, Sparkles, Eraser, Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { to: "/", icon: Home, label: "All Tools" },
    { to: "/merge-pdf", icon: FileUp, label: "Merge" },
    { to: "/compress-pdf", icon: FileDown, label: "Compress" },
    { to: "/split-pdf", icon: Scissors, label: "Split" },
    { to: "/pdf-to-jpg", icon: Image, label: "To JPG" },
    { to: "/compress-image", icon: Image, label: "Image" },
    { to: "/remove-background", icon: Eraser, label: "BG Remove" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <div className="max-w-6xl mx-auto glass-strong rounded-2xl shadow-elevated">
            <div className="px-4 sm:px-6">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
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
                
                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    const Icon = link.icon;
                    
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                          isActive 
                            ? "text-primary-foreground" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute inset-0 gradient-primary rounded-xl shadow-primary" />
                        )}
                        {!isActive && (
                          <span className="absolute inset-0 bg-transparent group-hover:bg-secondary rounded-xl transition-all duration-300" />
                        )}
                        <span className="relative flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isActive ? '' : 'group-hover:text-primary'} transition-colors`} />
                          <span className="hidden lg:inline">{link.label}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-foreground" />
                  ) : (
                    <Menu className="w-5 h-5 text-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mx-4 mt-2 animate-fade-in">
            <div className="glass-strong rounded-2xl shadow-elevated p-4">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  const Icon = link.icon;
                  
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? "gradient-primary text-primary-foreground shadow-primary" 
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-24" />
    </>
  );
};

export default Navigation;
