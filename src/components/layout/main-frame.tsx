"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function MainFrame({ children }: { children: ReactNode }) {
  const isHome = usePathname() === "/";

  return (
    <main className={isHome ? "min-h-svh" : "h-[calc(100svh-4rem)]"}>
      {children}
    </main>
  );
}
