import type { Variants } from "framer-motion";
import { useMatches, useNavigationType, useOutlet } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigationAnimation } from "~/utils";

const variants: Variants = {
  PUSH: {
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.1,
      ease: "easeInOut",
      duration: 0.25,
    },
  },
  POP: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0,
    },
  },
};
export function AnimatedOutlet() {
  const navType = useNavigationType();
  console.log("navType", navType);
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];

  const { x } = useNavigationAnimation();

  const outlet = useOutlet();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={currentMatch.id}
        initial={{ x: x[0], opacity: 0 }}
        variants={variants}
        animate={navType}
        exit={{ x: x[1], opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
