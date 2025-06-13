import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ComingSoonModal from "@/components/coming-soon-modal";

export default function Blog() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Show coming soon modal for blog
    setShowComingSoon(true);
  }, []);

  const handleCloseModal = () => {
    setShowComingSoon(false);
    // Stay on blog page instead of navigating away
  };

  if (showComingSoon) {
    return (
      <div className="min-h-screen bg-cream">
        <Navigation />
        <ComingSoonModal 
          onClose={handleCloseModal} 
          feature="Blog" 
          redirectText="Continue Browsing"
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Learning Hub</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tutorials, tips, and inspiration from quilting experts
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
