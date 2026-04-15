import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const formData = await req.formData();
    const file = formData.get("video") as File;

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Guardar con un nombre único
    const fileName = `heygen-${userId}-${Date.now()}.mp4`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", "heygen", fileName);
    
    await writeFile(uploadPath, buffer);
    const videoUrl = `/uploads/heygen/${fileName}`;

    // Actualizar usuario con el link del video y estado PENDING
    await prisma.user.update({
      where: { id: userId },
      data: {
        heygenVideoUrl: videoUrl,
        heygenStatus: "PENDING"
      },
    });

    return NextResponse.json({ 
      message: "HeyGen training video uploaded successfully", 
      videoUrl,
      status: "PENDING"
    });

  } catch (error) {
    console.error("HeyGen Upload Error:", error);
    return NextResponse.json({ error: "Internal server error - check file size limits" }, { status: 500 });
  }
}
