'use client'

import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { baseUrl } from "@/constants/url";

export default function UrlDemo() {
  const longUrl =
    "https://www.amazon.com.mx/Bose-SoundLink-Revolve-Serie-Inal%C3%A1mbrico/dp/B08VLD15ZL?pd_rd_w=m4ro8&content-id=amzn1.sym.5b9d40c5-ea58-491d-97a3-88a3fd0ab0ae&pf_rd_p=5b9d40c5-ea58-491d-97a3-88a3fd0ab0ae&pf_rd_r=ATWS93BTDR7TJYZWFXJX&pd_rd_wg=3qxtf&pd_rd_r=7c6ab236-8b5d-4de2-9591-e297568ebf89&pd_rd_i=B08VL5S148&th=1";
  const shortUrl = `${baseUrl}/bose`
  const animationDelay = 2;
  const transformDuration = 1.5;
  const [showTransform, setShowTransform] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransform(true);
    }, animationDelay * 1000);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  const arrowVariants: Variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      ref={ref}
      className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto py-16"
    >
      <motion.div
        className="flex justify-center w-full mt-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showTransform ? 1 : 0.3,
          scale: showTransform ? 1 : 0.8,
        }}
        transition={{ delay: transformDuration * 0.3, duration: 0.6 }}
      >
        <motion.svg
          width="500"
          height="80"
          viewBox="0 0 500 80"
          className="text-black dark:text-white"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="currentColor"
                className="text-black dark:text-white"
              />
            </marker>
          </defs>

          <motion.path
            d="M 80,60 Q 250,-20 420,60"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            variants={arrowVariants}
            initial="hidden"
            animate={showTransform ? "visible" : "hidden"}
            markerEnd="url(#arrowhead)"
            className="text-black dark:text-white"
          />
        </motion.svg>
      </motion.div>

      <div className="flex items-center justify-center gap-8 w-full">
        <motion.div
          className="flex-1 max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 p-4 backdrop-blur-sm">
            <p className="text-sm font-light text-gray-600 dark:text-gray-300 break-all leading-relaxed">
              {longUrl}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: showTransform ? 1 : 0.3,
            x: showTransform ? 0 : 20,
            scale: showTransform ? 1 : 0.95,
          }}
          transition={{ delay: transformDuration * 0.7, duration: 0.6 }}
        >
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 p-4 backdrop-blur-sm">
            <motion.p
              className="text-sm font-light text-gray-800 dark:text-gray-100 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {shortUrl}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
