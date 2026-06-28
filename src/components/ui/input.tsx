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
          "flex h-10 w-full rounded-md border border-gray-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm text-black transition-[border-color,box-shadow,transform] duration-150 ease-out placeholder:text-black/50 focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:placeholder:text-white/50 dark:focus:border-white dark:focus:ring-white/20 dark:focus:ring-offset-black",
          icon && "pl-10",
          className,
        )}
        {...props}
      />
    </div>
  );
}
