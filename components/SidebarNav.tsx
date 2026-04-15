"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, Settings, CheckCircle2 } from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/projects", label: "Mis Proyectos", icon: Video },
    { href: "/dashboard/membership", label: "Mi Avatar / Pro", icon: CheckCircle2 },
    { href: "/dashboard/settings", label: "Configuración", icon: Settings },
  ];

  return (
    <nav className="flex-1 px-4 space-y-2 mt-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
              isActive
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`} />
            <span className={isActive ? "font-semibold" : "font-medium"}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
