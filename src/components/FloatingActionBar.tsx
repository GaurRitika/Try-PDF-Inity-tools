import { Link, useLocation } from "react-router-dom";
import { FileUp, FileDown, Scissors, Image, Eraser, Sparkles } from "lucide-react";

const FloatingActionBar = () => {
  const location = useLocation();
  
  // Don't show on homepage
  if (location.pathname === "/") return null;

  const quickTools = [
    { to: "/merge-pdf", icon: FileUp, label: "Merge", color: "from-violet-500 to-purple-500" },
    { to: "/compress-pdf", icon: FileDown, label: "Compress", color: "from-blue-500 to-cyan-500" },
    { to: "/split-pdf", icon: Scissors, label: "Split", color: "from-pink-500 to-rose-500" },
    { to: "/compress-image", icon: Image, label: "Image", color: "from-emerald-500 to-teal-500" },
    { to: "/remove-background", icon: Eraser, label: "BG Remove", color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="glass-strong rounded-2xl shadow-elevated px-2 py-2">
        <div className="flex items-center gap-1">
          {/* Brand Icon */}
          <Link
            to="/"
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary mr-2"
          >
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </Link>
          
          {/* Quick Tools */}
          {quickTools.map((tool) => {
            const isActive = location.pathname === tool.to;
            const Icon = tool.icon;
            
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className={`relative group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "gradient-primary text-primary-foreground shadow-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium">{tool.label}</span>
                
                {/* Tooltip for mobile */}
                <span className="sm:hidden absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-card text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-elevated border border-border/50">
                  {tool.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FloatingActionBar;
