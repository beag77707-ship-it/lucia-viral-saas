import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const videoFile = formData.get("video") as File;
    const audioFile = formData.get("audio") as File;
    const scenarios = formData.get("scenarios") as string; // JSON string array

    if (!videoFile || !audioFile) {
      return NextResponse.json({ error: "Faltan archivos" }, { status: 400 });
    }

    const userEmail = session.user.email!;
    
    // 1. Subir Video a Supabase Storage
    const videoPath = `avatars/${userEmail}/video_${Date.now()}.mp4`;
    const { data: videoData, error: videoError } = await supabase.storage
      .from("avatars")
      .upload(videoPath, videoFile);

    if (videoError) throw videoError;

    // 2. Subir Audio a Supabase Storage
    const audioPath = `avatars/${userEmail}/audio_${Date.now()}.mp3`;
    const { data: audioData, error: audioError } = await supabase.storage
      .from("avatars")
      .upload(audioPath, audioFile);

    if (audioError) throw audioError;

    // 3. Obtener URLs públicas (o firmadas si fuera necesario)
    const { data: { publicUrl: videoUrl } } = supabase.storage.from("avatars").getPublicUrl(videoPath);
    const { data: { publicUrl: audioUrl } } = supabase.storage.from("avatars").getPublicUrl(audioPath);

    // 4. Actualizar estado del usuario en la DB
    await prisma.user.update({
      where: { email: userEmail },
      data: {
        heygenStatus: "PENDING_AVATAR",
      },
    });

    // 5. Notificar a n8n (Webhook para el admin)
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "AVATAR_FILES_UPLOADED",
          email: userEmail,
          videoUrl,
          audioUrl,
          scenarios: JSON.parse(scenarios || "[]")
        }),
      }).catch(err => console.error("Error notificando a n8n:", err));
    }

    return NextResponse.json({ message: "Archivos subidos con éxito" });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
  }
}
