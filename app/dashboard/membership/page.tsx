import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AvatarForm from "@/components/AvatarForm";
import { ArrowLeft, UserCircle, HelpCircle, Key, CheckCircle2, ChevronRight, Video } from "lucide-react";
import Link from "next/link";

export default async function AvatarConfigPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return <div>No autorizado</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { heygenAvatarId: true, heygenVoiceId: true }
  });

  const projects = await prisma.project.findMany({
    where: { 
      userId: (session.user as any).id,
      status: "COMPLETED" 
    },
    orderBy: { createdAt: 'desc' },
    select: { id: true, niche: true }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-sm text-primary flex items-center gap-1 hover:underline mb-2">
            <ArrowLeft className="w-3 h-3" /> Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-black italic tracking-tight flex items-center gap-3">
             CONFIGURAR AVATAR IA
          </h1>
          <p className="text-gray-400">Guía simple para conectar tu identidad digital con LucIA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Steps */}
          <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-primary w-5 h-5" /> Pasos para el Avatar
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0 text-sm">1</div>
                <div>
                  <p className="text-white font-bold text-xs mb-1">Crea tu "Instant Avatar"</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    En HeyGen, crea un <span className="text-white">Instant Avatar</span> y graba tu vídeo de consentimiento.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0 text-sm">2</div>
                <div>
                  <p className="text-white font-bold text-xs mb-1">Copia el Avatar ID</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    En los <span className="text-white">...</span> del avatar, dale a <span className="text-primary">Copy ID</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Steps */}
          <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Mic className="text-primary w-5 h-5" /> Pasos para la Voz
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0 text-sm">1</div>
                <div>
                  <p className="text-white font-bold text-xs mb-1">Clona tu Voz</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Ve a <span className="text-white">Voices -> Personal Voice -> Create a Voice</span>. Sube un audio tuyo de 1 min.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0 text-sm">2</div>
                <div>
                  <p className="text-white font-bold text-xs mb-1">Copia el Voice ID</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Una vez creada, clica en la voz y copia el <span className="text-primary">Voice ID</span> que aparece en su panel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Advanced Form */}
        <div className="space-y-6">
          <div className="bg-dark-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Key className="text-primary w-5 h-5" /> Configuración y Creación
            </h2>
            
            <AvatarForm 
              initialId={user?.heygenAvatarId || ""} 
              initialVoiceId={user?.heygenVoiceId || ""}
              projects={projects}
            />
            
            <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-4">Estado del Flujo</p>
                <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400 font-bold">Flujo n8n listo para recibir tu ID</span>
                </div>
            </div>
          </div>

          <div className="p-6 border border-dashed border-white/10 rounded-3xl bg-black/20 flex items-start gap-4">
             <Video className="w-5 h-5 text-gray-500 flex-shrink-0" />
             <p className="text-[11px] text-gray-500 leading-relaxed">
               Al configurar este ID, todos los proyectos que lances desde el Dashboard usarán automáticamente tu clon digital.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
