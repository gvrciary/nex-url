import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-light transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
    outline:
      "border border-gray-300 dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white hover:text-black dark:hover:text-black",
    ghost:
      "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
