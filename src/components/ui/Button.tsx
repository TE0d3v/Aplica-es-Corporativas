import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  const variants = {
    primary:
      "bg-ws-accent-blue text-white hover:bg-ws-accent-blue-dark shadow-lg shadow-ws-accent-blue/20",
    secondary: "bg-ws-bg-secondary text-ws-text-primary hover:bg-ws-bg-card",
    ghost: "bg-transparent text-ws-text-secondary hover:text-ws-text-primary hover:bg-white/5",
    outline:
      "bg-transparent border border-ws-accent-blue/30 text-ws-accent-blue hover:bg-ws-accent-blue/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-5 py-2.5 text-base rounded-xl",
    lg: "px-8 py-4 text-lg font-semibold rounded-2xl",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
