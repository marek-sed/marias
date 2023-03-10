import * as rc from "@radix-ui/react-checkbox";
import { Cross1Icon, HeartFilledIcon } from "@radix-ui/react-icons";
import { GiHastyGrave } from "react-icons/gi";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { useCallback } from "react";
import type { IndeterminateBool } from "~/utils/types";
import { Touchable } from "./touchable";

const checkboxClass = cva([
  "flex",
  "rounded",
  "bg-red-1",
  "hover:bg-red-2",
  "active:bg-red-3 active:text-gray-7",
  "items-center justify-center",
  "border-red-6 hover:border-red-8 border-2",
]);
const indicatorClass = cva(["text-red-9"]);

const MotionHeart = motion(HeartFilledIcon, { forwardMotionProps: true });

type Props<T = boolean> = {
  id?: string;
  name?: string;
  value?: T;
  defaultValue?: T;
  onChange?: (checked: T) => void;
  isDisabled?: boolean;
};
export function HeartBox({ id, name, value, defaultValue, onChange }: Props) {
  return (
    <rc.Root
      id={id}
      name={name}
      className={checkboxClass()}
      checked={value}
      defaultChecked={defaultValue}
      onCheckedChange={onChange}
      asChild
    >
      <Touchable border aspect="square" color="red">
        <rc.CheckboxIndicator className={indicatorClass()}>
          <MotionHeart
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              repeat: 100,
              repeatType: "loop",
              repeatDelay: 0.3,
            }}
            initial={{ scale: 1 }}
            animate={{
              scale: 1.15,
            }}
            className="h-7 w-7"
          />
        </rc.CheckboxIndicator>
      </Touchable>
    </rc.Root>
  );
}
