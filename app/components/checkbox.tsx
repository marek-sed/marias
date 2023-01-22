import * as rc from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";
import { CheckIcon } from "@radix-ui/react-icons";

const checkboxClass = cva([
  "flex",
  "rounded",
  "bg-sage-7",
  "hover:bg-sage-8",
  "active:bg-sage-9",
  "w-6 h-6",
  "items-center justify-center",
]);
const indicatorClass = cva(["text-teal-9"]);

type Props = {
  id?: string;
  name?: string;
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (checked: boolean) => void;
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
    >
      <rc.CheckboxIndicator className={indicatorClass()}>
        <CheckIcon className="h-5 w-5" />
      </rc.CheckboxIndicator>
    </rc.Root>
  );
}
