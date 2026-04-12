"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PlayCircle, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isRegistering) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
    }

    const signInRes = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (signInRes?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-300">Inteligencia Artificial Viral</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Domina el contenido viral.
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
            Analiza a tus competidores, extrae los patrones ganadores con IA y genera ideas, guiones y vídeos listos para publicar en segundos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center lg:items-start text-sm text-gray-400">
            <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-400" /> Analítica Apify</div>
            <div className="flex items-center gap-2"><PlayCircle className="w-5 h-5 text-purple-400" /> Auto-Vídeo HeyGen</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-dark-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              {isRegistering ? "Crea tu cuenta" : "Inicia sesión"}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="ejemplo@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Procesando..." : (isRegistering ? "Registrarse" : "Entrar al Dashboard")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
