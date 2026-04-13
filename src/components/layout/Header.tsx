"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="w-full bg-ws-bg-primary/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-ws-accent-blue/10 rounded-xl border border-ws-accent-blue/20 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-ws-accent-blue" />
          </div>
          <span className="text-xl font-black text-ws-text-primary uppercase tracking-tighter italic">
            Watt<span className="text-ws-accent-blue">Sense</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ws-text-secondary">
          <Link href="#" className="hover:text-ws-accent-blue transition-colors">
            Produtos
          </Link>
          <Link href="#" className="hover:text-ws-accent-blue transition-colors">
            Soluções
          </Link>
          <Link href="#" className="hover:text-ws-accent-blue transition-colors">
            Preços
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button size="sm">Começar</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
