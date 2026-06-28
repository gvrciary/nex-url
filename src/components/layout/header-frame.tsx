"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function HeaderFrame({ children }: { children: ReactNode }) {
  const isHome = usePathname() === "/";

  return (
    <header
      className={`w-full ${
        isHome
          ? "absolute inset-x-0 top-0 z-[100] bg-transparent [&_button[data-header-icon='true']]:hover:bg-transparent [&_button[data-header-icon='true']]:active:bg-transparent [&_button[data-header-icon='true']]:focus:bg-transparent"
          : "relative z-50 bg-(--background)"
      }`}
    >
      {children}
    </header>
  );
}
