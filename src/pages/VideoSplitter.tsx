import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VideoSplitterHeroSection from "@/components/VideoSplitterHeroSection";
import VideoSplitterFileUpload from "@/components/VideoSplitterFileUpload";
import VideoSplitterFAQSection from "@/components/VideoSplitterFAQSection";

const VideoSplitter = () => {
  useEffect(() => {
    // Acceptance criteria: should log true once COOP/COEP headers are applied
    // (In embedded previews/iframes this may be false even if production is correct.)
    console.log("crossOriginIsolated:", window.crossOriginIsolated);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VideoSplitterHeroSection />
      <VideoSplitterFileUpload />
      <VideoSplitterFAQSection />
      <Footer />
    </div>
  );
};

export default VideoSplitter;

