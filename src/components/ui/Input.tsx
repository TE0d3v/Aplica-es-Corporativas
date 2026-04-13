import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full bg-ws-bg-primary border border-white/10 rounded-xl px-4 py-3 text-ws-text-primary placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 transition-all",
        className,
      )}
      {...props}
    />
  );
}
