import * as rrg from "@radix-ui/react-radio-group";
import type { Option } from "./select";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { Touchable } from "./touchable";

const rootClass = cva([
  "flex w-full divide-x-2 rounded border-2",
  "divide-game-border-color border-game-border-color",
  "font-medium",
]);
const labelClass = cva(["cursor-pointer block relative z-10"]);
const indicatorClass = cva(
  ["absolute z-10", "w-full", "bg-game-bg-active-color"],
  {
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
  }
);

type Props = {
  id?: string;
  name?: string;
  options: Option[];
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  type?: "normal" | "better";
  className?: string;
};

export function GamePicker({
  id,
  name,
  value,
  defaultValue,
  options,
  onChange,
  type,
  className,
}: Props) {
  const optionCount = options.length;
  return (
    <rrg.Root
      {...{ value, defaultValue, id, name }}
      onValueChange={onChange}
      className={rootClass({ className })}
    >
      {options.map(({ value: v, label }, index) => (
        <rrg.Item asChild key={v} value={v} id={v}>
          <Touchable key={type} selected={v === value} color="game">
            <rrg.Indicator asChild>
              <motion.div
                layoutId={name}
                transition={{
                  ease: "easeOut",
                  duration: 0.5,
                }}
                style={{ height: 48 }}
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
          </Touchable>
        </rrg.Item>
      ))}
    </rrg.Root>
  );
}
