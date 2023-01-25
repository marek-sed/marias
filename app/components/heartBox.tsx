import * as rc from "@radix-ui/react-checkbox";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";

const checkboxClass = cva([
  "flex",
  "rounded",
  "bg-red-3",
  "hover:bg-red-4",
  "active:bg-red-3 active:text-gray-7",
  "w-8 h-8",
  "items-center justify-center",
  "border-red-6 hover:border-red-8 border-2",
]);
const indicatorClass = cva(["text-red-9"]);

const MotionHeart = motion(HeartFilledIcon, { forwardMotionProps: true });

type Props = {
  id?: string;
  name?: string;
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (checked: boolean) => void;
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
    >
      <rc.CheckboxIndicator className={indicatorClass()}>
        <AnimatePresence>
          <MotionHeart
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              repeat: 100,
              repeatType: "loop",
              repeatDelay: 0.3,
            }}
            initial={{ scale: 1.05 }}
            animate={{
              scale: 1.25,
            }}
            className="h-5 w-5"
          />
        </AnimatePresence>
      </rc.CheckboxIndicator>
    </rc.Root>
  );
}
