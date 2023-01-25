import * as rc from "@radix-ui/react-checkbox";
import { cva, cx } from "class-variance-authority";
import {
  CheckIcon,
  Cross1Icon,
  DividerHorizontalIcon,
} from "@radix-ui/react-icons";
import { useCallback } from "react";
import { Pressable } from "./pressable";

const checkboxClass = cva([]);

const indicatorClass = cva(["text-game-color"]);

type Props = {
  id?: string;
  name?: string;
  value?: boolean | "indeterminate";
  defaultValue?: boolean;
  onChange?: (checked: boolean | "indeterminate") => void;
};
export function Checkbox({ id, name, value, defaultValue, onChange }: Props) {
  return (
    <rc.Root
      id={id}
      name={name}
      className={checkboxClass()}
      checked={value}
      defaultChecked={defaultValue}
      onCheckedChange={onChange}
      asChild
    >
      <Pressable aspect="square" size="small" border>
        <rc.CheckboxIndicator className={indicatorClass()}>
          <CheckIcon className="h-7 w-7" />
        </rc.CheckboxIndicator>
      </Pressable>
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
      className={checkboxClass()}
      checked={value}
      onCheckedChange={onCheckedChange}
    >
      <rc.CheckboxIndicator forceMount asChild className={indicatorClass()}>
        <Pressable>
          {value === "indeterminate" ? (
            <DividerHorizontalIcon className="h-7 w-7" />
          ) : (
            <CheckIcon className="h-7 w-7" />
          )}
        </Pressable>
      </rc.CheckboxIndicator>

      {value === false && (
        <Cross1Icon className={cx("h-6 w-6", indicatorClass())} />
      )}
    </rc.Root>
  );
}
