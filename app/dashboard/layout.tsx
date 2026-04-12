import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { LogOut, Home, Settings, Video } from "lucide-react";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-white/5 flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
            LucIA
          </Link>
          <div className="mt-2 text-xs font-medium px-2 py-1 bg-white/5 rounded text-gray-400 max-w-fit">
            Plan: {(session.user as any).plan}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary transition-colors">
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/projects" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
            <Video className="w-5 h-5" />
            Mis Proyectos
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" />
            Configuración
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
