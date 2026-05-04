"use client";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>

      <footer className="py-8 border-t border-white/10 bg-dark-900 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} QBOSS AI. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
