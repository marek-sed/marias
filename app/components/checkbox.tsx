import * as rc from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";
import {
  CheckIcon,
  Cross1Icon,
  DividerHorizontalIcon,
} from "@radix-ui/react-icons";
import { useCallback } from "react";

const checkboxClass = cva([
  "flex",
  "rounded",
  "bg-sage-7",
  "hover:bg-sage-8",
  "active:bg-teal-10 active:text-sage-7",
  "w-6 h-6",
  "items-center justify-center",
  "border-teal-7 border-2",
]);
const indicatorClass = cva(["text-teal-9"]);

type Props = {
  id?: string;
  type?: "indeterminate" | "normal";
  name?: string;
  value?: boolean | "indeterminate";
  defaultValue?: boolean;
  onChange?: (checked: boolean | "indeterminate") => void;
};
export function Checkbox({
  id,
  name,
  value,
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
      className={checkboxClass()}
      //   checked={value}
      //   defaultChecked={defaultValue}
      onCheckedChange={onCheckedChange}
      checked="indeterminate"
    >
      <rc.CheckboxIndicator className={indicatorClass()}>
        {value === true && <CheckIcon className="h-5 w-5" />}
        {value === false && <Cross1Icon className="h-5 w-5" />}
        {value === "indeterminate" && <DividerHorizontalIcon />}
      </rc.CheckboxIndicator>
    </rc.Root>
  );
}
