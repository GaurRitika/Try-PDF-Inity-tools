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
      className="group relative bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift shadow-card hover:shadow-card-hover overflow-hidden"
    >
      {/* Gradient Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Top Shine */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex flex-col items-center text-center">
        {/* Icon Container */}
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/20 transition-all duration-300">
            <Icon className="w-7 h-7 text-primary" />
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
        
        {/* CTA */}
        <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
