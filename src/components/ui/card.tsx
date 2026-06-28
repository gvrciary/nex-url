import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "surface-shadow rounded-2xl border border-black/10 bg-transparent dark:border-white/10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
