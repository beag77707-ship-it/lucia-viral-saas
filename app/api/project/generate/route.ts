import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { niche, competitors, plan } = body;

    if (!niche || !competitors || competitors.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Comprobar limite de 3 competidores
    if (competitors.length > 3) {
      return NextResponse.json({ error: "Maximum 3 competitors allowed" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        userId,
        niche,
        competitors: JSON.stringify(competitors),
        status: "PROCESSING",
      },
    });

    // Disparar Webhook de n8n
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        // Ejecutamos de manera asíncrona pero sin bloquear Next.js
        axios.post(webhookUrl, {
          projectId: project.id,
          userId,
          niche,
          competitors,
          plan: plan || "BASIC",
        }).catch(err => console.error("Error triggering n8n webhook:", err.message));
      } catch (err) {
        console.error("Failed to trigger webhook", err);
      }
    } else {
      console.warn("N8N_WEBHOOK_URL is not defined. Skipping webhook.");
    }

    return NextResponse.json(
      { message: "Project generation started", projectId: project.id },
      { status: 202 }
    );
  } catch (error) {
    console.error("Generate Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
