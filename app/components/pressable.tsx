import type { ButtonHTMLAttributes, MouseEvent } from "react";
import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { usePress } from "@react-aria/interactions";
import { motion, useAnimation } from "framer-motion";
import { useGameContext } from "./gameContext";
import { cva } from "class-variance-authority";

const pressableClass = cva(
  [
    "focus:ring-none outline-none",
    "relative",
    "flex flex-grow",
    "items-center",
    "justify-center",
    "bg-game-bg-color",
    "transition-colors",
    "duration-400",
  ],
  {
    variants: {
      size: {
        small: "h-8 px-2",
        normal: "h-9 px-4",
        large: "h-12",
      },
      aspect: {
        square: "px-0 flex-grow-0",
      },
      type: {
        game: "text-game-color",
        default: "text-sage-12",
      },
      border: {
        true: "border-2 rounded",
        false: "border-none",
      },
    },
    compoundVariants: [
      {
        aspect: "square",
        size: "small",
        className: "w-8",
      },
      {
        aspect: "square",
        size: "normal",
        className: "w-9",
      },
      { aspect: "square", size: "large", className: "w-12" },
      {
        border: true,
        type: "game",
        className:
          "border-game-border-color hover:border-game-border-hover-color",
      },
    ],
    defaultVariants: {
      size: "normal",
      type: "default",
    },
  }
);
type PressableVariantProps = VariantProps<typeof pressableClass>;
type PressableOptions = PressableVariantProps & {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};
export function usePressable({ onClick, type }: PressableOptions) {
  const controls = useAnimation();

  const { pressProps, isPressed } = usePress({
    onPressStart: () => {
      controls.stop();
      controls.set({
        background: "var(--game-bg-active-color)",
        color: "var(--sage12)",
        transition: {
          duration: 0.4,
        },
      });
    },
    onPress: (e) => {
      onClick?.({ ...e, isPropagationStopped: () => true } as any);
    },
    onPressEnd: (e) => {
      controls.start({
        background: "var(--game-bg-color)",
        color: type === "default" ? "var(--sage-12)" : "var(--game-color)",
        transition: {
          duration: 0.2,
        },
      });
    },
  });

  return {
    pressProps,
    isPressed,
    controls,
  };
}

type Props = PressableOptions & ButtonHTMLAttributes<HTMLButtonElement>;
export const Pressable = forwardRef<HTMLButtonElement, Props>(
  ({ children, aspect, size, onClick, border, ...buttonProps }, ref) => {
    const { pressProps, controls } = usePressable({ onClick });
    const game = useGameContext();
    const type = game?.type ? "game" : "default";

    return (
      <motion.button
        ref={ref}
        {...(pressProps as any)}
        {...buttonProps}
        animate={controls}
        className={pressableClass({ size, aspect, type, border })}
      >
        {children}
      </motion.button>
    );
  }
);

Pressable.displayName = "Pressable";
