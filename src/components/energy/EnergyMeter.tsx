"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface EnergyMeterProps {
  value: number; // 0 to 100
  label?: string;
  className?: string;
}

export function EnergyMeter({ value, label, className }: EnergyMeterProps) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPercentage(value), 500);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <svg className="w-48 h-48 transform -rotate-90">
        <title>Energy consumption meter</title>
        {/* Background Circle */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-white/5"
        />
        {/* Progress Circle */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 1s ease-in-out",
          }}
          strokeLinecap="round"
          className="text-ws-accent-blue"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-ws-text-primary">{percentage}%</span>
        {label && (
          <span className="text-xs text-ws-text-secondary uppercase tracking-widest">{label}</span>
        )}
      </div>
    </div>
  );
}
