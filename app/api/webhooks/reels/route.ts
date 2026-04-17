import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("--- N8N Reel Webhook Received ---");
    console.log(JSON.stringify(body, null, 2));

    const { projectId, title, script, videoUrl, scenario, status } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    // Crear un nuevo registro de Video (Reel) vinculado al proyecto
    const video = await prisma.video.create({
      data: {
        projectId,
        title,
        script,
        videoUrl,
        scenario,
        status: status || "COMPLETED",
      },
    });

    console.log(`Video ${video.id} created for project ${projectId}`);
    return NextResponse.json({ message: "Video created", video });
  } catch (error) {
    console.error("N8N Reel Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
