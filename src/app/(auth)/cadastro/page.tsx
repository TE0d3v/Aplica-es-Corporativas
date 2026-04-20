"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Ajustado para os campos corretos da API (nome, login, senha)
      await api.post("/signup", { nome: name, login: email, senha: password });
      setSuccess(true);
      
      // Pequeno delay para mostrar mensagem de sucesso antes de redirecionar
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao realizar cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ws-bg-primary flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-ws-bg-card border border-white/5 p-8 rounded-3xl shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-ws-text-primary">Criar Conta</h1>
          <p className="text-ws-text-secondary text-sm">Comece a monitorar sua energia hoje</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-ws-accent-green/10 border border-ws-accent-green/20 text-ws-accent-green text-sm p-4 rounded-xl text-center">
            Cadastro realizado com sucesso! Redirecionando...
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-ws-text-secondary pl-1">
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-ws-bg-primary border border-white/10 rounded-xl px-4 py-3 text-ws-text-primary placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 transition-all"
            />
          </div>

          <Button 
            className="w-full py-4 text-base font-bold uppercase tracking-widest"
            disabled={isLoading || success}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
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
