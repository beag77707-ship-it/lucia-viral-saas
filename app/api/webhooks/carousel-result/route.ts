import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { projectId, ideaIndex, carouselData } = data;

    if (!projectId || ideaIndex === undefined) {
      return NextResponse.json({ error: "Missing projectId or ideaIndex" }, { status: 400 });
    }

    // Obtener el proyecto actual
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (project && project.resultJSON) {
      let parsedJSON = typeof project.resultJSON === 'string' ? JSON.parse(project.resultJSON) : project.resultJSON;
      
      // Si parsedJSON es un array directo
      if (Array.isArray(parsedJSON)) {
        if (parsedJSON[ideaIndex]) {
          parsedJSON[ideaIndex].carousel = typeof carouselData === 'string' ? JSON.parse(carouselData) : carouselData;
        }
      } 
      // Si parsedJSON tiene un array dentro de 'ideas'
      else if (parsedJSON.ideas && Array.isArray(parsedJSON.ideas)) {
        if (parsedJSON.ideas[ideaIndex]) {
          parsedJSON.ideas[ideaIndex].carousel = typeof carouselData === 'string' ? JSON.parse(carouselData) : carouselData;
        }
      }

      await prisma.project.update({
        where: { id: projectId },
        data: {
          resultJSON: JSON.stringify(parsedJSON)
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error Webhook Carousel:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
