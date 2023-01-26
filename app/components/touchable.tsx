import type { ButtonHTMLAttributes, MouseEvent } from "react";
import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { usePress, useHover } from "@react-aria/interactions";
import { motion, useAnimation } from "framer-motion";
import { useGameContext } from "./gameContext";
import { cva } from "class-variance-authority";

const touchableClass = cva(
  [
    "focus:ring-none outline-none",
    "relative",
    "flex flex-grow flex-shrink-0",
    "items-center",
    "justify-start",
    "bg-game-bg-color",
    "transition-colors",
    "duration-400",
  ],
  {
    variants: {
      align: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
      },
      size: {
        normal: "h-11",
      },
      aspect: {
        square: "px-0 flex-grow-0",
      },
      color: {
        default: "text-gray-12",
        red: "text-red-9 bg-red-1",
        green: "text-green-3",
        game: "text-game-color hover:text-game-color-hover",
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
      align: "center",
    },
  }
);
type TouchableVariantProps = VariantProps<typeof touchableClass>;
type TouchableOptions = TouchableVariantProps & {
  isPressed?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  color: TouchableVariantProps["color"];
};
export function usePressable({ onClick, color, isPressed }: TouchableOptions) {
  const controls = useAnimation();
  let active: string;
  let bg: string;
  let text: string;
  let textActive: string;
  let hover: string;
  switch (color) {
    case "red": {
      active = "var(--red5)";
      textActive = "var(--red11)";
      bg = "var(--red1)";
      hover = "var(--red3)";
      text = "var(--red9)";
      break;
    }
    case "game": {
      active = "var(--game-bg-active-color)";
      textActive = "var(--game-color-active)";
      bg = "var(--game-bg-color)";
      hover = "var(--game-bg-hover-color)";
      text = "var(--game-color)";
      break;
    }
  }

  const { pressProps } = usePress({
    onPressStart: () => {
      controls.stop();
      controls.set({
        background: active,
        color: text,
        transition: {
          duration: 0.3,
        },
      });
    },
    onPress: (e) => {
      onClick?.({ ...e, isPropagationStopped: () => true } as any);
    },
    onPressEnd: (e) => {
      controls.start({
        background: bg,
        color: isPressed ? text : textActive,
        transition: {
          duration: 0.2,
        },
      });
    },
  });

  const { hoverProps } = useHover({
    onHoverStart: (e) => {
      controls.stop();
      controls.set({
        background: hover,
        color: text,
        transition: {
          duration: 0.2,
        },
      });
    },
    onHoverEnd: (e) => {
      controls.start({
        background: bg,
        color: isPressed ? text : textActive,
        transition: {
          duration: 0.1,
        },
      });
    },
  });

  return {
    pressProps,
    hoverProps,
    controls,
  };
}

type Props = TouchableOptions & ButtonHTMLAttributes<HTMLButtonElement>;
export const Touchable = forwardRef<HTMLButtonElement, Props>(
  (
    {
      isPressed,
      children,
      aspect,
      size,
      onClick,
      color,
      align,
      border,
      className,
      ...buttonProps
    },
    ref
  ) => {
    const { pressProps, hoverProps, controls } = usePressable({
      onClick,
      isPressed,
      color,
    });
    const game = useGameContext();

    return (
      <motion.button
        key={game?.type}
        ref={ref}
        type="button"
        {...(pressProps as any)}
        {...(hoverProps as any)}
        {...buttonProps}
        animate={controls}
        className={touchableClass({
          size,
          aspect,
          color,
          border,
          align,
          className,
        })}
      >
        {children}
      </motion.button>
    );
  }
);

Touchable.displayName = "Pressable";
