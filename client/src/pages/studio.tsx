import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import DesignStudioEnhanced from "@/components/design-studio-enhanced";
import ComingSoonModal from "@/components/coming-soon-modal";

export default function Studio() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check if design studio should show coming soon modal
    // Set to true by default for production deployment
    const isComingSoonMode = import.meta.env.VITE_STUDIO_COMING_SOON !== 'false';
    setShowComingSoon(isComingSoonMode);
  }, []);

  const handleCloseModal = () => {
    setShowComingSoon(false);
    navigate('/calculator');
  };

  if (showComingSoon) {
    return (
      <div className="min-h-screen bg-cream">
        <Navigation />
        <ComingSoonModal onClose={handleCloseModal} />
        <Footer />
      </div>
    );
  }

  return <DesignStudioEnhanced />;
}
