"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AvatarForm({ initialId }: { initialId: string }) {
  const [avatarId, setAvatarId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarId }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Error al guardar el ID");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-primary/70">HeyGen Avatar ID</label>
        <input
          type="text"
          value={avatarId}
          onChange={(e) => setAvatarId(e.target.value)}
          placeholder="ej: 2184d54bd29e47c194d5143e4328e90c"
          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-all font-mono"
          required
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
          success 
            ? "bg-green-500 text-white shadow-green-500/20" 
            : "bg-primary text-white shadow-primary/20 hover:brightness-110"
        }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : success ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {success ? "¡ID GUARDADO!" : "GUARDAR CONFIGURACIÓN"}
      </motion.button>
    </form>
  );
}
