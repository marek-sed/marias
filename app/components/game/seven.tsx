import type { ReactNode } from "react";
import type { IndeterminateBool } from "~/utils/types";
import * as rc from "@radix-ui/react-checkbox";
import { useCallback, createContext, useContext, useState } from "react";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { Touchable } from "../touchable";
import { AnimatePresence, motion } from "framer-motion";

type SevenContextType = {
  playedBy: null | string;
  setPlayedBy: any;
};

const SevenContext = createContext<SevenContextType>({
  playedBy: null,
  setPlayedBy: () => {},
});

function useSevenContext() {
  return useContext(SevenContext);
}

export function SevenProvider({ children }: { children: ReactNode }) {
  const [playedBy, setPlayedBy] = useState<SevenContextType["playedBy"]>(null);

  return (
    <SevenContext.Provider value={{ playedBy, setPlayedBy }}>
      {children}
    </SevenContext.Provider>
  );
}

type Props<T = boolean> = {
  id?: string;
  name?: string;
  value?: T;
  defaultValue?: T;
  onChange?: (checked: T) => void;
  isDisabled?: boolean;
  playedBy?: string;
};

function SilentBox({
  id,
  name,
  value,
  defaultValue,
  onChange,
  isDisabled,
}: Omit<Props, "playedBy">) {
  return (
    <rc.Root
      id={id}
      name={name}
      checked={value}
      disabled={isDisabled}
      defaultChecked={defaultValue}
      onCheckedChange={onChange}
      asChild
    >
      <Touchable color="default" aspect="square">
        <rc.CheckboxIndicator forceMount>
          {value === true ? (
            <GiSpeaker className="h-8 w-8" />
          ) : (
            <GiSpeakerOff className="h-8 w-8" />
          )}
        </rc.CheckboxIndicator>
      </Touchable>
    </rc.Root>
  );
}

export function SevenBox({
  id,
  value,
  defaultValue,
  onChange,
  isDisabled,
  playedBy,
}: Props<IndeterminateBool>) {
  const ctx = useSevenContext();
  const [silent, setSilent] = useState<boolean>(false);
  const onCheckedChange = useCallback(
    (checked: boolean | "indeterminate") => {
      if (value === "indeterminate") {
        onChange?.(true);
        ctx.setPlayedBy(playedBy);
      } else if (value === false) {
        onChange?.("indeterminate");
        ctx.setPlayedBy(null);
      } else {
        onChange?.(false);
        ctx.setPlayedBy(playedBy);
      }
    },
    [value, onChange, playedBy, ctx]
  );
  const wasPlayedByTheOther =
    ctx.playedBy !== null && ctx.playedBy !== playedBy;

  return (
    <div className="flex space-x-2">
      <SilentBox
        name={`${playedBy}.silent`}
        value={silent}
        onChange={setSilent}
        isDisabled={value === "indeterminate"}
      />
      <rc.Root
        id={id}
        name={`${playedBy}.seven`}
        checked={value}
        disabled={isDisabled || wasPlayedByTheOther}
        defaultChecked={defaultValue}
        onCheckedChange={onCheckedChange}
        asChild
      >
        <Touchable border aspect="square" color="game">
          <rc.CheckboxIndicator forceMount>
            <AnimatePresence>
              {value === false ? (
                <motion.div
                  className="text-2xl font-medium"
                  initial={{ transform: "rotate(90deg)" }}
                  animate={{ transform: "rotate(-45deg)" }}
                  exit={{ transform: "rotate(-360deg)" }}
                  transition={{
                    bounce: 1,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.1 }}
                    exit={{ scale: 0, transition: { delay: 0.1 } }}
                  >
                    RIP
                  </motion.div>
                </motion.div>
              ) : value === true ? (
                <div className="scale-125 text-2xl font-medium">7</div>
              ) : null}
            </AnimatePresence>
          </rc.CheckboxIndicator>
        </Touchable>
      </rc.Root>
    </div>
  );
}
