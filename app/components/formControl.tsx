import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Children, cloneElement, isValidElement } from "react";
import * as rl from "@radix-ui/react-label";

type Props<T> = VariantProps<typeof formControlClass> & {
  name: string;
  label?: string;
  onChange?: (value: T) => void;
  value?: T;
  defaultValue?: T;
  children: ReactNode;
};

const formControlClass = cva(["flex w-full"], {
  variants: {
    direction: {
      horizontal: [
        "flex-col space-y-2 items-start md:flex-row md:items-center",
      ],
      vertical: ["flex-col", "space-y-1", "items-start"],
    },
    type: {
      input: [],
      checkbox: [],
    },
  },
  compoundVariants: [
    {
      direction: "horizontal",
      type: "input",
      className: "justify-between sm:space-y-0  sm:space-x-2",
    },
    {
      direction: "horizontal",
      type: "checkbox",
      className: "flex-row-reverse justify-end",
    },
  ],
  defaultVariants: {
    direction: "horizontal",
    type: "input",
  },
});

const labelClass = cva(["text-sage-11"], {
  variants: {
    direction: {
      horizontal: ["text-md"],
      vertical: ["text-sm"],
    },
    type: {
      checkbox: "ml-2",
      input: "",
    },
  },
  defaultVariants: {
    direction: "horizontal",
  },
});

export function Label({
  name,
  children,
  direction,
  type,
}: VariantProps<typeof labelClass> & { name: string; children: ReactNode }) {
  return (
    <rl.Root className={labelClass({ direction, type })} htmlFor={name}>
      {children}
    </rl.Root>
  );
}

export function FormControl<T>({
  name,
  direction,
  type,
  label,
  value,
  onChange,
  defaultValue,
  children,
}: Props<T>) {
  return (
    <div className={formControlClass({ direction, type })}>
      <rl.Root className={labelClass({ direction, type })} htmlFor={name}>
        {label}
      </rl.Root>
      {children &&
        Children.map(
          children,
          (child) =>
            isValidElement(child) &&
            cloneElement(child, {
              id: name,
              name,
              value,
              onChange,
              defaultValue,
            } as any)
        )}
    </div>
  );
}
