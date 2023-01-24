import * as rrg from "@radix-ui/react-radio-group";
import type { Option } from "./select";
import { cva, cx } from "class-variance-authority";
import { motion } from "framer-motion";
import { Button } from "./button";

const rootClass = cva([
  "flex w-full divide-x-2  rounded  border-2",
  "divide-game-color border-game-color",
]);
const labelClass = cva(["cursor-pointer block relative z-10"]);
const indicatorClass = cva(
  ["absolute top-0 z-10", "h-12 w-full", "bg-game-color"],
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
};

export function GamePicker<T>({
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
        <rrg.Item asChild key={value} value={value} id={value}>
          <Button color="default" size="large">
            <rrg.Indicator asChild>
              <motion.div
                layoutId={name}
                transition={{
                  ease: "easeOut",
                  duration: 0.5,
                }}
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
          </Button>
        </rrg.Item>
      ))}
    </rrg.Root>
  );
}
