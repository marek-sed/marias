import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import * as rs from "@radix-ui/react-select";
import { Touchable } from "./pressable";

export type Option = { value: string; label: string };
type Props = {
  id?: string;
  name?: string;
  placeholder: string;
  options: Option[];
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
};

const triggerClass = cva([
  "inline-flex gap-8 items-center justify-between",
  "h-10 pl-3 pr-1",
  "rounded border-2 border-green-7 bg-sage-3 hover:bg-sage-4",
]);

export function Select({
  id,
  name,
  placeholder,
  options,
  value,
  defaultValue,
  onChange,
}: Props) {
  return (
    <rs.Root
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
    >
      <rs.Trigger id={id} asChild>
        <Touchable className="flex-grow-0 gap-8 pl-3 pr-1" color="game" border>
          <rs.Value placeholder={placeholder} />
          <rs.Icon>
            <ChevronDownIcon className="h-6 w-6" />
          </rs.Icon>
        </Touchable>
      </rs.Trigger>
      <rs.Portal className="z-10">
        <rs.Content>
          <rs.Viewport className="relative rounded bg-sage-3 p-1  text-green-12">
            {options.map((opt) => (
              <rs.Item
                key={opt.value}
                value={opt.value}
                className="flex items-center justify-between space-x-2 rounded  px-2
                py-3 outline-none focus:ring-0 data-[highlighted]:bg-sage-5
                "
              >
                <rs.ItemText>{opt.label}</rs.ItemText>

                <rs.ItemIndicator className="text-green-11">
                  <CheckIcon className="h-6 w-6" />
                </rs.ItemIndicator>
              </rs.Item>
            ))}
          </rs.Viewport>
        </rs.Content>
      </rs.Portal>
    </rs.Root>
  );
}
