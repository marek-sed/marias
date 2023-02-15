import type { Variant, Variants } from "framer-motion";
import {
  useMatches,
  useLocation,
  useNavigationType,
  useOutlet,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigationAnimation } from "~/utils";

const PUSH_REPLACE: Variant = {
  x: 0,
  opacity: 1,
  transition: {
    delay: 0.1,
    ease: "easeInOut",
    duration: 0.25,
  },
};
const variants: Variants = {
  PUSH: PUSH_REPLACE,
  REPLACE: PUSH_REPLACE,
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
  const pathname = useLocation().pathname;

  const { x } = useNavigationAnimation();

  const outlet = useOutlet();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={pathname}
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
