import { Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-ws-bg-primary border-t border-white/5 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-ws-accent-blue" />
            <span className="text-xl font-black text-ws-text-primary uppercase tracking-tighter italic">
              Watt<span className="text-ws-accent-blue">Sense</span>
            </span>
          </div>
          <p className="text-sm text-ws-text-secondary">
            Tecnologia de ponta para o monitoramento e otimização do seu consumo energético.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-ws-text-primary">
            Plataforma
          </h4>
          <nav className="flex flex-col gap-3 text-sm text-ws-text-secondary">
            <Link href="#" className="hover:text-ws-accent-blue transition-colors">
              Monitoramento
            </Link>
            <Link href="#" className="hover:text-ws-accent-blue transition-colors">
              Relatórios
            </Link>
            <Link href="#" className="hover:text-ws-accent-blue transition-colors">
              Integrações
            </Link>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-ws-text-primary">
            Empresa
          </h4>
          <nav className="flex flex-col gap-3 text-sm text-ws-text-secondary">
            <Link href="#" className="hover:text-ws-accent-blue transition-colors">
              Sobre Nós
            </Link>
            <Link href="#" className="hover:text-ws-accent-blue transition-colors">
              Carreiras
            </Link>
            <Link href="#" className="hover:text-ws-accent-blue transition-colors">
              Contato
            </Link>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-ws-text-primary">
            Legal
          </h4>
          <nav className="flex flex-col gap-3 text-sm text-ws-text-secondary">
            <Link href="#" className="hover:text-ws-accent-blue transition-colors">
              Termos de Uso
            </Link>
            <Link href="#" className="hover:text-ws-accent-blue transition-colors">
              Privacidade
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-20 border-t border-white/5 mt-20 text-center">
        <p className="text-xs text-ws-text-secondary">
          © {new Date().getFullYear()} WattSense. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
