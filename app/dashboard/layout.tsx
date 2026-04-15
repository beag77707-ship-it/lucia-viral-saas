import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SidebarNav from "../../components/SidebarNav";
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
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col transition-colors duration-300">
        <div className="p-6">
          <Link href="/dashboard" className="text-2xl font-black text-primary tracking-tight">
            LucIA
          </Link>
          <div className="mt-4 flex items-center gap-3 p-2 rounded-xl bg-primary/5 border border-primary/10">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
               {session.user?.image ? (
                 <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                   {session.user?.name?.[0].toUpperCase() || "L"}
                 </div>
               )}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold truncate text-foreground">
                {session.user?.name || "Usuario"}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {((session.user as any).plan || "BASIC").replace("_", " ")}
              </div>
            </div>
          </div>
        </div>

        <SidebarNav />

        <div className="p-4 border-t border-border">
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
