"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Bell, Search, User } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [firstName, setFirstName] = useState("Usuário");

  useEffect(() => {
    const savedUser = localStorage.getItem("@WattSense:user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.nome) {
          // Pega apenas a primeira palavra do nome
          const nameParts = user.nome.trim().split(" ");
          setFirstName(nameParts[0]);
        }
      } catch (e) {
        console.error("Erro ao processar dados do usuário");
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-ws-bg-primary overflow-hidden">
      {/* Barra Lateral */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Cabeçalho Interno */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-ws-bg-primary/50 backdrop-blur-sm sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-bold text-ws-text-primary tracking-tight">Painel de Controle</h2>
            <p className="text-xs text-ws-text-secondary">Bem-vindo de volta, {firstName}!</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-white/5 rounded-xl px-4 py-2 border border-white/5 group focus-within:border-ws-accent-blue/30 transition-all">
              <Search className="w-4 h-4 text-ws-text-secondary group-focus-within:text-ws-accent-blue" />
              <input 
                type="text" 
                placeholder="Buscar circuito..." 
                className="bg-transparent border-none text-sm text-ws-text-primary placeholder:text-white/20 focus:ring-0 ml-2 w-48"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2.5 bg-white/5 rounded-xl text-ws-text-secondary hover:text-ws-accent-blue hover:bg-ws-accent-blue/10 transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-ws-accent-blue rounded-full border-2 border-ws-bg-primary" />
              </button>
              
              <div className="h-10 w-10 bg-ws-accent-blue/20 rounded-xl border border-ws-accent-blue/30 flex items-center justify-center text-ws-accent-blue">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
