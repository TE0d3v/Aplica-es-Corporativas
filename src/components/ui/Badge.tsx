import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "blue" | "amber" | "green" | "red";
}

export function Badge({ children, variant = "blue", className, ...props }: BadgeProps) {
  const variants = {
    blue: "bg-ws-accent-blue/10 text-ws-accent-blue border-ws-accent-blue/20",
    amber: "bg-ws-accent-amber/10 text-ws-accent-amber border-ws-accent-amber/20",
    green: "bg-ws-accent-green/10 text-ws-accent-green border-ws-accent-green/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
