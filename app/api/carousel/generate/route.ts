import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        plan: true, 
        carouselsGeneratedMonth: true,
        generationResetDate: true
      }
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Lógica de reseteo de mes
    const now = new Date();
    let { carouselsGeneratedMonth, generationResetDate } = userProfile;
    
    // Si han pasado 30 días, reseteamos los contadores
    if (now.getTime() - new Date(generationResetDate).getTime() > 30 * 24 * 60 * 60 * 1000) {
      carouselsGeneratedMonth = 0;
      await prisma.user.update({
        where: { id: userId },
        data: {
          scriptsGeneratedMonth: 0,
          carouselsGeneratedMonth: 0,
          generationResetDate: now
        }
      });
    }

    // Límites de carruseles por plan
    let limit = 4;
    if (userProfile.plan === "MEDIUM") limit = 6;
    if (userProfile.plan === "PRO") limit = 10;

    if (carouselsGeneratedMonth >= limit) {
      return NextResponse.json({ 
        error: `Has alcanzado tu límite mensual de ${limit} carruseles en el plan ${userProfile.plan}` 
      }, { status: 403 });
    }

    const body = await req.json();
    const { projectId, ideaIndex, idea } = body;

    if (!projectId || ideaIndex === undefined || !idea) {
      return NextResponse.json({ error: "Faltan datos requeridos (projectId, ideaIndex o idea)" }, { status: 400 });
    }

    // Incrementar el uso de carruseles mensuales
    await prisma.user.update({
      where: { id: userId },
      data: { carouselsGeneratedMonth: { increment: 1 } }
    });

    // Enviar al webhook de n8n específico para carruseles
    // Por defecto n8n estará escuchando en tu servidor de contabo
    const carouselWebhookUrl = "https://vmi3229350.contaboserver.net/webhook/generate-carousel";
    
    try {
      axios.post(carouselWebhookUrl, {
        userId,
        projectId,
        ideaIndex,
        idea,
        plan: userProfile.plan
      }).catch(err => console.error("Error disparando webhook de carrusel:", err.message));
    } catch (err) {
      console.error("Failed to trigger carousel webhook", err);
    }

    return NextResponse.json(
      { message: "Generación de carrusel iniciada con éxito", creditsRemaining: limit - (carouselsGeneratedMonth + 1) },
      { status: 202 }
    );
  } catch (error: any) {
    console.error("Carousel Generate Error:", error);
    return NextResponse.json({ 
      error: "Error interno al generar carrusel", 
      details: error.message || "Error desconocido"
    }, { status: 500 });
  }
}
