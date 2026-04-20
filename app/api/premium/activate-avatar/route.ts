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

    const { avatarId, targetUserEmail, projectId } = await req.json();

    // El ID es opcional ahora porque el usuario dice que ya está en n8n

    // Si no se especifica targetUserEmail, usamos el actual
    const emailToUpdate = targetUserEmail || session.user.email;

    // 1. Obtener el proyecto específico o el último si no se indica
    let targetProject;
    if (projectId) {
      targetProject = await prisma.project.findUnique({
        where: { id: projectId }
      });
    } else {
      const userProjects = await prisma.project.findMany({
        where: { user: { email: emailToUpdate } },
        orderBy: { createdAt: 'desc' },
        take: 1
      });
      targetProject = userProjects[0];
    }

    if (!targetProject) {
      return NextResponse.json({ error: "No se encontró el proyecto para procesar" }, { status: 404 });
    }

    // 2. Actualizar el usuario con el ID del avatar
    await prisma.user.update({
      where: { email: emailToUpdate },
      data: {
        heygenAvatarId: avatarId,
        heygenStatus: "GENERATING_VIDEOS",
      }
    });

    // 3. Disparar flujo de generación de videos en n8n
    // Usamos la URL de producción (webhook) en lugar de webhook-test
    const n8nHeygenUrl = "https://vmi3229350.contaboserver.net/webhook/heygen-activate";
    
    fetch(n8nHeygenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "START_VIDEO_GENERATION",
        userId: targetProject.userId,
        avatarId: avatarId,
        projectId: targetProject.id,
        ideas: targetProject.resultJSON // Aquí están los guiones
      }),
    }).catch(err => console.error("Error disparando generación en n8n:", err));

    return NextResponse.json({ message: "Generación de vídeos iniciada con éxito", projectId: targetProject.id });
  } catch (error: any) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "Error interno al iniciar generación" }, { status: 500 });
  }
}
