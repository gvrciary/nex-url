"use client";

import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSettings = () => {
    router.push("/settings");
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    setIsOpen(false);
    router.push("/");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
    setIsOpen(false);
  };

  if (!session?.user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm font-normal text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
      >
        <Image
          src={"/images/profile.webp"}
          alt={session.user.name || "User"}
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
        <span>{session.user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-white/20 rounded-lg shadow-lg py-2 z-50">
          <button
            type="button"
            onClick={handleDashboard}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-normal text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            onClick={handleSettings}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-normal text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          <hr className="my-2 border-gray-200 dark:border-white/20" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-normal text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
