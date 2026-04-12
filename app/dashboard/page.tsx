"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, FileDown, Video, CheckCircle2 } from "lucide-react";
import { generatePDF } from "@/lib/pdfGenerator";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [niche, setNiche] = useState("");
  const [competitors, setCompetitors] = useState(["", "", ""]);
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

  return (
    <div className="space-y-8">
      <header className="mb-8 border-b border-white/5 pb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Nueva Máquina Viral
        </h1>
        <p className="text-gray-400 mt-2">Extrae los mejores ángulos de tus competidores usando Apify e IA.</p>
      </header>

      {status === "IDLE" || status === "LOADING" ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 border border-white/5 p-6 rounded-2xl max-w-2xl"
        >
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Tu Nicho / Temática</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Ejemplo: Tips de Finanzas, Marketing para Clínicas..."
                className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Competidores (Usuarios de Instagram/TikTok)</label>
              <div className="space-y-3">
                {competitors.map((comp, index) => (
                  <input
                    key={index}
                    type="text"
                    value={comp}
                    onChange={(e) => handleCompetitorChange(index, e.target.value)}
                    placeholder={`Competidor ${index + 1} (@usuario)`}
                    className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-primary focus:border-transparent transition-all"
                    required={index === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "LOADING"}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] disabled:opacity-50"
            >
              {status === "LOADING" ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando...
                </div>
              ) : "Generar Insights Virales"}
            </button>
          </form>
        </motion.div>
      ) : status === "PROCESSING" ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 bg-dark-800 border border-white/5 rounded-2xl max-w-2xl text-center shadow-[0_0_50px_rgba(79,70,229,0.1)]"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
          </div>
          <h2 className="mt-8 text-2xl font-bold text-white">Analizando Datos</h2>
          <p className="mt-2 text-gray-400 max-w-md">
            Nuestro sistema está haciendo scraping con Apify, evaluando métricas e instruyendo a la inteligencia artificial... Esto tomará un par de minutos.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-800 border-2 border-primary/20 p-8 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.1)]"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">¡Generación Completada!</h2>
              <p className="text-gray-400">Tus guiones virales están listos.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <button 
              onClick={() => generatePDF(projectData)}
              className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-xl transition-all group"
            >
              <div className="p-3 bg-primary/20 rounded-full text-primary group-hover:scale-110 transition-transform">
                <FileDown className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-white">Exportar PDF</div>
                <div className="text-sm text-gray-400">Guiones, ideas y hooks</div>
              </div>
            </button>

            <button 
              className={`flex items-center justify-center gap-3 border p-6 rounded-xl transition-all group ${
                (session?.user as any)?.plan === "PRO" 
                ? "bg-white/5 hover:bg-white/10 border-purple-500/30 hover:border-purple-500"
                : "bg-black/20 border-white/5 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="p-3 bg-purple-500/20 rounded-full text-purple-400 group-hover:scale-110 transition-transform">
                <Video className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-white">Auto-Vídeo HeyGen</div>
                <div className="text-sm text-gray-400">
                  {(session?.user as any)?.plan === "PRO" ? "Generar ahora" : "Plan Pro requerido"}
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8">
             <button onClick={() => setStatus("IDLE")} className="text-sm text-gray-500 hover:text-white underline">
               Volver a empezar
             </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
