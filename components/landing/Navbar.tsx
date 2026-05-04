"use client";

import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-lg group-hover:bg-primary-dark transition-colors">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">QBOSS AI</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Características
              </Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Cómo Funciona
              </Link>
              <Link href="/login" className="text-white hover:text-primary transition-colors text-sm font-medium px-4 py-2 rounded-full border border-white/20 hover:border-primary">
                Iniciar Sesión
              </Link>
              <Link href="/login" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(59,91,245,0.4)] hover:shadow-[0_0_25px_rgba(59,91,245,0.6)]">
                Empezar Gratis
              </Link>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              <Link onClick={() => setIsOpen(false)} href="#features" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Características
              </Link>
              <Link onClick={() => setIsOpen(false)} href="#how-it-works" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Cómo Funciona
              </Link>
              <div className="pt-4 flex flex-col gap-3">
                <Link onClick={() => setIsOpen(false)} href="/login" className="text-center text-white border border-white/20 px-4 py-3 rounded-xl font-medium">
                  Iniciar Sesión
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/login" className="text-center bg-primary text-white px-4 py-3 rounded-xl font-medium">
                  Empezar Gratis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
