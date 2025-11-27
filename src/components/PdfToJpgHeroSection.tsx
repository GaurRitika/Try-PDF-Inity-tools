import { Image } from "lucide-react";

const PdfToJpgHeroSection = () => {
  return (
    <section className="text-center py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
          <Image className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          Convert PDF to JPG Online
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Convert PDF pages into high-resolution JPG images instantly. 100% free, fast and secure.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Free Forever
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            High Quality Output
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Client-side Processing
          </span>
        </div>
      </div>
    </section>
  );
};

export default PdfToJpgHeroSection;
