"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { authClient } from "@/auth-client";

export default function UserMenu({ name }: { name: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!detailsRef.current?.contains(event.target as Node)) {
        detailsRef.current?.removeAttribute("open");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        detailsRef.current?.removeAttribute("open");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    detailsRef.current?.removeAttribute("open");
    router.refresh();
  };

  return (
    <details ref={detailsRef} className="relative z-[9999]">
      <summary
        className="flex cursor-pointer list-none items-center space-x-2 text-sm font-normal text-black transition-colors hover:text-black/70 marker:content-[''] dark:text-white dark:hover:text-white/70 [&::-webkit-details-marker]:hidden"
      >
        <Image
          src={"/images/profile.webp"}
          alt={`${name} avatar`}
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
        <span>{name}</span>
      </summary>

      <div className="surface-shadow absolute right-0 top-full z-[9999] mt-2 w-48 rounded-xl border border-black/10 bg-white py-2 shadow-2xl dark:border-white/20 dark:bg-black">
        <Link
          href="/dashboard"
          onClick={() => detailsRef.current?.removeAttribute("open")}
          className="flex w-full cursor-pointer items-center space-x-2 px-4 py-2 text-sm font-normal text-black transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-white/10"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <hr className="my-2 border-gray-200 dark:border-white/20" />

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center space-x-2 px-4 py-2 text-sm font-normal text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </details>
  );
}
