"use client";

import { motion, type Variants } from "framer-motion";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/components/providers/auth-provider";
import Button from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  },
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
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-6xl sm:text-7xl font-extralight tracking-tight mb-8 text-black dark:text-white"
          variants={itemVariants}
        >
          Shorten
          <br />
          <span className="font-light">your Links</span>
        </motion.h1>

        <motion.p
          className="text-xl font-light text-black/70 dark:text-white/70 mb-16 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Transform long URLs into short and elegant links. Track clicks,
          analyze audience and manage your links professionally.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          variants={itemVariants}
        >
          <Button size="lg" className="px-12" onClick={handleGetStarted}>
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-12 bg-transparent"
            onClick={() =>
              window.open("https://github.com/alexisgxrcia/nex-url", "_blank")
            }
          >
            <Github className="h-4 w-4 mr-2" />
            View Repository
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
