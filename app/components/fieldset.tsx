import type { ReactNode } from "react";
import { animate, motion } from "framer-motion";

const fieldsetClass =
  "relative rounded border border-gray-7 bg-gray-2 px-3 py-3";
const legendClass = "text-grass-12";

type Props = {
  children: ReactNode;
  legend?: string;
  animated?: boolean;
};
export function Fieldset({ children, legend, animated = false }: Props) {
  if (animated) {
    return (
      <motion.fieldset layout className={fieldsetClass}>
        <motion.legend
          key={legend}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, bounce: 0 }}
          className={legendClass}
        >
          {legend}
        </motion.legend>
        {children}
      </motion.fieldset>
    );
  }
  return (
    <fieldset className={fieldsetClass}>
      <legend className={legendClass}>{legend}</legend>
      {children}
    </fieldset>
  );
}
