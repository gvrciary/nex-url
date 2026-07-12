"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function HeaderFrame({ children }: { children: ReactNode }) {
  const isHome = usePathname() === "/";

  return (
    <header
      className={`w-full ${
        isHome
          ? "absolute inset-x-0 top-0 z-40 bg-transparent"
          : "sticky top-0 z-40 border-b border-black/8 bg-(--background)/90 backdrop-blur-md dark:border-white/10"
      }`}
    >
      {children}
    </header>
  );
}
