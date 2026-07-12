import Image from "next/image";
import Link from "next/link";
import { GitHub } from "@/components/assets/github";
import Tooltip from "@/components/ui/tooltip";
import HeaderFrame from "./header-frame";
import ToggleMode from "../ui/toggle-mode";
import UserButton from "../auth/user-button";

export default async function Header() {
  return (
    <HeaderFrame>
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Nex URL home"
            className="flex min-h-11 min-w-11 items-center gap-2 rounded-md text-black outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-white dark:focus-visible:ring-white/50 sm:gap-3"
          >
            <Image src="/icon.svg" alt="" width={32} height={32} priority />
            <span className="font-[family-name:var(--font-lastik)] hidden text-xl leading-none tracking-[-0.035em] min-[390px]:inline md:text-2xl">
              nexurl
            </span>
          </Link>

          <nav aria-label="Utility navigation" className="flex items-center gap-1 sm:gap-2">
            <Tooltip content="View on GitHub" position="bottom">
              <a
                href="https://github.com/alexisgvrcia/nex-url"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Nex URL on GitHub"
                className="inline-flex size-11 items-center justify-center rounded-md text-black transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white/50"
              >
                <GitHub className="h-4 w-4" aria-hidden="true" />
              </a>
            </Tooltip>
            <ToggleMode />
            <UserButton />
          </nav>
        </div>
      </div>
    </HeaderFrame>
  );
}
