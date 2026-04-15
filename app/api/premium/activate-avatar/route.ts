import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    // En un entorno real, aquí verificaríamos que el usuario es ADMIN
    // Por ahora, permitiremos que el usuario "active" su propio avatar si tiene el ID
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { avatarId, targetUserEmail } = await req.json();

    if (!avatarId) {
      return NextResponse.json({ error: "Falta el ID del Avatar" }, { status: 400 });
    }

    // Si no se especifica targetUserEmail, usamos el actual
    const emailToUpdate = targetUserEmail || session.user.email;

    // 1. Actualizar el usuario con el ID del avatar
    const user = await prisma.user.update({
      where: { email: emailToUpdate },
      data: {
        heygenAvatarId: avatarId,
        heygenStatus: "GENERATING_VIDEOS",
      },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    // 2. Disparar flujo de generación de videos en n8n
    // Enviamos el avatarId y el último proyecto del usuario (que tiene las ideas/guiones)
    if (process.env.N8N_WEBHOOK_URL && user.projects.length > 0) {
      const lastProject = user.projects[0];
      
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "START_VIDEO_GENERATION",
          userId: user.id,
          avatarId: avatarId,
          projectId: lastProject.id,
          ideas: lastProject.resultJSON // Aquí están los guiones
        }),
      }).catch(err => console.error("Error disparando generación en n8n:", err));
    }

    return NextResponse.json({ message: "Avatar activado y generación iniciada" });
  } catch (error: any) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
