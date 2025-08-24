import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export default function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 dark:text-white/50">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:border-black dark:focus:border-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50",
          icon && "pl-10",
          className,
        )}
        {...props}
      />
    </div>
  );
}
