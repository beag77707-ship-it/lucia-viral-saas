"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, Calendar, Hash, Video, Settings, PlayCircle, Loader2, X, Film } from "lucide-react";
import { generatePDF } from "@/lib/pdfGenerator";
import ReelsGallery from "./ReelsGallery";

export default function ProjectGrid({ initialProjects }: { initialProjects: any[] }) {
  const [selectedProjectForVideos, setSelectedProjectForVideos] = useState<any | null>(null);
  const [activatingProjectId, setActivatingProjectId] = useState<string | null>(null);

  const handleGenerateVideos = async (projectId: string) => {
    const avatarId = prompt("Ingresa el ID de tu Avatar de HeyGen:");
    if (!avatarId) return;

    setActivatingProjectId(projectId);
    try {
      const res = await fetch("/api/premium/activate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, avatarId }),
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

            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">{project.niche || "Sin nicho"}</h3>
            
            <div className="flex-1 space-y-3 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Competidores Analizados:</p>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let comps = [];
                    try { comps = JSON.parse(project.competitors); } catch(e) {}
                    return comps.map((c: string, i: number) => (
                      <span key={i} className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded inline-flex items-center gap-1 border border-white/5">
                        <Hash className="w-3 h-3 text-primary" /> {c.replace("@", "")}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
              {isCompleted ? (
                <>
                  <button
                    onClick={() => setSelectedProjectForVideos(project)}
                    className="w-full flex items-center justify-center gap-2 bg-primary/20 text-primary py-2.5 rounded-lg font-bold transition-all hover:bg-primary/30 active:scale-95 border border-primary/20"
                  >
                    <Film className="w-4 h-4" />
                    Ver Reels ({project.videos?.length || 0})
                  </button>
                  <button
                    onClick={() => {
                      // Usar el generador local (V2 robusto)
                      generatePDF(projectData);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-2.5 rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                  >
                    <FileDown className="w-4 h-4" />
                    📥 Descargar Reporte PDF
                  </button>

                  <button
                    onClick={() => handleGenerateVideos(project.id)}
                    disabled={activatingProjectId === project.id}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                  >
                    {activatingProjectId === project.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                    🎬 Crear Vídeos IA
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-dark-900 text-gray-500 py-2.5 rounded-lg font-medium cursor-not-allowed border border-white/5"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Trabajando...
                </button>
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
    </div>
  );
}
