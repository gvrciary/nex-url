"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export const ToasterComponent = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={theme === "dark" ? "dark" : "light"}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: `
                  flex gap-2 p-4 rounded-xl text-sm border border-gray-200 dark:border-white/10
                  shadow-md backdrop-blur-md
                  bg-[var(--background)] bg-opacity-70 dark:bg-opacity-70
                  text-[var(--foreground)]
                `,
        },
      }}
    />
  );
};
