"use client";

import { motion } from "framer-motion";
import { TrendingUp, BrainCircuit, PlaySquare } from "lucide-react";

const features = [
  {
    icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
    title: "Análisis Apify",
    description: "Extraemos datos de los vídeos más virales de tu nicho para descubrir qué funciona exactamente hoy en día.",
    color: "from-blue-500/20 to-transparent",
    border: "border-blue-500/20"
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: "Generador RAG (Guiones IA)",
    description: "Nuestra IA redacta guiones optimizados para la retención, utilizando el conocimiento extraído y técnicas de copywriting probadas.",
    color: "from-primary/20 to-transparent",
    border: "border-primary/20"
  },
  {
    icon: <PlaySquare className="w-8 h-8 text-purple-400" />,
    title: "Producción con Avatar IA",
    description: "Convierte tus guiones en vídeos de alta calidad con avatares fotorrealistas y voces naturales de forma automática.",
    color: "from-purple-500/20 to-transparent",
    border: "border-purple-500/20"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Todo lo que necesitas para viralizar</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Un flujo de trabajo completamente automatizado desde la investigación hasta la producción final.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-dark-800 rounded-2xl p-8 border ${feature.border} relative overflow-hidden group hover:border-white/20 transition-colors`}
            >
              <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${feature.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="relative z-10">
                <div className="bg-dark-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
