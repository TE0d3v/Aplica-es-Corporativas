import { Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-ws-bg-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="flex justify-center">
          <div className="p-4 bg-ws-accent-blue/10 rounded-3xl border border-ws-accent-blue/20">
            <Zap className="w-12 h-12 text-ws-accent-blue" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-ws-text-primary">
          Inteligência em <span className="text-ws-accent-blue">Energia</span>
        </h1>

        <p className="text-lg md:text-xl text-ws-text-secondary max-w-xl mx-auto">
          Monitore o consumo de seus circuitos em tempo real com o WattSense. Otimize, economize e
          tenha o controle total na palma da sua mão.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg"><Link href="/login" className="text-ws-accent-white font-semibold hover:underline">Entrar</Link></Button>
          <Button variant="outline" size="lg" className="flex gap-2">
            <Activity className="w-5 h-5" />
            Ver Dashboard
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Consumo Hoje", value: "12.4 kWh", color: "text-ws-accent-blue" },
            { label: "Custo Estimado", value: "R$ 42,50", color: "text-ws-accent-amber" },
            { label: "Economia", value: "18%", color: "text-ws-accent-green" },
          ].map((stat) => (
            <div key={stat.label} className="bg-ws-bg-card border border-white/5 p-6 rounded-2xl">
              <p className="text-sm text-ws-text-secondary mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
