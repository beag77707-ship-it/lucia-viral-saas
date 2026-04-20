import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { avatarId, voiceId } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: { 
        heygenAvatarId: avatarId,
        heygenVoiceId: voiceId 
      },
    });

    return NextResponse.json({ message: "Avatar ID updated", avatarId: updatedUser.heygenAvatarId });
  } catch (error) {
    console.error("Update Avatar API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
