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
      horizontal: ["space-y-1 items-center justify-between md:items-center"],
      vertical: ["flex-col", "space-y-1", "items-end"],
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
      className:
        "justify-start sm:justify-between sm:space-y-1 items-start sm:space-x-2",
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

const labelClass = cva(["text-teal-12"], {
  variants: {
    direction: {
      horizontal: [""],
      vertical: [""],
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
