import { Link } from "@remix-run/react";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  to: string;
};

const touchableClass = cva(
  [
    "focus:ring-none outline-none flex space-x-8 w-48 items-center p-3 rounded-full transition-colors duration-300",
  ],
  {
    variants: {
      color: {
        grass: [
          "bg-grass-1 text-grass-11 border-grass-7 border-2",
          "hover:bg-grass-4",
          "active:bg-grass-5",
        ],
      },
    },
  }
);

export function FAB({ children, to, className }: Props) {
  return (
    <Link to={to} className={touchableClass({ color: "grass", className })}>
      {children}
    </Link>
  );
}
