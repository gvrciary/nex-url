"use client";

import { Github, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import UserMenu from "@/components/auth/user-menu";
import { useAuthModal } from "@/providers/auth-provider";
import Button from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const { openLogin } = useAuthModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image src="/icon.svg" alt="Nex URL" width={32} height={32} />
            </div>
            <span className="text-xl font-semibold tracking-wide text-black dark:text-white">
              NexURL
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              window.open("https://github.com/alexisgxrcia/nex-url", "_blank")
            }
          >
            <Github className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {session ? (
            <UserMenu />
          ) : (
            <Button variant="outline" onClick={openLogin}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
