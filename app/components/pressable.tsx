import type { ButtonHTMLAttributes, MouseEvent } from "react";
import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { usePress } from "@react-aria/interactions";
import { motion, useAnimation } from "framer-motion";
import { useGameContext } from "./gameContext";
import { cva } from "class-variance-authority";

const colorVariants = cva("text-sage-12", {
  variants: {},
});

const touchableClass = cva(
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
        normal: "h-11",
      },
      aspect: {
        square: "px-0 flex-grow-0",
      },
      color: {
        default: "text-sage-12",
        red: "text-red-9 bg-red-3",
        green: "text-green-1",
        game: "text-game-color",
      },
      border: {
        true: "border-2 rounded",
        false: "border-none",
      },
    },
    compoundVariants: [
      {
        aspect: "square",
        size: "normal",
        className: "w-11",
      },
      {
        border: true,
        color: "game",
        className:
          "border-game-border-color hover:border-game-border-hover-color",
      },
      {
        border: true,
        color: "red",
        className: "border-red-6 hover:border-red-7",
      },
    ],
    defaultVariants: {
      size: "normal",
      color: "default",
    },
  }
);
type TouchableVariantProps = VariantProps<typeof touchableClass>;
type TouchableOptions = TouchableVariantProps & {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  color: TouchableVariantProps["color"];
};
export function usePressable({ onClick, color }: TouchableOptions) {
  const controls = useAnimation();
  let active: string;
  let bg: string;
  let text: string;
  switch (color) {
    case "red": {
      active = "var(--red5)";
      bg = "var(--red3)";
      text = "var(--red9)";
      break;
    }
    case "game": {
      active = "var(--game-bg-active-color)";
      bg = "var(--game-bg-color)";
      text = "var(--game-color)";
      break;
    }
  }

  const { pressProps, isPressed } = usePress({
    onPressStart: () => {
      controls.stop();
      controls.set({
        background: active,
        color: "text",
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
        background: bg,
        color: text,
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

type Props = TouchableOptions & ButtonHTMLAttributes<HTMLButtonElement>;
export const Touchable = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      aspect,
      size,
      onClick,
      color,
      border,
      className,
      ...buttonProps
    },
    ref
  ) => {
    const { pressProps, controls } = usePressable({ onClick, color });
    const game = useGameContext();
    // const type = game?.type ? "game" : "default";

    return (
      <motion.button
        key={game?.type}
        ref={ref}
        type="button"
        {...(pressProps as any)}
        {...buttonProps}
        animate={controls}
        className={touchableClass({ size, aspect, color, border, className })}
      >
        {children}
      </motion.button>
    );
  }
);

Touchable.displayName = "Pressable";
