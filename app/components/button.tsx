import type { ButtonHTMLAttributes, ForwardedRef, MouseEvent } from "react";
import { forwardRef, useCallback } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { MotionProps } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { usePress } from "@react-aria/interactions";

const buttonClass = cva(
  [
    "focus:ring-none outline-none",
    "relative",
    "flex flex-grow",
    "items-center",
    "justify-center",
    "hover:bg-sage-4 bg-sage-3",
  ],
  {
    variants: {
      size: {
        small: "h-7",
        normal: "h-9",
        large: "h-12",
      },
      aspect: {
        square: "",
        wide: "w-full",
      },
      color: {
        game: "text-game-accent-color",
        accent: "text-accent-color",
        default: "text-sage-12",
      },
    },
    compoundVariants: [
      {
        aspect: "square",
        size: "normal",
        className: "w-9",
      },
      { aspect: "square", size: "large", className: "w-12" },
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
    { color, aspect, size, onClick, ...props }: Props,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const { pressProps } = usePress({
      onPressStart: () => {
        controls.stop();
        controls.set({
          background: "var(--sage6)",
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
        console.log("color", color);
        controls.start({
          background: "var(--sage3)",
          color: [
            "var(--sage12)",
            color === "default"
              ? "var(--sage-12)"
              : color === "game"
              ? "var(--game-accent-color)"
              : "var(--teal-9)",
          ],
          transition: {
            duration: 0.3,
          },
        });
      },
    });
    const controls = useAnimation();
    return (
      <motion.button
        {...(pressProps as any)}
        {...props}
        animate={controls}
        ref={ref}
        className={buttonClass({ color, aspect, size })}
        {...props}
      />
    );
  }
);

Button.displayName = "button";
