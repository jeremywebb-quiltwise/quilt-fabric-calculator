import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

interface BlogPostCardProps {
  post: BlogPost;
}

const CATEGORY_COLORS: Record<string, string> = {
  tutorial: "bg-terracotta/10 text-terracotta",
  tips: "bg-sage/10 text-sage",
  inspiration: "bg-wheat/10 text-wheat",
  patterns: "bg-blue-100 text-blue-800",
  news: "bg-purple-100 text-purple-800",
};

const POST_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
  "https://pixabay.com/get/g9d614614ed264089ca86297d2a9d0ccf65e1ac61cba486cea19781119928bc5af4a7d072719a9cc74c34f05f2161ce9005c7cf18724024678dc966e712cea4ad_1280.jpg",
  "https://pixabay.com/get/gdb652ef594342fa8b4e5119e290140e13fee231c6cadac38821390199450c6c2795bc92ffc63c31b193e090b53603f5b767e9796667ab019164e922c54c6c169_1280.jpg",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
  "https://pixabay.com/get/g9a7fe4242672c4c467ec9bd6f973781ea95ec26cd3e9689210a4996a1e6a3b47a94ccb10615599a625b0149b0e644944c542f5350fc2a6f3936270c7dce915df_1280.jpg",
  "https://pixabay.com/get/g0d3fbb48df334e6d57108df6cf1df844e1f2a04e4af6ad608752d563bc87f7642bd8aa64e856b1bb3a332f45dfcbdf0a7279dbe68aa50120ac2ca56f9778683e_1280.jpg",
];

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const categoryColor = CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-800";
  const imageUrl = POST_IMAGES[post.id % POST_IMAGES.length];
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <img 
        src={imageUrl} 
        alt={post.title}
        className="w-full h-48 object-cover" 
      />
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
          <Badge className={categoryColor}>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </Badge>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-charcoal mb-3 hover:text-terracotta transition-colors cursor-pointer">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-terracotta rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {post.authorInitials}
              </span>
            </div>
            <span className="text-sm text-gray-600">{post.author}</span>
          </div>
          
          <Button variant="ghost" className="text-terracotta hover:text-terracotta/80 p-0">
            Read More
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
