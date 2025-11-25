import { Link, useLocation } from "react-router-dom";
import { FileUp, FileDown, Home, Scissors } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-base">
              <FileUp className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">PDF Tools</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-base ${
                location.pathname === "/" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">All Tools</span>
              </span>
            </Link>
            <Link
              to="/merge-pdf"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-base ${
                location.pathname === "/merge-pdf" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <span className="flex items-center gap-2">
                <FileUp className="w-4 h-4" />
                <span className="hidden md:inline">Merge</span>
              </span>
            </Link>
            <Link
              to="/compress-pdf"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-base ${
                location.pathname === "/compress-pdf" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <span className="flex items-center gap-2">
                <FileDown className="w-4 h-4" />
                <span className="hidden md:inline">Compress</span>
              </span>
            </Link>
            <Link
              to="/split-pdf"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-base ${
                location.pathname === "/split-pdf" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <span className="flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                <span className="hidden md:inline">Split</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;