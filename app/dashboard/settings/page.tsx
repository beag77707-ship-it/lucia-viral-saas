"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { 
  User, 
  Lock, 
  Moon, 
  Sun, 
  CreditCard, 
  Check, 
  Video,
  Upload, 
  Loader2, 
  UserCircle 
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Form states
  const [name, setName] = useState((session?.user as any)?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>((session?.user as any)?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (name) formData.append("name", name);
    if (password) formData.append("password", password);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        await update({
          name: data.user.name,
          image: data.user.image,
          plan: data.user.plan,
        });
        alert("¡Perfil actualizado con éxito!");
      } else {
        alert("Error al actualizar perfil");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanUpdate = async (planCode: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planCode }),
      });

      if (res.ok) {
        const data = await res.json();
        await update({ plan: data.plan });
        alert(`¡Plan ${planCode} activado correctamente!`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = (session?.user as any)?.plan || "BASIC";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-2">Administra tu cuenta, suscripción y preferencias visuales.</p>
      </header>

      <div className="flex gap-4 border-b border-border pb-px overflow-x-auto">
        {[
          { id: "profile", label: "Perfil", icon: User },
          { id: "plans", label: "Planes", icon: CreditCard },
          { id: "avatar", label: "Avatar Neuronal", icon: Video, hidden: currentPlan !== "PLAN_B" },
          { id: "appearance", label: "Apariencia", icon: Moon },
        ].filter(t => !t.hidden).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "border-primary text-primary font-semibold" 
                : "border-transparent text-gray-500 hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-border pb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-primary/20 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <Upload className="w-6 h-6" />
                  <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Foto de perfil</h3>
                <p className="text-sm text-muted-foreground">Haz clic en la imagen para subir una foto desde tu PC.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nombre de Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Correo Electrónico</label>
                <input 
                  type="email" 
                  disabled 
                  value={email}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-gray-400 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Dejar en blanco para no cambiar"
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-2.5 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar Cambios
              </button>
            </div>
          </form>
        )}

        {activeTab === "plans" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  id: "PLAN_A", 
                  title: "Maestro Viral", 
                  price: "29€", 
                  desc: "Generación de calendario y scripts potentes para 10 reels mensuales.",
                  features: ["Análisis de 3 competidores", "10 guiones virales", "Exportación PDF"]
                },
                { 
                  id: "PLAN_B", 
                  title: "Creador Avatar X HeyGen", 
                  price: "79€", 
                  desc: "Plan A + Generación automática de videos usando tu avatar neuronal.",
                  features: ["Todo el Plan A", "Integración HeyGen", "Videos con tu avatar", "Soporte Prioritario"]
                }
              ].map((plan) => (
                <div key={plan.id} className={`relative p-6 rounded-2xl border-2 transition-all ${
                  currentPlan === plan.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-gray-400"
                }`}>
                  {currentPlan === plan.id && (
                    <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <div className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Plan Sugerido</div>
                  <h3 className="text-xl font-bold text-foreground">{plan.title}</h3>
                  <div className="text-3xl font-black text-foreground my-4">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mes</span></div>
                  <p className="text-sm text-muted-foreground mb-6 h-12">{plan.desc}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-green-500" /> {f}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handlePlanUpdate(plan.id)}
                    disabled={loading || currentPlan === plan.id}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      currentPlan === plan.id 
                        ? "bg-muted text-gray-400 cursor-not-allowed" 
                        : "bg-foreground text-background hover:scale-105 active:scale-95"
                    }`}
                  >
                    {currentPlan === plan.id ? "Plan Actual" : "Activar Plan"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "avatar" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center bg-primary/5 p-6 rounded-2xl border border-primary/20">
              <div className="p-4 bg-primary/20 rounded-full text-primary">
                <Video className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Tu Avatar Neuronal</h3>
                <p className="text-muted-foreground">Configura tu "Digital Twin" para generar vídeos realistas con tu propia imagen y voz.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-foreground">1. Entrenamiento (10 min)</h4>
                <p className="text-sm text-muted-foreground italic mb-4">
                  Sube un vídeo de al menos 10 minutos gesticulando y hablando a cámara con buena iluminación.
                </p>
                
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all">
                  <input 
                    type="file" 
                    id="heygen-video"
                    className="hidden" 
                    accept="video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLoading(true);
                      const formData = new FormData();
                      formData.append("video", file);
                      try {
                        const res = await fetch("/api/user/heygen-upload", { method: "POST", body: formData });
                        if (res.ok) {
                          const data = await res.json();
                          alert("¡Vídeo de entrenamiento subido con éxito! Empezaremos el análisis ahora mismo.");
                          await update({ heygenStatus: "PENDING" }); 
                        } else {
                          alert("Error al subir el vídeo. Asegúrate de que no es demasiado pesado.");
                        }
                      } catch (e) { console.error(e); }
                      finally { setLoading(false); }
                    }}
                  />
                  <label htmlFor="heygen-video" className="cursor-pointer block">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div className="text-sm font-bold text-foreground">Haga clic para subir vídeo</div>
                    <div className="text-xs text-muted-foreground mt-1">MP4, MOV (Máx 500MB sugeridos)</div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-foreground">2. Estado del Avatar</h4>
                <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${
                      (session?.user as any)?.heygenStatus === "READY" ? "bg-green-500" : 
                      (session?.user as any)?.heygenStatus === "PENDING" ? "bg-orange-500 animate-pulse" : "bg-gray-500"
                    }`} />
                    <span className="font-bold text-sm uppercase tracking-wider">
                      {(session?.user as any)?.heygenStatus === "READY" ? "Listo para usar" : 
                       (session?.user as any)?.heygenStatus === "PENDING" ? "En revisión / Entrenando" : "No configurado"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {(session?.user as any)?.heygenStatus === "READY" 
                      ? "Tu avatar está conectado y listo. La generación de vídeos usará tu imagen digital." 
                      : "Sube tu vídeo para que nuestro equipo pueda empezar el entrenamiento de tu avatar neuronal."}
                  </p>
                  
                  {(session?.user as any)?.heygenStatus === "READY" && (
                     <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-500 text-xs">
                        <Check className="w-4 h-4" /> Avatar ID: {(session?.user as any)?.heygenAvatarId || "Conectado"}
                     </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Elige tu estilo visual</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setTheme("light")}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${
                  theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-orange-500">
                  <Sun className="w-8 h-8" />
                </div>
                <div className="font-bold text-foreground">Modo Claro</div>
              </button>

              <button 
                onClick={() => setTheme("dark")}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${
                  theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-[#0f172a] shadow-lg flex items-center justify-center text-blue-400">
                  <Moon className="w-8 h-8" />
                </div>
                <div className="font-bold text-foreground">Modo Oscuro</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
