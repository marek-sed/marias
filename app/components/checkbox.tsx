import * as rc from "@radix-ui/react-checkbox";
import { cva, cx } from "class-variance-authority";
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
  defaultValue,
  onChange,
}: Props) {
  return (
    <rc.Root
      id={id}
      name={name}
      className={checkboxClass({ color })}
      checked={value}
      defaultChecked={defaultValue}
      onCheckedChange={onChange}
    >
      <rc.CheckboxIndicator className={indicatorClass({ color })}>
        <CheckIcon className="h-7 w-7" />
      </rc.CheckboxIndicator>
    </rc.Root>
  );
}

type IndeterminateProps = {
  id?: string;
  name?: string;
  color?: "teal" | "red";
  value?: boolean | "indeterminate";
  onChange?: (checked: boolean | "indeterminate") => void;
};
export function IndeterminateCheckbox({
  id,
  name,
  color,
  value,
  onChange,
}: IndeterminateProps) {
  const onCheckedChange = useCallback(
    (checked: boolean | "indeterminate") => {
      if (value === "indeterminate") {
        onChange?.(true);
      } else if (value === false) {
        onChange?.("indeterminate");
      } else {
        onChange?.(false);
      }
    },
    [value, onChange]
  );

  return (
    <rc.Root
      id={id}
      name={name}
      className={checkboxClass({ color })}
      checked={value}
      onCheckedChange={onCheckedChange}
    >
      <rc.CheckboxIndicator className={indicatorClass({ color })}>
        {value === "indeterminate" ? (
          <DividerHorizontalIcon className="h-7 w-7" />
        ) : (
          <CheckIcon className="h-7 w-7" />
        )}
      </rc.CheckboxIndicator>

      {value === false && (
        <Cross1Icon className={cx("h-6 w-6", indicatorClass({ color }))} />
      )}
    </rc.Root>
  );
}
