import Image from "next/image";
import Link from "next/link";
import { GitHub } from "@/components/assets/github";
import Button from "@/components/ui/button";
import HeaderFrame from "./header-frame";
import ToggleMode from "../ui/toggle-mode";
import UserButton from "../auth/user-button";

export default async function Header() {
  return (
    <HeaderFrame>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Image src="/icon.svg" alt="Nex URL" width={32} height={32} />
              </div>
              <span className="text-lg md:text-xl tracking-widest text-black dark:text-white">
                nexurl
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/alexisgvrcia/nex-url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                data-header-icon="true"
                variant="ghost"
                size="sm"
              >
                <GitHub className="h-4 w-4" />
              </Button>
            </a>
            <ToggleMode />
            <UserButton />
          </div>
        </div>
      </div>
    </HeaderFrame>
  );
}
