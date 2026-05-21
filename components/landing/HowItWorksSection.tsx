"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Video } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: <Search className="w-6 h-6 text-white" />,
      title: "Investigación Automatizada",
      description: "Conectamos tu cuenta, definimos los competidores clave y extraemos diariamente sus contenidos más exitosos."
    },
    {
      number: "02",
      icon: <PenTool className="w-6 h-6 text-white" />,
      title: "Guionización Inteligente",
      description: "El sistema RAG analiza la estructura de los vídeos virales y redacta guiones originales con ganchos de alta retención."
    },
    {
      number: "03",
      icon: <Video className="w-6 h-6 text-white" />,
      title: "Generación de Vídeo",
      description: "Los guiones se envían al generador de avatar clonado de Inteligencia Artificial, donde tu réplica digital cobra vida, y recibes el vídeo listo para subir a redes sociales."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Cómo funciona QBOSS AI</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Un proceso en 3 pasos que te ahorra horas de trabajo cada semana.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8 inline-block">
                  <div className="w-20 h-20 bg-dark-800 rounded-2xl border border-white/10 flex items-center justify-center relative z-10 shadow-xl">
                    <div className="bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 text-6xl font-bold text-white/5 select-none pointer-events-none z-0">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
