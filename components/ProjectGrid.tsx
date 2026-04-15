"use client";

import { motion } from "framer-motion";
import { FileDown, Calendar, Hash, Video, Settings, PlayCircle, Loader2 } from "lucide-react";
import { generatePDF } from "@/lib/pdfGenerator";

export default function ProjectGrid({ initialProjects }: { initialProjects: any[] }) {
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

            <div className="mt-auto pt-4 border-t border-white/5">
              {isCompleted ? (
                <button
                  onClick={() => {
                    console.log("Downloading project:", project.id, "Data:", projectData);
                    if (project.pdfUrl) {
                      window.open(project.pdfUrl, '_blank');
                    } else {
                      generatePDF(projectData);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-2.5 rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                >
                  <FileDown className="w-4 h-4" />
                  Descargar PDF
                </button>
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
    </div>
  );
}
