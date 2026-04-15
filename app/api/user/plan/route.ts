import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    const userId = (session.user as any).id;

    if (!["PLAN_A", "PLAN_B", "BASIC"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });

    return NextResponse.json({ 
      message: `Plan updated to ${plan}`, 
      plan: updatedUser.plan 
    });

  } catch (error) {
    console.error("Plan Upgrade Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
