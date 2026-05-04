"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 font-medium text-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            La nueva era de la creación de contenido
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white">
            Domina el contenido viral con <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Inteligencia Artificial</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Analiza a tus competidores, extrae patrones ganadores y genera guiones y vídeos listos para publicar en cuestión de minutos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,91,245,0.4)] hover:shadow-[0_0_30px_rgba(59,91,245,0.6)]">
              Comenzar Ahora <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
              <PlayCircle className="w-5 h-5 text-gray-300" /> Ver Demo
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-white/10 bg-dark-800/80 p-2 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>
            {/* Using the generated image */}
            <img 
              src="/dashboard-mockup.png" 
              alt="QBOSS AI Dashboard" 
              className="w-full h-auto rounded-xl border border-white/5"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
