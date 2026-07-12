import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "surface-shadow rounded-xl border border-black/10 bg-white/35 dark:border-white/10 dark:bg-white/[0.02]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
