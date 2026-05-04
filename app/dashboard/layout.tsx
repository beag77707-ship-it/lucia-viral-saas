import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SidebarNav from "../../components/SidebarNav";
import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userName = session.user?.name || "Usuario";
  const firstName = userName.split(" ")[0];

  return (
    <div className="h-screen w-full bg-dark-900 text-white flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 border-r border-white/5 flex flex-col flex-shrink-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">QBOSS AI</span>
          </Link>
        </div>

        <SidebarNav />

        {/* Optional logout or extra links at the bottom if needed */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-dark-900">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between flex-shrink-0">
          <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>
          
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-dark-900"></span>
            </button>
            
            <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                    {firstName[0].toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-300">{firstName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 pt-2">
          <div className="max-w-[1400px] mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
