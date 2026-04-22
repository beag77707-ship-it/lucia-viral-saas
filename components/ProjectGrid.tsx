"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, Calendar, Hash, Video, Settings, PlayCircle, Loader2, X, Film, Sparkles, Download } from "lucide-react";
import { generatePDF } from "@/lib/pdfGenerator";
import ReelsGallery from "./ReelsGallery";

export default function ProjectGrid({ initialProjects }: { initialProjects: any[] }) {
  const [selectedProjectForVideos, setSelectedProjectForVideos] = useState<any | null>(null);
  const [selectedProjectForIdeas, setSelectedProjectForIdeas] = useState<any | null>(null);
  const [activatingProjectId, setActivatingProjectId] = useState<string | null>(null);
  const [generatingCarouselIdx, setGeneratingCarouselIdx] = useState<number | null>(null);

  const handleGenerateVideos = async (projectId: string) => {
    setActivatingProjectId(projectId);
    try {
      const res = await fetch("/api/premium/activate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      
      if (res.ok) {
        alert("¡Generación de vídeos iniciada! En unos 20-40 min estarán listos.");
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "No se pudo iniciar"));
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setActivatingProjectId(null);
    }
  };

  const handleGenerateCarousel = async (projectId: string, ideaIndex: number, idea: any) => {
    setGeneratingCarouselIdx(ideaIndex);
    try {
      const res = await fetch("/api/carousel/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, ideaIndex, idea }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + (data.error || "No se pudo iniciar"));
        return false;
      }
      return true;
    } catch (error) {
      alert("Error de conexión");
      return false;
    } finally {
      setGeneratingCarouselIdx(null);
    }
  };

  const handleGenerateAllCarousels = async (project: any) => {
    if (!project.resultJSON || !Array.isArray(project.resultJSON)) return;

    // Revisamos si hay ideas sin generar
    const hasUnfinished = project.resultJSON.some((idea: any) => !idea.carousel);
    if (!hasUnfinished) {
      // Si ya están todas generadas, solo abrimos el modal
      setSelectedProjectForIdeas(project);
      return; 
    }

    // 1. Preguntamos al usuario si quiere generarlos
    const confirmGenerate = window.confirm("¿Quieres iniciar la generación de los carruseles de tus guiones?");
    if (!confirmGenerate) return;

    // 2. Abrimos el modal para que el usuario vea el progreso
    setSelectedProjectForIdeas(project);
    
    // 3. Lanzamos la generación en bucle
    for (let i = 0; i < project.resultJSON.length; i++) {
      if (!project.resultJSON[i].carousel) {
        const success = await handleGenerateCarousel(project.id, i, project.resultJSON[i]);
        if (!success) break; // Detener si hay error de límite de créditos
      }
    }
  };

  if (initialProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Video className="w-10 h-10 text-primary opacity-80" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Aún no tienes proyectos</h2>
        <p className="text-gray-400 max-w-md">
          Genera tu primer calendario de contenido viral desde el Dashboard para verlo aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialProjects.map((project, index) => {
        // Parsear el string de resultJSON que viene de la base de datos a un objeto vivo
        let parsedResult = null;
        if (project.resultJSON) {
          try {
            parsedResult = typeof project.resultJSON === "string" 
              ? JSON.parse(project.resultJSON) 
              : project.resultJSON;
          } catch(e) {}
        }
        
        const projectData = { ...project, resultJSON: parsedResult };
        const isCompleted = project.status === "COMPLETED";

        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-all shadow-sm hover:shadow-xl flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  isCompleted 
                    ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                    : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                }`}>
                  {isCompleted ? "Completado" : "Procesando"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-1">{project.niche || "Sin nicho"}</h3>

            <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
              {isCompleted ? (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary-rgb), 0.15)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedProjectForVideos(project)}
                      className="flex flex-col items-center justify-center gap-1 bg-white/5 text-primary text-[10px] font-black uppercase tracking-wider py-2 rounded-xl border border-primary/20 transition-all"
                    >
                      <Film className="w-3.5 h-3.5" />
                      Reels ({project.videos?.length || 0})
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenerateAllCarousels(projectData)}
                      className="flex flex-col items-center justify-center gap-1 bg-white/5 text-emerald-400 text-[10px] font-black uppercase tracking-wider py-2 rounded-xl border border-emerald-500/20 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Carruseles
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => generatePDF(projectData)}
                      className="flex flex-col items-center justify-center gap-1 bg-white text-black text-[10px] font-black uppercase tracking-wider py-2 rounded-xl transition-all shadow-lg"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Descargar PDF
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => { window.location.href = '/dashboard/settings'; }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-purple-500/20 group"
                  >
                    <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                    ⚙️ Configurar Vídeos IA
                  </motion.button>
                </>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-4 rounded-2xl bg-white/5 border border-dashed border-white/10">
                   <div className="relative mb-2">
                      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                   </div>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">Optimizando contenido...</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {selectedProjectForVideos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-dark-900 border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedProjectForVideos(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <h3 className="text-3xl font-black text-white italic tracking-tight mb-2">REELS GENERADOS</h3>
                <p className="text-gray-400">Proyecto: <span className="text-primary font-bold">{selectedProjectForVideos.niche}</span></p>
              </div>

              <ReelsGallery videos={selectedProjectForVideos.videos} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProjectForIdeas && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-dark-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedProjectForIdeas(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tight mb-2">IDEAS GENERADAS</h3>
                  <p className="text-gray-400">Proyecto: <span className="text-primary font-bold">{selectedProjectForIdeas.niche}</span></p>
                </div>
                <button
                  onClick={() => generatePDF(selectedProjectForIdeas)}
                  className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  Descargar PDF
                </button>
              </div>

              <div className="space-y-6">
                {selectedProjectForIdeas.resultJSON && Array.isArray(selectedProjectForIdeas.resultJSON) ? (
                  selectedProjectForIdeas.resultJSON.map((idea: any, idx: number) => (
                    <div key={idx} className="bg-dark-800 p-6 rounded-2xl border border-white/5">
                      <h4 className="text-lg font-bold text-white mb-2">{idea.titulo || idea.title || `Idea ${idx + 1}`}</h4>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{idea.guion || idea.full_script}</p>
                      
                      {idea.carousel ? (
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-5 mt-4">
                          <h5 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" /> Carrusel y Arte Generado
                          </h5>
                          
                          <div className="space-y-4">
                            {idea.carousel.carousels?.[0]?.canva_payload?.pages?.map((page: any, pIdx: number) => (
                              <div key={pIdx} className="bg-black/40 rounded-xl p-4 border border-white/5 flex gap-4 items-start">
                                {page.generated_image_url ? (
                                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10 group">
                                    <img 
                                      src={page.generated_image_url} 
                                      alt="Generado por DALL-E" 
                                      className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                                    />
                                    <a 
                                      href={page.generated_image_url} 
                                      download={`slide_${pIdx + 1}.jpg`}
                                      target="_blank"
                                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                      <Download className="w-6 h-6 text-white" />
                                    </a>
                                  </div>
                                ) : (
                                  <div className="w-24 h-24 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                    <span className="text-[10px] text-gray-500 uppercase">Sin Imagen</span>
                                  </div>
                                )}
                                <div>
                                  <p className="text-white text-sm font-semibold mb-1">Slide {pIdx + 1}</p>
                                  <p className="text-gray-400 text-xs italic">"{page.text}"</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Botón de copiar JSON para Canva si lo necesitan manual */}
                          <div className="mt-4 pt-4 border-t border-green-500/20">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(idea.carousel, null, 2));
                                alert("¡JSON Copiado para usar en la app de Bulk Create de Canva!");
                              }}
                              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                            >
                              <FileDown className="w-4 h-4" /> Copiar Datos para Canva
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGenerateCarousel(selectedProjectForIdeas.id, idx, idea)}
                          disabled={generatingCarouselIdx === idx}
                          className="bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/30 transition-colors disabled:opacity-50"
                        >
                          {generatingCarouselIdx === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          Generar Diseño Completo (IA)
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Las ideas aún no están disponibles o el formato no es compatible.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
