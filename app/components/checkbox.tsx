import * as rc from "@radix-ui/react-checkbox";
import { cva, cx } from "class-variance-authority";
import {
  CheckIcon,
  Cross1Icon,
  DividerHorizontalIcon,
} from "@radix-ui/react-icons";
import { useCallback } from "react";
import { Touchable } from "./pressable";

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
      <Touchable aspect="square" size="normal" border color="game">
        <rc.CheckboxIndicator className={indicatorClass()}>
          <CheckIcon className="h-9 w-9" />
        </rc.CheckboxIndicator>
      </Touchable>
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
      asChild
    >
      <Touchable aspect="square" border color="game">
        <rc.CheckboxIndicator forceMount className={indicatorClass()}>
          {value === "indeterminate" ? (
            <DividerHorizontalIcon className="h-7 w-5" />
          ) : (
            <CheckIcon className="h-7 w-7" />
          )}
        </rc.CheckboxIndicator>

        {value === false && (
          <Cross1Icon className={cx("h-6 w-6", indicatorClass())} />
        )}
      </Touchable>
    </rc.Root>
  );
}
