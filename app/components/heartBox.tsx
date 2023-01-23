import * as rc from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";
import { HeartFilledIcon } from "@radix-ui/react-icons";

const checkboxClass = cva([
  "flex",
  "rounded",
  "bg-sage-7",
  "hover:bg-sage-8",
  "active:bg-tomato-10 active:text-sage-7",
  "w-8 h-8",
  "items-center justify-center",
  "border-tomato-7 border-2",
]);
const indicatorClass = cva(["text-tomato-9 "]);

type Props = {
  id?: string;
  name?: string;
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (checked: boolean) => void;
};
export function HeartBox({ id, name, value, defaultValue, onChange }: Props) {
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
        <HeartFilledIcon className="h-6 w-6" />
      </rc.CheckboxIndicator>
    </rc.Root>
  );
}
