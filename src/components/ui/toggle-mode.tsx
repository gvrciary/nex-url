"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import Button from "@/components/ui/button";

function subscribe() {
  return () => {};
}

export default function ToggleMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = resolvedTheme === "dark";
  const toggleLabel = isMounted && isDark ? "Switch to light mode" : "Switch to dark mode";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      data-header-icon="true"
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={toggleLabel}
      title={toggleLabel}
      className="size-11 p-0"
    >
      {isMounted && isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
