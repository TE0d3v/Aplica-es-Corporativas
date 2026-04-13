import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-ws-bg-primary flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-ws-bg-card border border-white/5 p-8 rounded-3xl shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-ws-text-primary">Criar Conta</h1>
          <p className="text-ws-text-secondary text-sm">Comece a monitorar sua energia hoje</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-ws-text-secondary pl-1">
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              className="w-full bg-ws-bg-primary border border-white/10 rounded-xl px-4 py-3 text-ws-text-primary placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-ws-text-secondary pl-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="w-full bg-ws-bg-primary border border-white/10 rounded-xl px-4 py-3 text-ws-text-primary placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-ws-text-secondary pl-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full bg-ws-bg-primary border border-white/10 rounded-xl px-4 py-3 text-ws-text-primary placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 transition-all"
            />
          </div>

          <Button className="w-full py-4 text-base font-bold uppercase tracking-widest">
            Cadastrar
          </Button>
        </form>

        <p className="text-center text-sm text-ws-text-secondary">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-ws-accent-blue font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
