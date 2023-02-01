import type { ButtonHTMLAttributes, ForwardedRef } from "react";
import { forwardRef } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { MotionProps } from "framer-motion";
import { Touchable } from "./touchable";

const buttonClass = cva(
  [
    "focus:ring-none outline-none",
    "relative",
    "rounded",
    "flex flex-grow",
    "items-center",
    "justify-center",
    "bg-gray-1",
  ],
  {
    variants: {
      border: {
        false: "border-none",
        true: "border-2 hover:border-game-border-hover-color",
      },
      size: {
        small: "h-7 px-2",
        normal: "h-12 px-4",
        large: "h-12",
      },
      aspect: {
        square: "px-0",
        wide: "px-4 w-full",
      },
      color: {
        game: "text-game-color",
        default: "text-gray-12",
      },
    },
    compoundVariants: [
      {
        aspect: "square",
        size: "normal",
        className: "w-9",
      },
      { aspect: "square", size: "large", className: "w-12" },
      {
        border: true,
        color: "default",
        className:
          "border-game-border-color hover:border-game-border-hover-color",
      },
      { border: true, color: "game", className: "border-game-color" },
    ],
    defaultVariants: {
      size: "normal",
      aspect: "wide",
      color: "default",
    },
  }
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonClass> &
  MotionProps;
export const Button = forwardRef(
  (
    { color, aspect, size, onClick, border, disabled, ...props }: Props,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <Touchable
        className="flex-end w-48"
        {...props}
        ref={ref}
        size="large"
        border
        color="game"
      />
    );
  }
);

Button.displayName = "button";
