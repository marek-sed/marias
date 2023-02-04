import type { ReactNode } from "react";
import type { Field, IndeterminateBool } from "~/utils/types";
import * as rc from "@radix-ui/react-checkbox";
import { useCallback, createContext, useContext, useState } from "react";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { Touchable } from "../touchable";
import { AnimatePresence, motion } from "framer-motion";
import { FormControl, Label } from "../formControl";
import { Input } from "../input";

type SevenContextType = {
  playedBy: null | string;
  setPlayedBy: any;
  silent: boolean;
  setSilent: (v: boolean) => void;
};

const SevenContext = createContext<SevenContextType>({
  playedBy: null,
  setPlayedBy: () => {},
  silent: true,
  setSilent: (v: boolean) => {},
});

function useSevenContext() {
  return useContext(SevenContext);
}

export function SevenProvider({ children }: { children: ReactNode }) {
  const [playedBy, setPlayedBy] = useState<SevenContextType["playedBy"]>(null);
  const [silent, setSilent] = useState<boolean>(true);

  return (
    <SevenContext.Provider value={{ playedBy, setPlayedBy, silent, setSilent }}>
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
            <GiSpeakerOff className="h-8 w-8 text-gray-11" />
          ) : (
            <GiSpeaker className=" h-8 w-8" />
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
  const onCheckedChange = useCallback(
    (checked: boolean | "indeterminate") => {
      if (value === "indeterminate") {
        onChange?.(true);
        ctx.setSilent(true);
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
        name={`seven.${playedBy}.silent`}
        value={ctx.silent}
        onChange={ctx.setSilent}
        isDisabled={value === "indeterminate"}
      />
      <rc.Root
        id={id}
        name={`seven.${playedBy}.won`}
        checked={value}
        disabled={isDisabled || wasPlayedByTheOther}
        defaultChecked={defaultValue}
        onCheckedChange={onCheckedChange}
        asChild
      >
        <Touchable border aspect="square" color="game">
          <rc.CheckboxIndicator forceMount>
            <AnimatePresence initial={false}>
              {value === false ? (
                <motion.div
                  className="text-2xl font-medium"
                  initial={{ transform: "rotate(90deg)" }}
                  animate={{ transform: "rotate(-45deg)" }}
                  exit={{ transform: "rotate(-360deg)" }}
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

export function Seven({
  seven,
  playedBy,
  disabled = false,
}: {
  seven: Field<IndeterminateBool> | undefined;
  playedBy: string;
  disabled?: boolean;
}) {
  const ctx = useSevenContext();

  const wasPlayedByTheOther =
    ctx.playedBy !== null && ctx.playedBy !== playedBy;
  return (
    <motion.div className="w-full" layout>
      <motion.div layout className="flex w-full items-center justify-between">
        <span className="text-gray-11">Sedma</span>
        <SevenBox
          isDisabled={wasPlayedByTheOther}
          playedBy={playedBy}
          {...seven}
        />
      </motion.div>
      <AnimatePresence>
        {!wasPlayedByTheOther && ctx.silent === false && (
          <motion.div
            className="w-full"
            transition={{ duration: 0.15 }}
            initial={{ opacity: 0, paddingTop: 0, y: -30, height: 0 }}
            animate={{ opacity: 1, y: 0, paddingTop: 4, height: "auto" }}
            exit={{
              paddingTop: 0,
              opacity: 0,
              height: 0,
              y: -20,
              transition: { duration: 0.2 },
            }}
          >
            <FormControl
              label="Flek"
              name={`seven.${playedBy}.flekCount`}
              value={0}
            >
              <Input type="number" />
            </FormControl>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
