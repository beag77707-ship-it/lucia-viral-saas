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
    // Usamos webhook-test para que puedas verlo en tiempo real mientras lo tienes abierto
    // Volvemos a HTTPS sin puerto porque es el que sabemos que funciona en tu Contabo
    const n8nHeygenUrl = "https://vmi3229350.contaboserver.net/webhook-test/heygen-activate";
    
    let ideasPayload = targetProject.resultJSON;
    try {
      if (typeof ideasPayload === 'string') {
        ideasPayload = JSON.parse(ideasPayload);
      }
      // Si el JSON tiene la forma { ideas: [...] }, extraemos solo el array
      if (ideasPayload && typeof ideasPayload === 'object' && !Array.isArray(ideasPayload) && (ideasPayload as any).ideas) {
        ideasPayload = (ideasPayload as any).ideas;
      }
    } catch (e) {
      console.error("Error parsing resultJSON:", e);
    }

    console.log("Intentando activar flujo en n8n:", n8nHeygenUrl);

    try {
      const n8nResponse = await fetch(n8nHeygenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "START_VIDEO_GENERATION",
          userId: targetProject.userId,
          avatarId: avatarId || "HARDCODED_IN_N8N",
          projectId: targetProject.id,
          ideas: ideasPayload // Ahora siempre es el array directo [...]
        }),
      });

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        console.error("Error n8n (Status " + n8nResponse.status + "):", errorText);
        return NextResponse.json({ 
          error: `n8n respondió con error ${n8nResponse.status}. Asegúrate de que el flujo esté en modo 'Listen for Test Event'.` 
        }, { status: n8nResponse.status });
      }

      return NextResponse.json({ 
        message: "Generación de vídeos iniciada con éxito", 
        projectId: targetProject.id 
      });
    } catch (fetchError: any) {
      console.error("Fetch Error:", fetchError);
      return NextResponse.json({ 
        error: `No se pudo conectar con n8n: ${fetchError.message}. Revisa si la URL es correcta.` 
      }, { status: 502 });
    }
  } catch (error: any) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "Error interno al iniciar generación" }, { status: 500 });
  }
}
