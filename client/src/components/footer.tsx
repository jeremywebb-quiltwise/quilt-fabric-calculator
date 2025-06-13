import { Link } from "wouter";
import { Facebook, Instagram, Youtube, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-terracotta mb-6">QuiltCraft Studio</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Modern tools and resources for passionate quilters. Design, calculate, and create beautiful quilts with precision and creativity.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-terracotta/20 rounded-lg flex items-center justify-center text-terracotta hover:bg-terracotta hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-terracotta/20 rounded-lg flex items-center justify-center text-terracotta hover:bg-terracotta hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-terracotta/20 rounded-lg flex items-center justify-center text-terracotta hover:bg-terracotta hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Tools</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/calculator">
                  <span className="text-gray-300 hover:text-terracotta transition-colors cursor-pointer">
                    Fabric Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/studio">
                  <span className="text-gray-300 hover:text-terracotta transition-colors cursor-pointer">
                    Design Studio
                  </span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-terracotta transition-colors">
                  Pattern Library
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-terracotta transition-colors">
                  Color Picker
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Learn</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog">
                  <span className="text-gray-300 hover:text-terracotta transition-colors cursor-pointer">
                    Tutorials
                  </span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-terracotta transition-colors">
                  Video Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-terracotta transition-colors">
                  Patterns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-terracotta transition-colors">
                  Tips & Tricks
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-terracotta transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-terracotta transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-gray-300 hover:text-terracotta transition-colors cursor-pointer">
                    About
                  </span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-terracotta transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 QuiltCraft Studio. All rights reserved. Made with{" "}
            <Heart className="inline h-4 w-4 text-terracotta" /> for quilters everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
