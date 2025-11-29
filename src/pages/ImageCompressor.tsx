import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ImageCompressorHeroSection from "@/components/ImageCompressorHeroSection";
import ImageCompressorFileUpload from "@/components/ImageCompressorFileUpload";
import ImageCompressorFAQSection from "@/components/ImageCompressorFAQSection";

const ImageCompressor = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <ImageCompressorHeroSection />
        <ImageCompressorFileUpload />
        <ImageCompressorFAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default ImageCompressor;
