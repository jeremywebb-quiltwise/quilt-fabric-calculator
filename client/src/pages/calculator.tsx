import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import FabricCalculator from "@/components/fabric-calculator";

export default function Calculator() {
  return (
    <div className="min-h-screen bg-cream overflow-auto">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Fabric Calculator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate precise fabric requirements for your quilt projects with our intelligent calculator
          </p>
        </div>
        
        <FabricCalculator />
      </div>

      <Footer />
    </div>
  );
}
