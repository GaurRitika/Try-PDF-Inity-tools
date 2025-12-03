import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  route: string;
}

const ToolCard = ({ icon: Icon, title, description, route }: ToolCardProps) => {
  return (
    <Link
      to={route}
      className="group relative glass-card rounded-3xl p-6 hover-lift glow-ring overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      {/* Top Highlight Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Shine Effect */}
      <div className="absolute inset-0 shine" />
      
      <div className="relative flex flex-col items-center text-center">
        {/* 3D Icon Container */}
        <div className="relative mb-6">
          {/* Glow Behind Icon */}
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Icon Box */}
          <div className="relative w-16 h-16 rounded-2xl icon-3d flex items-center justify-center group-hover:scale-110 transition-all duration-300">
            <Icon className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-display font-bold text-foreground mb-2 group-hover:gradient-text transition-all duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {description}
        </p>
        
        {/* CTA Button */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-muted-foreground group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300">
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
