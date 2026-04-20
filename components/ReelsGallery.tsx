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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-dark-800/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 shadow-2xl flex flex-col"
          >
            {/* Video Preview Section */}
            <div className="aspect-[9/16] relative bg-black/40 group-hover:bg-black/20 transition-colors">
              {video.videoUrl ? (
                <video 
                  src={video.videoUrl} 
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-dark-900/50 gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                    <Film className="w-8 h-8 text-primary/40" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Procesando vídeo...</span>
                </div>
              )}
            </div>

            {/* Content & Actions Section */}
            <div className="p-5 space-y-4 bg-gradient-to-b from-transparent to-black/20">
              <div className="space-y-1">
                <h4 className="font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                  {video.title || "Sin título"}
                </h4>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed italic">
                  "{video.script || "Guion generado"}"
                </p>
              </div>
              
              <div className="flex items-center justify-between py-2 border-y border-white/5">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Escenario</span>
                  <span className="text-xs text-primary font-semibold">{video.scenario || "Marketing"}</span>
                </div>
                <div className="h-7 px-2.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400 font-bold">LISTO</span>
                </div>
              </div>

              <a 
                href={video.videoUrl} 
                download 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary hover:bg-primary-600 text-white text-xs font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                <Download className="w-4 h-4" /> 
                DESCARGAR REEL IA
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
