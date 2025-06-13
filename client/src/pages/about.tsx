import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Users, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function About() {
  const { data: totalYardsData } = useQuery({
    queryKey: ["/api/stats/total-yards"],
    queryFn: async () => {
      const response = await fetch("/api/stats/total-yards");
      if (!response.ok) throw new Error("Failed to fetch total yards");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const formatYards = (yards: number) => {
    if (yards >= 1000000) {
      return `${(yards / 1000000).toFixed(1)}M`;
    } else if (yards >= 1000) {
      return `${(yards / 1000).toFixed(1)}K`;
    }
    return yards.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-charcoal mb-6">About Quiltwise</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're passionate quilters building modern tools to make your quilting journey simpler and more inspiring. From accurate fabric calculators to creative design tools, we understand the challenges you face because we face them too.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-charcoal mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              To make quilting more accessible, modern, and fun for quilters everywhere. We believe technology should enhance your creativity, not complicate it. That's why we build intuitive fabric calculators and design tools that handle the math so you can focus on what you love most—creating beautiful quilts.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're a beginner piecing your first block or an experienced quilter designing your hundredth masterpiece, we're here to make your quilting journey simpler and more inspiring. Because every quilter deserves tools that work as hard as they do.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
              alt="Colorful quilt with intricate patterns" 
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-charcoal text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Passion</h3>
                <p className="text-gray-600 text-sm">
                  We're quilters too. Our love for the craft drives everything we create.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-sage" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Precision</h3>
                <p className="text-gray-600 text-sm">
                  Accurate calculations and reliable tools you can trust for every project.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-wheat/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-wheat" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Community</h3>
                <p className="text-gray-600 text-sm">
                  Building connections between quilters around the world through shared creativity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">
                  Constantly improving our tools to meet the highest standards of quality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-charcoal mb-6">Our Story</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              QuiltWise started as a simple side project born out of a practical need. My wife—an avid quilter—needed a quick, reliable way to calculate how much fabric she needed for her next project. The existing tools we found online were cluttered, outdated, and hard to use, especially when we were in a hurry and heading out to the fabric store. So, I built a basic calculator that she could print and take with her—no more forgotten fabric or guesswork at the cutting table.
            </p>
            
            <p>
              What started as a tool for one person quickly grew. We realized that other quilters were facing the same frustrations. So we decided to build something better: a clean, user-friendly fabric calculator that worked the way real quilters needed it to.
            </p>
            
            <p>
              But we didn't stop there.
            </p>
            
            <p>
              As the community grew, so did the vision. We're now developing custom design tools that let users create and customize their own quilt layouts—from block placement to color palette experimentation—all right in the browser. And we're not just building software; we're building a space where creativity, learning, and passion for quilting can thrive.
            </p>
            
            <p>
              Our hope is to inspire the next generation of quilters—to make the craft more accessible, modern, and fun. Whether you're piecing your first block or designing your hundredth quilt, we're here to make your quilting journey simpler and more inspiring.
            </p>
            
            <p className="font-medium text-charcoal">
              Thanks for being part of the story. We're glad you're here.
            </p>
          </div>
        </div>


      </div>

      <Footer />
    </div>
  );
}
