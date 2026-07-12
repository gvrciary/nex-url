import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";

const BASE_STYLES =
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-normal transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/35 dark:focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100";

const BUTTON_VARIANTS = {
  primary:
    "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
  outline:
    "border border-black/20 text-black hover:border-black/40 hover:bg-black/5 dark:border-white/25 dark:text-white dark:hover:border-white/45 dark:hover:bg-white/10",
  ghost: "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10",
} as const;

const BUTTON_SIZES = {
  sm: "h-10 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        BASE_STYLES,
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
