import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({ children, header, footer, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-ws-bg-card border border-white/5 rounded-3xl overflow-hidden shadow-xl",
        className,
      )}
      {...props}
    >
      {header && <div className="px-6 py-4 border-b border-white/5 bg-white/5">{header}</div>}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-white/5 bg-white/5">{footer}</div>}
    </div>
  );
}
