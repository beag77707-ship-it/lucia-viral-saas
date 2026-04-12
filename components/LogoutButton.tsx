"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
    >
      <LogOut className="w-5 h-5" />
      Cerrar Sesión
    </button>
  );
}
