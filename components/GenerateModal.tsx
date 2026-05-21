"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, CheckCircle2, FileDown, Video } from "lucide-react";
import { generatePDF } from "@/lib/pdfGenerator";

interface GenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
}

export default function GenerateModal({ isOpen, onClose, session }: GenerateModalProps) {
  const [niche, setNiche] = useState("");
  const [competitors, setCompetitors] = useState(["", "", ""]);
  const [language, setLanguage] = useState("es-ES");
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "PROCESSING" | "COMPLETED">("IDLE");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);

  // Polling hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "PROCESSING" && projectId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/project/status/${projectId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === "COMPLETED") {
              setStatus("COMPLETED");
              setProjectData(data);
              clearInterval(interval);
            }
            if (data.status === "FAILED") {
              setStatus("IDLE");
              clearInterval(interval);
              alert("Error durante el procesamiento. Intenta de nuevo.");
            }
          }
        } catch (error) {
          console.error("Polling error", error);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [status, projectId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validCompetitors = competitors.filter(c => c.trim() !== "");
    if (!niche || validCompetitors.length === 0) {
      return alert("El nicho y al menos 1 competidor son obligatorios.");
    }

    setStatus("LOADING");
    try {
      const res = await fetch("/api/project/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          niche, 
          competitors: validCompetitors, 
          language,
          plan: (session?.user as any)?.plan || "BASIC" 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjectId(data.projectId);
        setStatus("PROCESSING");
      } else {
        alert(data.error);
        setStatus("IDLE");
      }
    } catch (error) {
      console.error(error);
      setStatus("IDLE");
      alert("Fallo al iniciar el proyecto.");
    }
  };

  const handleCompetitorChange = (index: number, value: string) => {
    const newComp = [...competitors];
    newComp[index] = value;
    setCompetitors(newComp);
  };

  const handleReset = () => {
    setStatus("IDLE");
    setProjectId(null);
    setProjectData(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-dark-800 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white">Create new content with AI</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {status === "IDLE" || status === "LOADING" ? (
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tu Nicho / Temática</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Ejemplo: Tips de Finanzas..."
                    className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Idioma del Contenido</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-primary focus:border-transparent transition-all"
                    required
                  >
                    <option value="es-ES">🇪🇸 Español (España)</option>
                    <option value="es-AR">🇦🇷 Español (Argentina)</option>
                    <option value="en-US">🇺🇸 Inglés</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Competidores (@usuario)</label>
                  <div className="space-y-3">
                    {competitors.map((comp, index) => (
                      <input
                        key={index}
                        type="text"
                        value={comp}
                        onChange={(e) => handleCompetitorChange(index, e.target.value)}
                        placeholder={`Competidor ${index + 1}`}
                        className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:ring-primary focus:border-transparent transition-all"
                        required={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={status === "LOADING"}
                    className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {status === "LOADING" ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Iniciando...
                      </div>
                    ) : "Generate Now"}
                  </button>
                </div>
              </form>
            ) : status === "PROCESSING" ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse"></div>
                  <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
                </div>
                <h3 className="mt-8 text-2xl font-bold text-white">Analizando Datos</h3>
                <p className="mt-2 text-gray-400 max-w-sm">
                  Extrayendo métricas y generando guiones virales...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">¡Generación Completada!</h3>
                <p className="text-gray-400 mb-8">Tus guiones virales están listos.</p>

                <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => generatePDF(projectData)}
                    className="flex flex-col items-center justify-center gap-3 bg-dark-900 hover:bg-white/5 border border-white/10 p-6 rounded-xl transition-all group"
                  >
                    <FileDown className="w-8 h-8 text-primary" />
                    <div className="font-bold text-white">Exportar PDF</div>
                  </button>

                  <button 
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl transition-all border ${
                      (session?.user as any)?.plan === "PRO" 
                      ? "bg-dark-900 hover:bg-white/5 border-purple-500/30"
                      : "bg-black/20 border-white/5 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <Video className="w-8 h-8 text-purple-400" />
                    <div className="font-bold text-white">Auto-Vídeo Clonado</div>
                  </button>
                </div>

                <button onClick={handleReset} className="mt-8 text-sm text-gray-500 hover:text-white underline">
                  Generar otro
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
