"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export const ToasterComponent = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: {
          toast:
            "flex gap-2 rounded-xl border border-black/10 bg-[var(--background)] p-4 text-sm text-[var(--foreground)] shadow-lg dark:border-white/15",
        },
      }}
    />
  );
};
