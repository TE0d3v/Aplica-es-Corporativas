"use client";

import { useState } from "react";
import { 
  Zap, 
  Power, 
  Settings, 
  History, 
  AlertTriangle,
  Search,
  Plus
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Circuit {
  id: string;
  name: string;
  location: string;
  consumption: string;
  status: "on" | "off" | "alert";
  peak: string;
  type: string;
}

export default function CircuitsPage() {
  const [circuits] = useState<Circuit[]>([
    { id: "1", name: "Servidores - Rack A", location: "Data Center Térreo", consumption: "450W", status: "on", peak: "1.2kW", type: "TI" },
    { id: "2", name: "Ar Condicionado", location: "Escritório Central", consumption: "1.2kW", status: "on", peak: "2.5kW", type: "Climatização" },
    { id: "3", name: "Iluminação Externa", location: "Estacionamento", consumption: "0W", status: "off", peak: "800W", type: "Iluminação" },
    { id: "4", name: "Maquinário Oficina", location: "Oficina Sul", consumption: "3.4kW", status: "alert", peak: "4.5kW", type: "Industrial" },
    { id: "5", name: "Copa e Refeitório", location: "Área Comum", consumption: "120W", status: "on", peak: "2.1kW", type: "Geral" },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ws-text-primary uppercase tracking-tighter">Gerenciamento de Circuitos</h1>
          <p className="text-sm text-ws-text-secondary">Monitore e controle cada ponto de energia em tempo real.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
            <input 
              type="text" 
              placeholder="Filtrar circuitos..." 
              className="bg-ws-bg-secondary border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-ws-text-primary focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 w-full md:w-64 transition-all"
            />
          </div>
          <Button size="sm" className="flex gap-2">
            <Plus className="w-4 h-4" />
            Novo Circuito
          </Button>
        </div>
      </div>

      {/* Grid de Circuitos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {circuits.map((circuit) => (
          <Card key={circuit.id} className="p-0 overflow-hidden border-white/5 hover:border-ws-accent-blue/20 transition-all group">
            <div className="flex flex-col md:flex-row">
              {/* Status Visual Lateral */}
              <div className={cn(
                "w-full md:w-2 h-2 md:h-auto",
                circuit.status === "on" ? "bg-ws-accent-green" :
                circuit.status === "alert" ? "bg-red-500 animate-pulse" : "bg-ws-text-secondary/30"
              )} />
              
              <div className="flex-1 p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl transition-colors",
                      circuit.status === "on" ? "bg-ws-accent-green/10 text-ws-accent-green" :
                      circuit.status === "alert" ? "bg-red-500/10 text-red-500" : "bg-white/5 text-ws-text-secondary"
                    )}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ws-text-primary group-hover:text-ws-accent-blue transition-colors">{circuit.name}</h3>
                      <p className="text-xs text-ws-text-secondary">{circuit.location}</p>
                    </div>
                  </div>
                  <Badge variant={circuit.status === "on" ? "green" : circuit.status === "alert" ? "red" : "amber"}>
                    {circuit.status === "on" ? "Ativo" : circuit.status === "alert" ? "Sobrecarga" : "Inativo"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5">
                  <div>
                    <p className="text-[10px] text-ws-text-secondary uppercase font-bold tracking-widest mb-1">Consumo</p>
                    <p className="text-lg font-black text-ws-text-primary">{circuit.consumption}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ws-text-secondary uppercase font-bold tracking-widest mb-1">Pico (24h)</p>
                    <p className="text-lg font-black text-ws-text-primary">{circuit.peak}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ws-text-secondary uppercase font-bold tracking-widest mb-1">Categoria</p>
                    <p className="text-sm font-bold text-ws-accent-blue/80">{circuit.type}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg border border-white/5">
                      <History className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg border border-white/5">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="text-xs">Relatório</Button>
                    <Button 
                      variant={circuit.status === "off" ? "primary" : "secondary"} 
                      size="sm" 
                      className={cn(
                        "text-xs gap-2 min-w-[100px]",
                        circuit.status !== "off" && "text-red-400 hover:text-red-500 hover:bg-red-500/10 border-red-500/10"
                      )}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {circuit.status === "off" ? "Ligar" : "Desligar"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Alerta de Manutenção */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 bg-red-500/20 rounded-2xl text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-red-500 uppercase tracking-tight">Manutenção Preventiva Requerida</h4>
            <p className="text-xs text-ws-text-secondary">O circuito "Maquinário Oficina" apresentou flutuações anormais e requer inspeção imediata.</p>
          </div>
        </div>
        <Button variant="primary" className="bg-red-500 hover:bg-red-600 shadow-red-500/20 whitespace-nowrap">
          Abrir Chamado
        </Button>
      </div>
    </div>
  );
}
