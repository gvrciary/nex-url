"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth-client";

export default function UserMenu({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!detailsRef.current?.contains(event.target as Node)) {
        detailsRef.current?.removeAttribute("open");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && detailsRef.current?.open) {
        detailsRef.current?.removeAttribute("open");
        summaryRef.current?.focus();
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
    setIsLoggingOut(true);

    try {
      const result = await authClient.signOut();
      if (result.error) throw result.error;
      detailsRef.current?.removeAttribute("open");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <details ref={detailsRef} className="relative z-50">
      <summary
        ref={summaryRef}
        aria-label={`Open profile menu for ${name}`}
        className="flex min-h-11 max-w-40 cursor-pointer list-none items-center gap-2 rounded-md px-1 text-sm font-normal text-black outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/40 marker:content-[''] dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white/50 sm:max-w-56 sm:px-2 [&::-webkit-details-marker]:hidden"
      >
        <Image
          src={image && !imageFailed ? image : "/images/profile.webp"}
          alt=""
          className="size-8 shrink-0 rounded-full object-cover"
          width={32}
          height={32}
          unoptimized={Boolean(image)}
          onError={() => setImageFailed(true)}
        />
        <span className="hidden truncate min-[480px]:inline">{name}</span>
      </summary>

      <div className="menu surface-shadow absolute right-0 top-full z-50 mt-2 w-52 origin-top-right rounded-lg border border-black/10 bg-(--background) p-1 dark:border-white/15">
        <Link
          href="/dashboard"
          onClick={() => detailsRef.current?.removeAttribute("open")}
          className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-normal text-black outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/40 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white/50"
        >
          <LayoutDashboard className="size-4" aria-hidden="true" />
          <span>Dashboard</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-sm font-normal text-red-600 outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500/60 disabled:cursor-wait disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <LogOut className="size-4" aria-hidden="true" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </button>
      </div>
      <style jsx>{`
        details[open] > .menu {
          animation: profile-menu-in 120ms ease-out;
        }
        @keyframes profile-menu-in {
          from {
            opacity: 0;
            transform: scale(0.98) translateY(-4px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          details[open] > .menu {
            animation: none;
          }
        }
      `}</style>
    </details>
  );
}
