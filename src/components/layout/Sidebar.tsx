"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Zap, 
  Settings, 
  LogOut, 
  FolderOpen,
  Users,
  Home,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Visão Geral", href: "/dashboard" },
  { icon: Zap, label: "Circuitos", href: "/circuitos" },
  { 
    label: "Cadastros", 
    icon: FolderOpen,
    href: "#",
    subItems: [
      { icon: Home, label: "Imóveis", href: "/imoveis" },
      { icon: Users, label: "Pessoas", href: "/pessoas" },
      { icon: Users, label: "Usuários", href: "/usuarios" },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    menuItems.forEach(item => {
      if (item.subItems) {
        initialState[item.label] = item.subItems.some(sub => pathname === sub.href);
      }
    });
    return initialState;
  });

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

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
            if (item.subItems) {
              const isOpen = openMenus[item.label] ?? false;
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-ws-text-secondary uppercase tracking-wider mt-4 first:mt-0 hover:text-ws-text-primary transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
                  </button>
                  <div className={cn(
                    "space-y-1 overflow-hidden transition-all duration-200 ease-in-out",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}>
                    {item.subItems.map((subItem) => {
                      const isActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                            isActive 
                              ? "bg-ws-accent-blue/10 text-ws-accent-blue shadow-[inset_0_0_10px_rgba(0,170,255,0.1)]" 
                              : "text-ws-text-secondary hover:text-ws-text-primary hover:bg-white/5"
                          )}
                        >
                          <subItem.icon className={cn(
                            "w-5 h-5 transition-colors",
                            isActive ? "text-ws-accent-blue" : "text-ws-text-secondary group-hover:text-ws-text-primary"
                          )} />
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

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
          href="/configuracoes"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ws-text-secondary hover:text-ws-text-primary hover:bg-white/5 transition-all",
            pathname === "/configuracoes" && "bg-ws-accent-blue/10 text-ws-accent-blue"
          )}
        >
          <Settings className="w-5 h-5" />
          Configurações
        </Link>
        <button
          onClick={() => {
            // Lógica de logout aqui futuramente
            localStorage.removeItem("@WattSense:user");
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
