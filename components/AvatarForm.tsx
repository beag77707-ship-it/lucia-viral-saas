"use client";

import { useState } from "react";
import { Video, Loader2, CheckCircle2, User, UserCheck, Briefcase, Mic } from "lucide-react";
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
      // 1. Primero guardar la configuración del usuario
      const saveRes = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId, voiceId }),
      });

      if (!saveRes.ok) throw new Error("Error al guardar configuración");

      // 2. Activar la generación de vídeos inmediatamente
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
        alert("💥 ¡Generación Iniciada! En unos 20-40 min tus reels aparecerán en 'Mis Proyectos'.");
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
    <form onSubmit={handleCreateReels} className="space-y-6">
      
      {/* Selector de Avatar Predefinido */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 block px-1">
          Elige un Estilo de Avatar
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPreset("man")}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              avatarId === presets.man.avatar 
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" 
                : "border-white/5 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className={`p-3 rounded-xl ${avatarId === presets.man.avatar ? "bg-primary text-white" : "bg-white/5 text-gray-500"}`}>
               <User className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-tight">HOMBRE (MARCO)</span>
          </button>

          <button
            type="button"
            onClick={() => setPreset("woman")}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              avatarId === presets.woman.avatar 
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" 
                : "border-white/5 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className={`p-3 rounded-xl ${avatarId === presets.woman.avatar ? "bg-primary text-white" : "bg-white/5 text-gray-500"}`}>
               <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-tight">MUJER (SOPHIA)</span>
          </button>
        </div>
      </div>

      {/* Selector de Proyecto */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary/70 block px-1 flex items-center gap-1">
          <Briefcase className="w-3 h-3" /> Selecciona el Proyecto
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-all cursor-pointer appearance-none"
          required
        >
          {projects.length === 0 && <option value="">No hay proyectos listos</option>}
          {projects.map((p) => (
            <option key={p.id} value={p.id} className="bg-dark-900">
              {p.niche} ({p.id.slice(-4)})
            </option>
          ))}
        </select>
      </div>

      {/* Configuración Manual / Avanzada */}
      <div className="pt-4 border-t border-white/5 space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block px-1">ID del Avatar Personalizado</label>
          <input
            type="text"
            value={avatarId}
            onChange={(e) => setAvatarId(e.target.value)}
            placeholder="Pega tu Instant Avatar ID..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] focus:outline-none focus:border-primary/50 transition-all font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block px-1 flex items-center gap-1">
            <Mic className="w-3 h-3" /> ID de Voz Personalizada
          </label>
          <input
            type="text"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            placeholder="Pega tu Voice ID si tienes una propia..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] focus:outline-none focus:border-primary/50 transition-all font-mono"
          />
        </div>
      </div>

      {/* BOTÓN CREAR REELS */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading || projects.length === 0}
        className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[13px] flex items-center justify-center gap-3 transition-all shadow-2xl relative overflow-hidden group ${
          status === "success" 
            ? "bg-green-500 text-white shadow-green-500/20" 
            : "bg-gradient-to-r from-primary to-purple-600 text-white shadow-primary/20"
        }`}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
               <Loader2 className="w-5 h-5 animate-spin" />
               <span>{status === "activating" ? "INICIANDO FLUJO..." : "GUARDANDO..."}</span>
            </motion.div>
          ) : status === "success" ? (
            <motion.div key="success" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5" />
               <span>GENERACIÓN EN MARCHA</span>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-2">
               <Video className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               <span>🎬 CREAR REELS</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {projects.length === 0 && (
        <p className="text-center text-[10px] text-red-400 font-bold uppercase tracking-widest animate-pulse">
          ⚠️ Debes crear un proyecto primero para generar reels
        </p>
      )}
    </form>
  );
}
