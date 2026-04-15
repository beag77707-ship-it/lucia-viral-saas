import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const file = formData.get("image") as File;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${userId}-${Date.now()}-${file.name}`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);
      await writeFile(uploadPath, buffer);
      
      updateData.image = `/uploads/${fileName}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        plan: updatedUser.plan
      }
    });

  } catch (error) {
    console.error("Update User Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
