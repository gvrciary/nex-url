"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/providers/auth-provider";
import { Particles } from "@/components/ui/particles";

const Button = ({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
}) => {
  if (variant === "outline") {
    return (
      <button
        onClick={onClick}
        className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[2px] border-black/20 dark:border-white/20 px-10 text-sm font-medium whitespace-nowrap transition-all duration-300 outline-none hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-gray-400/30 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-gray-400/20 text-black dark:text-white"
      >
        {children}
      </button>
    );
  }

  return (
    <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#00000080_50%,#000000_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#ffffff80_50%,#ffffff_100%)]" />
      <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-gray-950 text-xs font-medium backdrop-blur-3xl">
        <button
          onClick={onClick}
          className="inline-flex h-14 rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 text-black dark:text-white border-[2px] border-black/20 dark:border-white/20 hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-gray-400/30 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-gray-400/20 transition-all px-10 gap-2 text-sm font-medium whitespace-nowrap cursor-pointer outline-none"
        >
          {children}
        </button>
      </div>
    </span>
  );
};

export default function Hero() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { openLogin } = useAuthModal();

  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      openLogin();
    }
  };

  return (
    <motion.section className="relative h-full grid place-content-center overflow-hidden px-4 py-24 text-gray-200">
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <h1 className="w-full max-w-xs sm:max-w-3xl break-words bg-gradient-to-br from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-center text-2xl sm:text-5xl md:text-7xl font-medium leading-snug sm:leading-tight md:leading-tight text-transparent selection:text-black selection:bg-white dark:selection:text-white dark:selection:bg-black">
          Shorten your Links
        </h1>
        <p className="my-6 w-full max-w-sm sm:max-w-xl text-center text-sm sm:text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          Clean and efficient link shortening tool. Just drop a long URL and get
          a sleek short one.
        </p>
        <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4 w-full max-w-xs sm:max-w-none justify-center">
          <Button onClick={handleGetStarted} variant="primary">
            Get Started
          </Button>
          <Button
            onClick={() =>
              window.open("https://github.com/gvrciary/nex-url", "_blank")
            }
            variant="outline"
          >
            <Github className="h-4 w-4 mr-2" />
            View Repository
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Particles className="h-full" quantity={300} />
      </div>
    </motion.section>
  );
}
