import * as rrg from "@radix-ui/react-radio-group";
import type { Option } from "./select";
import { cva, cx } from "class-variance-authority";
import { motion } from "framer-motion";

const rootClass = cva([
  "flex w-full divide-x-2 divide-teal-7 rounded border-teal-7 border-2",
]);
const itemClass = cva([
  "relative",
  "h-12",
  "flex-grow",
  "bg-sage-4",
  "hover:bg-sage-5",
  "active:bg-teal-9",
]);
const labelClass = cva(["cursor-pointer block relative z-10"]);
const indicatorClass = cva(["absolute top-0 z-10 h-12 w-full bg-tomato-9"], {
  variants: {
    position: {
      left: "rounded-l",
      center: "rounded-none",
      right: "rounded-r",
    },
  },
  defaultVariants: {
    position: "center",
  },
});

type Props = {
  id?: string;
  name?: string;
  options: Option[];
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
};

export function RadioGroup({
  id,
  name,
  value,
  defaultValue,
  options,
  onChange,
}: Props) {
  const optionCount = options.length;
  return (
    <rrg.Root
      {...{ value, defaultValue, id, name }}
      onValueChange={onChange}
      className={rootClass()}
    >
      {options.map(({ value, label }, index) => (
        <rrg.Item key={value} className={itemClass()} value={value} id={value}>
          <rrg.Indicator asChild>
            <motion.div
              layoutId={name}
              className={indicatorClass({
                position:
                  index === 0
                    ? "left"
                    : index === optionCount - 1
                    ? "right"
                    : "center",
              })}
            />
          </rrg.Indicator>
          <label className={labelClass()}>{label}</label>
        </rrg.Item>
      ))}
    </rrg.Root>
  );
}
