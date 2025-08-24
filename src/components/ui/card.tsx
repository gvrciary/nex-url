import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 dark:border-white/10 bg-transparent hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
