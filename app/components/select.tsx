import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import * as rs from "@radix-ui/react-select";

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
  "inline-flex gap-1 items-center justify-center",
  "h-8 px-4",
  "rounded border-2 border-teal-7 bg-sage-7 hover:bg-sage-7",
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
      <rs.Trigger id={id} className={triggerClass()}>
        <rs.Value placeholder={placeholder} />
        <rs.Icon className="text-teal-9 hover:text-teal-10">
          <ChevronDownIcon />
        </rs.Icon>
      </rs.Trigger>
      <rs.Portal className="z-10">
        <rs.Content>
          <rs.Viewport className="relative rounded bg-sage-3 p-1  text-teal-12">
            {options.map((opt) => (
              <rs.Item
                key={opt.value}
                value={opt.value}
                className="flex items-center justify-between space-x-2 rounded  px-2
                py-3 outline-none focus:ring-0 data-[highlighted]:bg-sage-5
                "
              >
                <rs.ItemText>{opt.label}</rs.ItemText>

                <rs.ItemIndicator className="text-teal-10">
                  <CheckIcon />
                </rs.ItemIndicator>
              </rs.Item>
            ))}
          </rs.Viewport>
        </rs.Content>
      </rs.Portal>
    </rs.Root>
  );
}
