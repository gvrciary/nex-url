"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/auth-client";

export default function UserMenu({ name }: { name: string }) {
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

  const handleLogout = async () => {
    await authClient.signOut();
    setIsOpen(false);
    router.refresh();
  };

  const handleDashboard = () => {
    router.push("/dashboard");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm font-normal text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
      >
        <Image
          src={"/images/profile.webp"}
          alt={`${name} avatar`}
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
        <span>{name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-white/20 rounded-lg shadow-lg py-2 z-50">
          <button
            type="button"
            onClick={handleDashboard}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-normal text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <hr className="my-2 border-gray-200 dark:border-white/20" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm font-normal text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
