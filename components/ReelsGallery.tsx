"use client";

import { motion } from "framer-motion";
import { Download, Film, Sparkles, CheckCircle2 } from "lucide-react";

export default function ReelsGallery({ videos }: { videos: any[] }) {
  if (!videos || videos.length === 0) {
    return (
      <div className="bg-dark-800/50 border border-white/5 rounded-3xl p-10 text-center space-y-4">
        <Film className="w-12 h-12 text-gray-600 mx-auto" />
        <h3 className="text-xl font-bold text-gray-400">Aún no hay Reels generados</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Los vídeos aparecerán aquí automáticamente una vez que la IA termine de grabarlos en HeyGen.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-primary" /> Galería de Reels
        </h2>
        <span className="text-xs font-semibold px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> {videos.length} Listos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <motion.div
            key={video.id || idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-dark-800 rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all shadow-lg"
          >
            <div className="aspect-[9/16] relative bg-black">
              {video.videoUrl ? (
                <video 
                  src={video.videoUrl} 
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-dark-900 animate-pulse">
                  <Film className="w-10 h-10 text-gray-700" />
                </div>
              )}
              
              {/* Overlay with info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <h4 className="font-bold text-white mb-1 line-clamp-1">{video.title || "Sin título"}</h4>
                <p className="text-[10px] text-gray-400 mb-4 line-clamp-2 italic">"{video.script || "Guion generado"}"</p>
                
                <a 
                  href={video.videoUrl} 
                  download 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-black text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all transform active:scale-95"
                >
                  <Download className="w-4 h-4" /> Descargar Reel
                </a>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between border-t border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Escenario</span>
                    <span className="text-xs text-primary font-medium">{video.scenario || "Contextual"}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
