"use client";

import { useState } from "react";
import { Video, Loader2, CheckCircle2, User, UserCheck, Briefcase, Mic, Sparkles, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  niche: string;
}

export default function AvatarForm({ 
  initialId, 
  initialVoiceId, 
  projects 
}: { 
  initialId: string, 
  initialVoiceId: string, 
  projects: Project[] 
}) {
  const [avatarId, setAvatarId] = useState(initialId);
  const [voiceId, setVoiceId] = useState(initialVoiceId);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "activating">("idle");

  const presets = {
    man: {
      avatar: "c967938e10ec48f68f76e0579190de83",
      voice: "192038b460ae40cbb1ee946ff5caa459"
    },
    woman: {
      avatar: "d993f02290684062aee26517e14d5f7e",
      voice: "0bbfbda5aa924a68a9d1da7b8496052a"
    }
  };

  const setPreset = (type: "man" | "woman") => {
    setAvatarId(presets[type].avatar);
    setVoiceId(presets[type].voice);
    setStatus("idle");
  };

  const handleCreateReels = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert("Por favor selecciona un proyecto primero.");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      const saveRes = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId, voiceId }),
      });
      if (!saveRes.ok) throw new Error("Error al guardar configuración");

      setStatus("activating");
      const activateRes = await fetch("/api/premium/activate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectId: selectedProjectId,
          avatarId: avatarId,
          voiceId: voiceId
        }),
      });

      if (activateRes.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        const data = await activateRes.json();
        alert("Error: " + (data.error || "No se pudo iniciar el flujo"));
        setStatus("idle");
      }
    } catch (error) {
      alert("Error de conexión");
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateReels} className="space-y-8">
      
      {/* BLOQUE A: AVATARES DE STOCK */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-inner">
        <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-white/90">Opción 1: Avatares de Stock (Listo para usar)</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPreset("man")}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              avatarId === presets.man.avatar 
                ? "border-primary bg-primary/10" 
                : "border-white/5 bg-black/20 hover:border-white/20"
            }`}
          >
            <div className={`p-3 rounded-xl ${avatarId === presets.man.avatar ? "bg-primary text-white" : "bg-white/5 text-gray-500"}`}>
               <User className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black tracking-tighter uppercase">Hombre (Marco)</span>
          </button>

          <button
            type="button"
            onClick={() => setPreset("woman")}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              avatarId === presets.woman.avatar 
                ? "border-primary bg-primary/10" 
                : "border-white/5 bg-black/20 hover:border-white/20"
            }`}
          >
            <div className={`p-3 rounded-xl ${avatarId === presets.woman.avatar ? "bg-primary text-white" : "bg-white/5 text-gray-500"}`}>
               <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black tracking-tighter uppercase">Mujer (Sophia)</span>
          </button>
        </div>
      </div>

      {/* BLOQUE B: AVATAR PERSONALIZADO */}
      <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 shadow-inner shadow-primary/5">
        <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-4 h-4 text-primary" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-primary">Opción 2: Tu propio Avatar (Personalizado)</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase text-gray-400 px-1">Tu HeyGen Avatar ID</label>
            <input
              type="text"
              value={avatarId}
              onChange={(e) => setAvatarId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-mono focus:border-primary/50 outline-none"
              placeholder="Ej: d993f022906..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase text-gray-400 px-1 flex items-center gap-1">
              <Mic className="w-3 h-3" /> Tu HeyGen Voice ID
            </label>
            <input
              type="text"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-mono focus:border-primary/50 outline-none"
              placeholder="Ej: 192038b460..."
            />
          </div>
        </div>
      </div>

      {/* BLOQUE C: PROYECTO Y LANZAMIENTO */}
      <div className="space-y-4 pt-4">
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block px-1 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> SELECCIONA EL PROYECTO PARA LOS REELS
            </label>
            <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-dark-900 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary/50 transition-all cursor-pointer appearance-none"
            required
            >
            {projects.length === 0 && <option value="">No hay proyectos completados</option>}
            {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-dark-900">
                {p.niche} ({p.id.slice(-4)})
                </option>
            ))}
            </select>
        </div>

        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || projects.length === 0}
            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.25em] text-[14px] flex items-center justify-center gap-3 shadow-2xl transition-all ${
            status === "success" 
                ? "bg-green-500 shadow-green-500/20" 
                : "bg-gradient-to-r from-primary to-purple-600 shadow-primary/20"
            }`}
        >
            <AnimatePresence mode="wait">
            {loading ? (
                <motion.div key="loader" className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{status === "activating" ? "CONECTANDO n8n..." : "GUARDANDO..."}</span>
                </motion.div>
            ) : status === "success" ? (
                <motion.div key="success" className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-6 h-6" />
                <span>REELS EN MARCHA</span>
                </motion.div>
            ) : (
                <motion.div key="idle" className="flex items-center gap-2 text-white">
                <Video className="w-6 h-6" />
                <span>🎬 CREAR REELS</span>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.button>
      </div>
    </form>
  );
}
