"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudUpload, 
  Video, 
  Music, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Download,
  Rocket
} from "lucide-react";
import { useSession } from "next-auth/react";

const SCENARIOS = [
  { id: "office", name: "Oficina Moderna", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200" },
  { id: "living-room", name: "Sala Minimalista", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=200" },
  { id: "studio", name: "Estudio Prof", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=200" },
  { id: "nature", name: "Naturaleza/Exterior", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=200" },
  { id: "abstract", name: "Fondo Abstracto", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200" },
];

export default function MembershipPage() {
  const { data: session, update } = useSession();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [heygenId, setHeygenId] = useState("");
  const [activating, setActivating] = useState(false);
  const [userStatus, setUserStatus] = useState<string>("IDLE");
  const [videos, setVideos] = useState<string[]>([]);

  // Fetch initial user status
  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch("/api/user/status"); // Necesitaremos este endpoint
      if (res.ok) {
        const data = await res.json();
        setUserStatus(data.heygenStatus || "IDLE");
        if (data.heygenVideoUrl) {
            try {
                setVideos(JSON.parse(data.heygenVideoUrl));
            } catch (e) {
                setVideos(data.heygenVideoUrl ? [data.heygenVideoUrl] : []);
            }
        }
      }
    };
    fetchStatus();
  }, []);

  const handleScenarioToggle = (id: string) => {
    if (selectedScenarios.includes(id)) {
      setSelectedScenarios(selectedScenarios.filter(s => s !== id));
    } else if (selectedScenarios.length < 3) {
      setSelectedScenarios([...selectedScenarios, id]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !audioFile || selectedScenarios.length === 0) {
      alert("Por favor sube ambos archivos y selecciona al menos 1 escenario.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("audio", audioFile);
    formData.append("scenarios", JSON.stringify(selectedScenarios));

    try {
      const res = await fetch("/api/premium/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUserStatus("PENDING_AVATAR");
        alert("¡Archivos subidos! El administrador ha sido notificado.");
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      alert("Error en la subida.");
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async () => {
    if (!heygenId) return;
    setActivating(true);
    try {
      const res = await fetch("/api/premium/activate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId: heygenId }),
      });
      if (res.ok) {
        setUserStatus("GENERATING_VIDEOS");
        alert("Generación iniciada con éxito.");
      }
    } catch (error) {
      alert("Error al activar avatar.");
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black tracking-tight text-white mb-3">
          Suscripción <span className="text-primary">PREMIUM</span>
        </h1>
        <p className="text-gray-400 text-lg">Crea tu avatar clonado y genera videos virales automáticos.</p>
      </header>

      {/* ETAPA 1: SUBIDA */}
      <section className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${userStatus !== 'IDLE' ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-dark-800 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CloudUpload className="text-primary" /> Paso 1: Sube tu Material
          </h2>
          <p className="text-sm text-gray-400 italic">Recuerda: El video y el audio deben durar menos de 1:30 min.</p>
          
          <div className="space-y-4">
            <div className={`relative group border-2 border-dashed rounded-2xl p-6 text-center transition-all ${videoFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-primary/50'}`}>
              <input 
                type="file" accept="video/*" 
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <Video className={`mx-auto w-10 h-10 mb-2 ${videoFile ? 'text-green-400' : 'text-gray-500'}`} />
              <p className="text-sm font-medium">{videoFile ? videoFile.name : "Subir Video (1:30 máx)"}</p>
            </div>

            <div className={`relative group border-2 border-dashed rounded-2xl p-6 text-center transition-all ${audioFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-primary/50'}`}>
              <input 
                type="file" accept="audio/*" 
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <Music className={`mx-auto w-10 h-10 mb-2 ${audioFile ? 'text-green-400' : 'text-gray-500'}`} />
              <p className="text-sm font-medium">{audioFile ? audioFile.name : "Subir Audio (1:30 máx)"}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
          <h2 className="text-xl font-bold">Selecciona Escenarios (Máx 3)</h2>
          <div className="grid grid-cols-2 gap-3">
            {SCENARIOS.map((scen) => (
              <button
                key={scen.id}
                onClick={() => handleScenarioToggle(scen.id)}
                className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                  selectedScenarios.includes(scen.id) ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                }`}
              >
                <img src={scen.img} alt={scen.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20" />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider">{scen.name}</span>
                {selectedScenarios.includes(scen.id) && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading || !videoFile || !audioFile || selectedScenarios.length === 0}
            className="w-full bg-primary hover:bg-primary-dark py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="animate-spin" /> : <Rocket className="w-5 h-5" />}
            {uploading ? "Subiendo..." : "Enviar a mi Asistente"}
          </button>
        </div>
      </section>

      {/* ESTADO DE ESPERA */}
      <AnimatePresence>
        {userStatus === "PENDING_AVATAR" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-900/40 border border-indigo-400/30 p-10 rounded-[2rem] text-center space-y-6"
          >
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            </div>
            <h2 className="text-3xl font-bold">Creando tu Avatar</h2>
            <p className="text-indigo-200/70 max-w-lg mx-auto leading-relaxed">
              Tus archivos han sido recibidos. Estamos configurando tu clon digital en HeyGen. Recibirás una notificación cuando estemos listos para generar tus videos.
            </p>
            
            {/* PANEL SECRETO PARA EL USUARIO (PARA ESTE CASO DE PRUEBA) */}
            <div className="pt-10 mt-10 border-t border-white/5 max-w-md mx-auto">
                <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">Panel de Activación (ID de HeyGen)</p>
                <div className="flex gap-2">
                    <input 
                        type="text" value={heygenId} onChange={e => setHeygenId(e.target.value)}
                        placeholder="ID del Avatar..."
                        className="flex-1 bg-dark-900 border border-white/10 rounded-lg px-4 py-2 text-sm"
                    />
                    <button 
                        onClick={handleActivate} disabled={activating}
                        className="bg-white text-black font-bold px-6 py-2 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50"
                    >
                        {activating ? "..." : "Activar"}
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GENERANDO VIDEOS */}
      <AnimatePresence>
        {userStatus === "GENERATING_VIDEOS" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/10 border border-primary/30 p-12 rounded-[3rem] text-center space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
                <motion.div 
                    initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="h-full w-1/3 bg-primary" 
                />
            </div>
            <h2 className="text-4xl font-bold text-white italic">PROCESO EN CURSO</h2>
            <div className="bg-black/40 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/5">
                <AlertCircle className="text-primary w-5 h-5" />
                <span className="text-sm font-semibold text-primary uppercase tracking-widest animate-pulse">
                    Este proceso puede tardar de 20 a 40 minutos...
                </span>
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              Estamos usando tu avatar clonado para grabar los 10 guiones virales que generamos previamente. Espera pacientemente mientras horneamos tu contenido.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIDEOS LISTOS */}
      {userStatus === "COMPLETED" && videos.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="text-green-400" /> Tus Videos Premium Estan Listos
            </h2>
            <p className="text-gray-500 text-sm">Contenido grabado con tu clon de IA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vidUrl, idx) => (
              <motion.div 
                key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className="group relative bg-dark-800 rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all"
              >
                <video src={vidUrl} className="w-full aspect-[9/16] object-cover" controls={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <a 
                        href={vidUrl} download={`video_${idx+1}.mp4`} target="_blank"
                        className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Download className="w-5 h-5" /> Descargar Reel
                    </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
