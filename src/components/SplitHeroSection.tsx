import { Scissors } from "lucide-react";

const SplitHeroSection = () => {
  return (
    <section className="text-center py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6">
          <Scissors className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4 tracking-tight">
          Split PDF Online — Free & Fast
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Easily split PDF pages into multiple files. 100% free & secure tool.
        </p>
      </div>
    </section>
  );
};

export default SplitHeroSection;
