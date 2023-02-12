import { useHover, usePress } from "@react-aria/interactions";
import { Link, useNavigate } from "@remix-run/react";
import { cva } from "class-variance-authority";
import { motion, useAnimation } from "framer-motion";
import type { ReactNode } from "react";
import { usePressable } from "./touchable";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

const rootClass = "fixed bottom-4 right-4";
const touchableClass = cva(
  "focus:ring-none outline-none block p-3 rounded-full",
  {
    variants: {
      color: {
        grass: "bg-grass-1 text-grass-11 border-grass-7 border-2",
      },
    },
  }
);

export function FAB({ children, onClick }: Props) {
  const navigate = useNavigate();
  const controls = useAnimation();
  const { hoverProps } = useHover({
    onHoverStart: (e) => {
      controls.stop();
      controls.start({
        background: "var(--grass4)",
        transition: {
          duration: 0.2,
        },
      });
    },
    onHoverEnd: (e) => {
      controls.start({
        background: "var(--grass1)",
        transition: {
          duration: 0.5,
        },
      });
    },
  });
  const { pressProps } = usePress({
    onPressStart: () => {
      controls.stop();
      controls.set({
        background: "var(--grass5)",
      });
    },
    onPress: () => {},
    onPressEnd: async () => {
      await controls.start({
        background: "var(--grass1)",
        transition: {
          duration: 0.15,
        },
      });
      navigate("new");
    },
  });

  return (
    <div className={rootClass}>
      <motion.a
        onClick={(e) => {
          e.preventDefault();
        }}
        className={touchableClass({ color: "grass" })}
        animate={controls}
        {...(pressProps as any)}
        {...(hoverProps as any)}
      >
        {children}
      </motion.a>
    </div>
  );
}
