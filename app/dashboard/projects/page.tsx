import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import ProjectGrid from "../../../components/ProjectGrid";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  // Obtenemos los proyectos de Prisma de los más nuevos a los más antiguos
  const projects = await prisma.project.findMany({
    where: { 
      userId: (session.user as any).id,
      status: "COMPLETED"
    },
    orderBy: { createdAt: "desc" },
  });

  // Los Componentes de Cliente a veces fallan al recibir Date objects directamente, los convertimos.
  const serializedProjects = projects.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }));

  return (
    <div className="space-y-8">
      <header className="mb-8 border-b border-white/5 pb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Mis Proyectos Virales
        </h1>
        <p className="text-gray-400 mt-2">Gestiona y descarga los calendarios de contenido generados con IA.</p>
      </header>

      <ProjectGrid initialProjects={serializedProjects} />
    </div>
  );
}
