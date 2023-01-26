import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import * as rs from "@radix-ui/react-select";
import { Touchable } from "./pressable";
import { motion } from "framer-motion";

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
        <Touchable
          className="flex flex-grow-0 gap-8 pl-3 pr-1"
          color="game"
          border
        >
          <rs.Value placeholder={placeholder} />
          <rs.Icon>
            <ChevronDownIcon className="h-7 w-7" />
          </rs.Icon>
        </Touchable>
      </rs.Trigger>
      <rs.Portal className="z-10">
        <rs.Content>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <rs.Viewport className="relative flex flex-col rounded bg-gray-3 p-1">
              {options.map((opt) => (
                <rs.Item key={opt.value} value={opt.value} asChild>
                  <Touchable
                    align="start"
                    className="gap-8 rounded px-2  
                 data-[highlighted]:bg-gray-5"
                    color="default"
                  >
                    <rs.ItemText className="block w-full flex-grow py-2">
                      {opt.label}
                    </rs.ItemText>

                    <rs.ItemIndicator className="text-green-11">
                      <CheckIcon className="h-7 w-7" />
                    </rs.ItemIndicator>
                  </Touchable>
                </rs.Item>
              ))}
            </rs.Viewport>
          </motion.div>
        </rs.Content>
      </rs.Portal>
    </rs.Root>
  );
}
