import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export default function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/45 dark:text-white/45">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "flex h-11 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm text-black transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-black/40 focus:border-black/50 focus:outline-none focus:ring-2 focus:ring-black/15 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/50 dark:focus:ring-white/15",
          icon && "pl-10",
          className,
        )}
        {...props}
      />
    </div>
  );
}
