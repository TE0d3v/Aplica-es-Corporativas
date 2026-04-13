export interface EnergyMetric {
  value: number;
  unit: string;
  label: string;
  trend?: "up" | "down" | "stable";
  color?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}
