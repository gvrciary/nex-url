"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function HeaderFrame({ children }: { children: ReactNode }) {
  const isHome = usePathname() === "/";

  return (
    <header
      className={`relative z-20 w-full ${
        isHome
          ? "-mb-16 bg-transparent [&_button[data-header-icon='true']]:hover:bg-transparent [&_button[data-header-icon='true']]:active:bg-transparent [&_button[data-header-icon='true']]:focus:bg-transparent"
          : "`bg-(--background)"
      }`}
    >
      {children}
    </header>
  );
}
