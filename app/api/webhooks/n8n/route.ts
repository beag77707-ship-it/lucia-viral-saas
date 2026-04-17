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
      if (resultJSON !== undefined && resultJSON !== null) {
        try {
          updateData.resultJSON = typeof resultJSON === "string" ? JSON.parse(resultJSON) : resultJSON;
        } catch (e) {
          updateData.resultJSON = { rawText: resultJSON };
        }
      }
      if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl;
      if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
      if (status) updateData.status = status;

      console.log(`Attempting to update project ${projectId}...`);
      
      try {
        const project = await prisma.project.update({
          where: { id: projectId },
          data: updateData,
        });
        console.log(`Project ${projectId} updated successfully`);
        return NextResponse.json({ message: "Project updated", project });
      } catch (prismaError: any) {
        console.error("Prisma Update Error:", prismaError.message);
        return NextResponse.json({ 
          error: "Database update failed", 
          details: prismaError.message === "Record to update not found." ? "El projectId no existe en la base de datos." : prismaError.message
        }, { status: 404 });
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
  } catch (error: any) {
    console.error("CRITICAL N8N Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
