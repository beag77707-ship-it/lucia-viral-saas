import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    console.log("--- N8N Webhook Received ---");
    console.log("Content-Type:", contentType);

    let body;
    try {
      body = await req.json();
    } catch (e) {
      const rawBody = await req.text();
      console.error("Failed to parse JSON body. Raw body start:", rawBody.substring(0, 100));
      return NextResponse.json({ 
        error: "Invalid JSON body", 
        details: "El servidor esperaba un JSON pero recibió otra cosa (probablemente un archivo binario)." 
      }, { status: 400 });
    }

    console.log("Body Payload:", JSON.stringify(body, null, 2));

    const { projectId, userId, email, resultJSON, pdfUrl, videoUrl, status, heygenStatus } = body;

    if (!projectId && !userId && !email) {
      console.error("Webhook Error: Missing identifier (projectId, userId or email)");
      return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
    }

    // Caso 1: Actualizar Proyecto
    if (projectId) {
      const updateData: any = {};
      
      // Aseguramos que resultJSON sea siempre un STRING para la base de datos
      if (resultJSON !== undefined && resultJSON !== null) {
        if (typeof resultJSON === "object") {
          updateData.resultJSON = JSON.stringify(resultJSON);
        } else {
          updateData.resultJSON = resultJSON;
        }
      }
      
      if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl;
      if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
      if (status) updateData.status = status;

      console.log(`Updating project ${projectId} with data:`, updateData);
      
      try {
        const project = await prisma.project.update({
          where: { id: projectId },
          data: updateData,
        });
        console.log(`✅ Project ${projectId} updated successfully`);
        return NextResponse.json({ 
          message: "Project updated successfully", 
          projectId: project.id 
        });
      } catch (prismaError: any) {
        console.error("❌ Prisma Update Error:", prismaError.message);
        
        // Error específico para cuando el registro no existe
        if (prismaError.code === 'P2025') {
          return NextResponse.json({ 
            error: "Project not found", 
            details: `El projectId '${projectId}' no existe en tu base de datos. Asegúrate de que no has borrado el proyecto antes de que terminara el flujo.` 
          }, { status: 404 });
        }

        return NextResponse.json({ 
          error: "Database error", 
          details: prismaError.message 
        }, { status: 500 });
      }
    }

    // Caso 2: Actualizar Usuario (HeyGen)
    if (userId || email) {
      const updateData: any = {};
      if (videoUrl !== undefined) updateData.heygenVideoUrl = typeof videoUrl === "string" ? videoUrl : JSON.stringify(videoUrl);
      if (heygenStatus) updateData.heygenStatus = heygenStatus;
      
      const user = await prisma.user.update({
        where: userId ? { id: userId } : { email: email },
        data: updateData
      });

      console.log(`User ${user.id} updated successfully`);
      return NextResponse.json({ message: "User updated", user });
    }

    // Respuesta por defecto si no entra en ningún caso
    return NextResponse.json({ message: "Webhook received but no specific action taken" });
  } catch (error: any) {
    console.error("CRITICAL N8N Webhook Error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
