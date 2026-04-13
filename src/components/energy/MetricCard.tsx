import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricCard({ label, value, unit, icon: Icon, trend, className }: MetricCardProps) {
  return (
    <Card className={cn("relative group", className)}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-ws-text-secondary">{label}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-black text-ws-text-primary tracking-tight">{value}</h3>
            {unit && <span className="text-sm font-medium text-ws-text-secondary">{unit}</span>}
          </div>

          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-bold",
                trend.isPositive ? "text-ws-accent-green" : "text-red-500",
              )}
            >
              <span>
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
              <span className="text-ws-text-secondary font-normal italic">vs. último mês</span>
            </div>
          )}
        </div>

        <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-ws-accent-blue/10 transition-colors">
          <Icon className="w-6 h-6 text-ws-accent-blue" />
        </div>
      </div>
    </Card>
  );
}
