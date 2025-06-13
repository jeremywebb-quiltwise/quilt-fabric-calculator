import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Palette, GraduationCap, Users, Camera, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: totalYardsData } = useQuery({
    queryKey: ["/api/stats/total-yards"],
    queryFn: async () => {
      const response = await fetch("/api/stats/total-yards");
      if (!response.ok) throw new Error("Failed to fetch total yards");
      return response.json();
    },
    refetchInterval: 30000,
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cream to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-charcoal mb-6">
                Free Quilt Fabric Calculator – <span className="text-terracotta">Yardage Estimator</span> for Any Quilt Size
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                The easiest way to plan your quilt fabric requirements. Built for quilters: fast, free, and beginner-friendly fabric estimator that saves time and prevents waste.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link href="/calculator">
                  <Button className="bg-white text-charcoal hover:bg-gray-50 px-8 py-3 text-lg font-bold shadow-lg border-2 border-terracotta">
                    <Calculator className="mr-2 h-5 w-5" />
                    Start Calculating Now
                  </Button>
                </Link>
                
                {totalYardsData && (
                  <div className="bg-white rounded-lg px-6 py-3 shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-terracotta">
                        {formatYards(totalYardsData.totalYards)}
                      </span>
                      <span className="text-charcoal font-medium">yards calculated</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">by our community</p>
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Free quilt fabric calculator showing yardage estimation for modern quilting projects with colorful fabric squares and measuring tools" 
                className="rounded-2xl shadow-xl w-full h-auto" 
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-terracotta rounded-lg flex items-center justify-center">
                    <Calculator className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">Precise Calculations</p>
                    <p className="text-sm text-gray-600">Down to the inch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-charcoal mb-4">Instantly Estimate Fabric Yardage for Your Next Quilt</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Save time and fabric with our accurate quilt calculator. Professional quilting tools designed for modern creators, from beginners to expert designers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Community Card */}
            <Card className="bg-gradient-to-br from-cream to-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-terracotta/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="text-2xl text-terracotta h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-4">Quilting Community</h3>
                <p className="text-gray-600 mb-6">Connect with fellow quilters, share projects, and discover new techniques in our vibrant community.</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                    Share your projects
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                    Get expert advice
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                    Join challenges
                  </li>
                </ul>
                <Button className="w-full bg-terracotta text-white hover:bg-terracotta/90" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Learning Resources Card */}
            <Card className="bg-gradient-to-br from-wheat/5 to-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-wheat/10 rounded-xl flex items-center justify-center mb-6">
                  <GraduationCap className="text-2xl text-wheat h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-4">Learning Hub</h3>
                <p className="text-gray-600 mb-6">Expert tutorials, pattern guides, and quilting tips from our community of designers.</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                    Step-by-step tutorials
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                    Pattern library
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                    Community tips
                  </li>
                </ul>
                <Button className="w-full bg-wheat text-white hover:bg-wheat/90" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Gallery Card */}
            <Card className="bg-gradient-to-br from-sage/5 to-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-sage/10 rounded-xl flex items-center justify-center mb-6">
                  <Camera className="text-2xl text-sage h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-4">Pattern Gallery</h3>
                <p className="text-gray-600 mb-6">Browse beautiful quilt patterns and designs created by our community for inspiration.</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                    Featured patterns
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                    Style inspiration
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-sage rounded-full mr-3"></div>
                    Color combinations
                  </li>
                </ul>
                <Button className="w-full bg-sage text-white hover:bg-sage/90" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">Join Our Community</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Connect with thousands of quilters worldwide, share your creations, and get inspired by others</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-2xl text-terracotta h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">15,000+ Members</h3>
              <p className="text-gray-600">Join a vibrant community of quilters from beginners to experts, all sharing their passion for the craft.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sage/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="text-2xl text-sage h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Share Your Work</h3>
              <p className="text-gray-600">Showcase your quilting projects, get feedback, and inspire others with your creative designs.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-wheat/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-2xl text-wheat h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Learn Together</h3>
              <p className="text-gray-600">Access exclusive tutorials, participate in challenges, and grow your skills alongside fellow quilters.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-terracotta text-white hover:bg-terracotta/90 mr-4" disabled>
              <Users className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
            <Button variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white" disabled>
              <Camera className="mr-2 h-4 w-4" />
              Coming Soon
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section with Schema Markup */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about calculating quilt fabric requirements</p>
          </div>
          
          <div className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            <div className="bg-white p-6 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-charcoal mb-3" itemProp="name">How do I calculate quilt fabric requirements?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <div itemProp="text" className="text-gray-600">
                  <p>Enter your quilt dimensions (width and height), block size, and seam allowance into our free calculator. The tool instantly estimates yardage for main fabric, accent fabrics, binding, and backing. Our calculator accounts for fabric width and pattern type to provide accurate measurements.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-charcoal mb-3" itemProp="name">What quilt sizes can I calculate fabric for?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <div itemProp="text" className="text-gray-600">
                  <p>Our yardage estimator works for any quilt size - from baby quilts (36" x 52") to king size quilts (108" x 96"). Simply input your custom dimensions or choose from standard quilt sizes. The calculator handles lap quilts, twin, full, queen, and king sizes.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-charcoal mb-3" itemProp="name">Can I get a printable fabric calculation sheet?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <div itemProp="text" className="text-gray-600">
                  <p>Yes! Click the "Printable PDF Calculator" button to generate a downloadable fabric calculation worksheet. Perfect for taking to the fabric store or keeping with your project notes. The printable version includes all measurements and shopping list format.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-charcoal mb-3" itemProp="name">Does the calculator account for fabric waste and extra yardage?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <div itemProp="text" className="text-gray-600">
                  <p>Absolutely. Our fabric estimator automatically includes recommended extra yardage for cutting waste, shrinkage, and potential mistakes. You can adjust the extra fabric percentage based on your experience level and project complexity.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm" itemScope itemType="https://schema.org/Question">
              <h3 className="text-xl font-semibold text-charcoal mb-3" itemProp="name">Is the quilt fabric calculator really free?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <div itemProp="text" className="text-gray-600">
                  <p>Yes, our quilt yardage calculator is completely free with no signup required. Calculate unlimited projects, download printable worksheets, and access all features at no cost. Built by quilters for quilters.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/calculator">
              <Button className="bg-terracotta text-white hover:bg-terracotta/90">
                <Calculator className="mr-2 h-4 w-4" />
                Try the Free Calculator Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
