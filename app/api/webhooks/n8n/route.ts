import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, resultJSON, pdfUrl, videoUrl, status } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const updateData: any = {};
    if (resultJSON !== undefined) updateData.resultJSON = typeof resultJSON === "string" ? JSON.parse(resultJSON) : resultJSON;
    if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (status) updateData.status = status;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Project updated successfully", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("N8N Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
