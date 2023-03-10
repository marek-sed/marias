import type { ButtonHTMLAttributes, MouseEvent } from "react";
import type { VariantProps } from "class-variance-authority";
import { forwardRef, useEffect } from "react";
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
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:border-gray-5 disabled:text-gray-11",
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
        large: "h-14",
      },
      aspect: {
        square: "px-0 flex-grow-0",
        "11/12": "px-0 flex-grow-0",
      },
      color: {
        default: "text-gray-12",
        red: "text-red-9 bg-red-1",
        green: "text-grass-3",
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
        aspect: "11/12",
        size: "normal",
        className: "w-12",
      },
      {
        border: true,
        color: "game",
        className:
          "border-game-border-color hover:border-game-border-hover-color disabled:hover:border-gray-5",
      },
      {
        border: true,
        color: "red",
        className: "border-red-6 hover:border-red-7",
      },
      {
        border: true,
        color: "default",
        className: "border-gray-6 hover:border-gray-7",
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
  disabled?: boolean;
  selected?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  color: TouchableVariantProps["color"];
};

function resolveColor(color: TouchableOptions["color"]) {
  let active,
    textActive,
    bg,
    hover,
    text = "";

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
    case "default": {
      active = "var(--gray5)";
      textActive = "var(--gray12)";
      bg = "var(--gray3)";
      hover = "var(--gray4)";
      text = "var(--gray12)";
    }
  }

  return { active, textActive, bg, hover, text };
}

export function usePressable({
  onClick,
  color,
  disabled: isDisabled,
  selected,
}: TouchableOptions) {
  const controls = useAnimation();
  const { active, bg, hover, text, textActive } = resolveColor(color);

  useEffect(() => {
    const { bg, text, textActive } = resolveColor(color);
    if (isDisabled) {
      controls.start({
        background: "var(--gray4)",
        color: "var(--gray11)",
        transition: {
          duration: 0,
        },
      });
    } else {
      controls.start({
        background: bg,
        color: selected ? textActive : text,
        transition: {
          duration: 0,
        },
      });
    }
    return () => {
      controls.stop();
    };
  }, [isDisabled, selected, controls, color]);

  const { pressProps } = usePress({
    isDisabled,
    onPressStart: () => {
      controls.stop();
      controls.set({
        background: active,
        color: selected ? textActive : text,
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
        color: selected ? textActive : text,
        transition: {
          duration: 0.2,
        },
      });
    },
  });

  const { hoverProps } = useHover({
    isDisabled,
    onHoverStart: (e) => {
      controls.stop();
      controls.set({
        background: hover,
        color: selected ? textActive : text,
        transition: {
          duration: 0.2,
        },
      });
    },
    onHoverEnd: (e) => {
      controls.start({
        background: bg,
        color: selected ? textActive : text,
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
      disabled = false,
      selected = false,
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
      selected,
      disabled,
      onClick,
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
        disabled={disabled}
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

Touchable.displayName = "Touchable";
