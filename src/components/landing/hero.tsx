"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  type Variants,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { GitHub } from "@/components/assets/github";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { Particles } from "@/components/landing/background/particles";
import Button from "@/components/ui/button";

const HERO_LINK_CLASSES =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-white/20 dark:focus:ring-offset-black";

const HERO_TITLE_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export default function Hero({ session }: { session: boolean }) {
  const { openLogin } = useAuthModal();
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? false : "hidden";

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative isolate min-h-svh overflow-hidden px-5 text-black dark:text-white sm:px-8">
        <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-4xl flex-col items-center justify-center py-28 text-center">
          <m.h1
            className="font-[family-name:var(--font-lastik)] text-balance text-5xl font-normal leading-[0.92] tracking-[-0.045em] sm:text-6xl md:text-7xl"
            initial={initial}
            animate="visible"
            variants={HERO_TITLE_VARIANTS}
          >
            <m.span className="block" variants={HERO_WORD_VARIANTS}>
              Shorten
            </m.span>
            <span className="block">
              <m.span className="inline-block" variants={HERO_WORD_VARIANTS}>
                Your
              </m.span>{" "}
              <m.span className="inline-block" variants={HERO_WORD_VARIANTS}>
                Links
              </m.span>
            </span>
          </m.h1>

          <div className="mt-6 flex w-full flex-col items-center">
            <m.p
              className="max-w-xl text-pretty text-sm leading-relaxed text-black/70 dark:text-white/70 sm:text-base md:text-lg"
              initial={initial}
              animate="visible"
              variants={HERO_DESCRIPTION_VARIANTS}
            >
              Clean and efficient link shortening tool. Just drop a long URL
              and get a sleek short one.
            </m.p>
            <m.div
              className="mt-7 flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row"
              initial={initial}
              animate="visible"
              variants={HERO_ACTIONS_VARIANTS}
            >
              {session ? (
                <Link
                  href="/dashboard"
                  className={`${HERO_LINK_CLASSES} bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 sm:min-w-36`}
                >
                  Get Started
                </Link>
              ) : (
                <Button
                  onClick={openLogin}
                  size="lg"
                  className="h-12 rounded-full px-8 sm:min-w-36"
                >
                  Get Started
                </Button>
              )}
              <a
                href="https://github.com/alexisgvrcia/nex-url"
                target="_blank"
                rel="noopener noreferrer"
                className={`${HERO_LINK_CLASSES} border border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black`}
              >
                <GitHub className="mr-2 h-4 w-4" />
                View Repository
              </a>
            </m.div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 opacity-70">
          <Particles className="h-full" />
        </div>
      </section>
    </LazyMotion>
  );
}
