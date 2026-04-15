import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("--- N8N Webhook Received ---");
    console.log(JSON.stringify(body, null, 2));

    const { projectId, userId, email, resultJSON, pdfUrl, videoUrl, status, heygenStatus } = body;

    if (!projectId && !userId && !email) {
      return NextResponse.json({ error: "Missing identifier (projectId, userId or email)" }, { status: 400 });
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

      const project = await prisma.project.update({
        where: { id: projectId },
        data: updateData,
      });

      console.log(`Project ${projectId} updated successfully`);
      return NextResponse.json({ message: "Project updated", project });
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
  } catch (error) {
    console.error("N8N Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
