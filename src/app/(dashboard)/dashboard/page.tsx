"use client";

import { useEffect, useState } from "react";
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Activity,
  ArrowUpRight,
  Monitor
} from "lucide-react";
import { MetricCard } from "@/components/energy/MetricCard";
import { EnergyMeter } from "@/components/energy/EnergyMeter";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

interface Circuit {
  id: string;
  name: string;
  consumption: number;
  status: "active" | "inactive" | "alert";
  lastUpdate: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [circuits] = useState<Circuit[]>([
    { id: "1", name: "Servidores - Rack A", consumption: 450, status: "active", lastUpdate: "2m atrás" },
    { id: "2", name: "Ar Condicionado Central", consumption: 1200, status: "active", lastUpdate: "1m atrás" },
    { id: "3", name: "Iluminação Térreo", consumption: 80, status: "inactive", lastUpdate: "15m atrás" },
    { id: "4", name: "Maquinário Oficina", consumption: 3400, status: "alert", lastUpdate: "Agora" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.get<any[]>("/stats");
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Grid de Métricas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />
          ))
        ) : (
          stats.map((stat, i) => (
            <MetricCard 
              key={i}
              label={stat.label}
              value={stat.value}
              icon={i === 0 ? Zap : i === 1 ? TrendingUp : TrendingDown}
              trend={{ value: 12, isPositive: i === 2 }}
              className="border-white/5 shadow-ws-accent-blue/5"
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel Central de Consumo */}
        <Card className="lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <Badge variant="blue" className="bg-ws-accent-blue/20">Tempo Real</Badge>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-ws-text-primary uppercase tracking-tighter">Carga do Sistema</h3>
              <p className="text-sm text-ws-text-secondary">Consumo instantâneo total da rede</p>
            </div>

            <EnergyMeter value={68} label="Potência" />

            <div className="flex gap-12 pt-4">
              <div className="text-center">
                <p className="text-xs text-ws-text-secondary uppercase font-bold mb-1">Pico Hoje</p>
                <p className="text-xl font-bold text-ws-text-primary">12.4 kW</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-xs text-ws-text-secondary uppercase font-bold mb-1">Média 24h</p>
                <p className="text-xl font-bold text-ws-text-primary">4.2 kW</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de Circuitos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ws-text-primary tracking-tight">Circuitos Ativos</h3>
            <Button variant="ghost" size="sm" className="text-ws-accent-blue hover:bg-ws-accent-blue/10">Ver todos</Button>
          </div>

          <div className="space-y-4">
            {circuits.map((circuit) => (
              <Card key={circuit.id} className="p-5 border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl transition-colors",
                      circuit.status === "active" ? "bg-ws-accent-green/10 text-ws-accent-green" :
                      circuit.status === "alert" ? "bg-red-500/10 text-red-500" : "bg-white/5 text-ws-text-secondary"
                    )}>
                      {circuit.status === "alert" ? <AlertCircle className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ws-text-primary group-hover:text-ws-accent-blue transition-colors">{circuit.name}</p>
                      <p className="text-[10px] text-ws-text-secondary uppercase tracking-widest">{circuit.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-ws-text-primary">{circuit.consumption}W</p>
                    <Badge 
                      variant={circuit.status === "active" ? "green" : circuit.status === "alert" ? "red" : "amber"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {circuit.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="bg-ws-accent-blue/5 border-ws-accent-blue/20 p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-ws-accent-blue/20 rounded-lg text-ws-accent-blue">
                <Activity className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-ws-accent-blue uppercase tracking-widest">Dica de Economia</p>
                <p className="text-xs text-ws-text-secondary leading-relaxed">
                  Detectamos um aumento de 15% no consumo dos aparelhos em standby. 
                  Considere agendar o desligamento automático.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
