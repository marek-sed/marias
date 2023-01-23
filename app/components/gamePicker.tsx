import * as rrg from "@radix-ui/react-radio-group";
import type { Option } from "./select";
import { cva, cx } from "class-variance-authority";
import { motion } from "framer-motion";

const rootClass = cva(["flex w-full divide-x-2  rounded  border-2"], {
  variants: {
    type: {
      normal: "divide-teal-7 border-teal-7",
      better: "divide-tomato-7 border-tomato-7",
    },
  },
});
const itemClass = cva(
  ["relative", "h-12", "flex-grow", "bg-sage-4", "hover:bg-sage-5"],
  {
    variants: {
      type: {
        normal: "active:bg-teal-7",
        better: "active:bg-tomato-7",
      },
    },
  }
);
const labelClass = cva(["cursor-pointer block relative z-10"]);
const indicatorClass = cva(["absolute top-0 z-10 h-12 w-full"], {
  variants: {
    type: {
      normal: "bg-teal-7",
      better: "bg-tomato-7",
    },
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
  type?: "normal" | "better";
};

export function GamePicker<T>({
  id,
  name,
  value,
  defaultValue,
  options,
  onChange,
  type = "normal",
}: Props) {
  const optionCount = options.length;
  return (
    <rrg.Root
      {...{ value, defaultValue, id, name }}
      onValueChange={onChange}
      className={rootClass({ type })}
    >
      {options.map(({ value, label }, index) => (
        <rrg.Item
          key={value}
          className={itemClass({ type })}
          value={value}
          id={value}
        >
          <rrg.Indicator asChild>
            <motion.div
              layoutId={name}
              className={indicatorClass({
                type,
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
