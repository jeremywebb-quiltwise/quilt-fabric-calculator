import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Sparkles, Palette, Grid, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComingSoonModalProps {
  onClose?: () => void;
  feature?: string;
  redirectText?: string;
}

export default function ComingSoonModal({ onClose, feature = "Design Studio", redirectText = "Continue to Calculator" }: ComingSoonModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to join the waitlist.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setIsSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll notify you as soon as the Design Studio launches.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">You're In!</h3>
            <p className="text-gray-600 mb-6">
              Thanks for joining our early access list. We'll send you an email as soon as {feature === "Design Studio" ? "the Design Studio is" : "it's"} ready.
            </p>
            <Button onClick={onClose} className="w-full bg-white hover:bg-gray-50 text-terracotta font-bold py-3 px-6 rounded-lg shadow-lg border-2 border-terracotta outline-2 outline-terracotta">
              {redirectText}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-terracotta to-sage rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-charcoal">{feature} Coming Soon!</CardTitle>
          <p className="text-gray-600">
            We're putting the finishing touches on our professional quilt design tools. 
            Be the first to know when it launches.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Feature Preview */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Grid className="h-5 w-5 text-terracotta" />
              <div>
                <p className="font-medium text-sm">Professional Grid System</p>
                <p className="text-xs text-gray-600">Precise block placement with row/column headers</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Palette className="h-5 w-5 text-terracotta" />
              <div>
                <p className="font-medium text-sm">Advanced Color Management</p>
                <p className="text-xs text-gray-600">Color tags, palettes, and colorway systems</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Zap className="h-5 w-5 text-terracotta" />
              <div>
                <p className="font-medium text-sm">Smart Block Tools</p>
                <p className="text-xs text-gray-600">Rotation, copying, merging, and professional shortcuts</p>
              </div>
            </div>
          </div>

          {/* Email Signup */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-white hover:bg-gray-50 text-terracotta font-bold py-3 px-6 rounded-lg shadow-lg border-2 border-terracotta outline-2 outline-terracotta"
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Get Early Access"}
            </Button>
          </form>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Badge variant="outline" className="text-xs">No Spam</Badge>
            <span>•</span>
            <Badge variant="outline" className="text-xs">Unsubscribe Anytime</Badge>
          </div>

          {onClose && (
            <Button variant="ghost" onClick={onClose} className="w-full text-gray-600">
              Continue to Fabric Calculator
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}