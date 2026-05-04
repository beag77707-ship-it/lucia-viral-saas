"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Sparkles, BarChart2, Library, Settings } from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
    { href: "/dashboard/content", label: "Content AI", icon: Sparkles },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/dashboard/library", label: "Library", icon: Library },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="flex-1 px-3 space-y-1 mt-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
              isActive
                ? "bg-primary text-white font-medium"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`} />
            <span className="text-sm">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
