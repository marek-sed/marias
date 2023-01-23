import * as rc from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";
import {
  CheckIcon,
  Cross1Icon,
  DividerHorizontalIcon,
} from "@radix-ui/react-icons";
import { useCallback } from "react";

const checkboxClass = cva(
  [
    "flex",
    "rounded",
    "bg-sage-7",
    "hover:bg-sage-8",
    "active:text-sage-7",
    "w-8 h-8",
    "items-center justify-center",
    "border-2",
  ],
  {
    variants: {
      color: {
        teal: "border-teal-7 active:bg-teal-10 active:text-sage-7",
        red: "border-tomato-7 active:bg-tomato-10 active:text-sage-7",
      },
    },
  }
);
const indicatorClass = cva([""], {
  variants: {
    color: {
      teal: "text-teal-11",
      red: " text-tomato-11",
    },
  },
});

type Props = {
  id?: string;
  type?: "indeterminate" | "normal";
  name?: string;
  color?: "teal" | "red";
  value?: boolean | "indeterminate";
  defaultValue?: boolean;
  onChange?: (checked: boolean | "indeterminate") => void;
};
export function Checkbox({
  id,
  name,
  value,
  color = "teal",
  type = "normal",
  defaultValue,
  onChange,
}: Props) {
  const onCheckedChange = useCallback(
    (checked: boolean | "indeterminate") => {
      switch (type) {
        case "normal": {
          onChange?.(checked);
          break;
        }
        case "indeterminate": {
          if (value === "indeterminate") {
            onChange?.(true);
          } else if (value === false) {
            onChange?.("indeterminate");
          } else {
            onChange?.(false);
          }
        }
      }
    },
    [value, onChange, type]
  );
  return (
    <rc.Root
      id={id}
      name={name}
      className={checkboxClass({ color })}
      checked={value}
      defaultChecked={defaultValue}
      onCheckedChange={onCheckedChange}
    >
      <rc.CheckboxIndicator className={indicatorClass({ color })}>
        {value === true && <CheckIcon className="h-7 w-7" />}
        {value === false && <Cross1Icon className="h-6 w-6" />}
        {value === "indeterminate" && (
          <DividerHorizontalIcon className="h-7 w-7" />
        )}
      </rc.CheckboxIndicator>
    </rc.Root>
  );
}
