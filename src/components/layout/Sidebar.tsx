"use client";

import { 
  LayoutDashboard, 
  Zap, 
  BarChart3, 
  Settings, 
  LogOut, 
  User,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Visão Geral", href: "/dashboard" },
  { icon: Zap, label: "Circuitos", href: "/dashboard/circuitos" },
  { icon: BarChart3, label: "Relatórios", href: "/dashboard/relatorios" },
  { icon: User, label: "Meu Perfil", href: "/dashboard/perfil" },
  { icon: ShieldCheck, label: "Administração", href: "/dashboard/admin" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-ws-bg-secondary border-r border-white/5 flex flex-col sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-10">
          <Zap className="w-6 h-6 text-ws-accent-blue" />
          <span className="text-xl font-black text-ws-text-primary uppercase tracking-tighter italic">
            Watt<span className="text-ws-accent-blue">Sense</span>
          </span>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-ws-accent-blue/10 text-ws-accent-blue shadow-[inset_0_0_10px_rgba(0,170,255,0.1)]" 
                    : "text-ws-text-secondary hover:text-ws-text-primary hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-ws-accent-blue" : "text-ws-text-secondary group-hover:text-ws-text-primary"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5 space-y-4">
        <Link
          href="/dashboard/configuracoes"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ws-text-secondary hover:text-ws-text-primary hover:bg-white/5 transition-all",
            pathname === "/dashboard/configuracoes" && "bg-ws-accent-blue/10 text-ws-accent-blue"
          )}
        >
          <Settings className="w-5 h-5" />
          Configurações
        </Link>
        <button
          onClick={() => {
            // Lógica de logout aqui futuramente
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-all w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}
