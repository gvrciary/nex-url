"use client";

import React from "react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { Particles } from "@/components/landing/background/particles";

const HERO_BUTTON_BASE_CLASSES =
  "inline-flex cursor-pointer items-center justify-center rounded-full px-8 h-12 text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

const HERO_BUTTON_VARIANTS = {
  primary:
    "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border border-transparent",
  outline:
    "border border-black text-black hover:bg-black/5 dark:border-white dark:text-white dark:hover:bg-white/10 bg-transparent",
} as const;

const HERO_TITLE_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const HERO_SECTION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const HERO_DESCRIPTION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      delay: 0.24,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const HERO_ACTIONS_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      delay: 0.34,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const HERO_WORD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  className?: string;
}) => {
  return (
    <m.button
      onClick={onClick}
      className={`${HERO_BUTTON_BASE_CLASSES} ${HERO_BUTTON_VARIANTS[variant]} ${className}`}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </m.button>
  );
};

export default function Hero({ session }: { session: boolean }) {
  const router = useRouter();
  const { openLogin } = useAuthModal();

  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      openLogin();
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.section className="relative min-h-svh grid place-content-center overflow-hidden px-4 py-24 text-gray-200">
        <div className="relative z-10 flex flex-col items-center w-full px-4">
          <m.h1
            className="text-balance text-center text-5xl md:text-7xl font-medium tracking-[-0.04em]"
            initial="hidden"
            animate="visible"
            variants={HERO_TITLE_VARIANTS}
          >
            {["Shorten", "Your", "Links"].map((word, i) => (
              <React.Fragment key={i}>
                <m.span
                  className="inline-block pb-1 text-black dark:text-white"
                  variants={HERO_WORD_VARIANTS}
                >
                  {word}
                </m.span>
                {i === 0 ? <br /> : " "}
              </React.Fragment>
            ))}
          </m.h1>
          <m.p
            className="my-6 w-full max-w-sm text-pretty text-center text-sm leading-relaxed text-gray-800 sm:max-w-xl sm:text-base md:text-lg dark:text-gray-200"
            initial="hidden"
            animate="visible"
            variants={HERO_DESCRIPTION_VARIANTS}
          >
            Clean and efficient link shortening tool. Just drop a long URL and
            get a sleek short one.
          </m.p>
          <m.div
            className="flex w-full max-w-xs flex-col justify-center gap-y-4 sm:max-w-none sm:flex-row sm:gap-x-4 sm:gap-y-0"
            initial="hidden"
            animate="visible"
            variants={HERO_ACTIONS_VARIANTS}
          >
            <Button
              onClick={handleGetStarted}
              variant="primary"
              className="w-full"
            >
              Get Started
            </Button>

            <a
              href="https://github.com/alexisgvrcia/nex-url"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                <Github className="h-4 w-4 mr-2" />
                View Repository
              </Button>
            </a>
          </m.div>
        </div>

        <div className="absolute inset-0 z-0">
          <Particles className="h-full" />
        </div>
      </m.section>
    </LazyMotion>
  );
}
