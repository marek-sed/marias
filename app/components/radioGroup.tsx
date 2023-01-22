import * as rrg from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";

const rootClass = cva([
  "flex divide-x-2 divide-teal-7 rounded border-teal-7 border-2",
]);
const itemClass = cva([
  "relative",
  "h-8",
  "bg-sage-7",
  "hover:bg-sage-8",
  "active:bg-teal-10",
]);
const labelClass = cva(["cursor-pointer relative px-3 z-10"]);
const indicatorClass = cva(["absolute top-0 z-10 h-8 w-full bg-teal-9"]);

export function RadioGroup() {
  return (
    <rrg.Root className={rootClass()} defaultValue="game">
      <rrg.Item className={itemClass()} value="game" id="r1">
        <rrg.Indicator asChild>
          <motion.div layoutId="indicator" className={indicatorClass()} />
        </rrg.Indicator>
        <label className={labelClass()}>hra</label>
      </rrg.Item>

      <rrg.Item className={itemClass()} value="hundred" id="r2">
        <rrg.Indicator asChild>
          <motion.div layoutId="indicator" className={indicatorClass()} />
        </rrg.Indicator>
        <label className={labelClass()}>stovka</label>
      </rrg.Item>

      <rrg.Item className={itemClass()} value="betl" id="r3">
        <rrg.Indicator asChild>
          <motion.div layoutId="indicator" className={indicatorClass()} />
        </rrg.Indicator>
        <label className={labelClass()}>betl</label>
      </rrg.Item>

      <rrg.Item className={itemClass()} value="durch" id="r4">
        <rrg.Indicator asChild>
          <motion.div layoutId="indicator" className={indicatorClass()} />
        </rrg.Indicator>
        <label className={labelClass()}>durch</label>
      </rrg.Item>
    </rrg.Root>
  );
}
