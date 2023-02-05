import * as rc from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";
import { CheckIcon } from "@radix-ui/react-icons";
import { Touchable } from "./touchable";

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
