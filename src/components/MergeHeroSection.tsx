import { FileUp, Sparkles, Shield, Zap } from "lucide-react";

interface MergeHeroSectionProps {
  onFileSelect: () => void;
}

const MergeHeroSection = ({ onFileSelect }: MergeHeroSectionProps) => {
  return (
    <section className="relative gradient-hero py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Free PDF Merger</span>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-[1.1] tracking-tight animate-fade-in-up">
          Merge PDF Files Online{" "}
          <span className="gradient-text">Free & Secure</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Combine multiple PDF documents into one file instantly. No signup required, 
          completely free, and your files stay private on your device.
        </p>
        
        {/* CTA Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={onFileSelect}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground gradient-primary rounded-xl shadow-primary hover:shadow-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <FileUp className="w-5 h-5 mr-2" />
            Choose PDF Files
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>No File Limits</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>No Watermarks</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MergeHeroSection;
