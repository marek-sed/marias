import type { ReactNode } from "react";
import type { Field, IndeterminateBool } from "~/utils/types";
import * as rc from "@radix-ui/react-checkbox";
import { useCallback, createContext, useContext, useState } from "react";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { Touchable } from "../touchable";
import { AnimatePresence, motion } from "framer-motion";
import { FormControl } from "../formControl";
import { Input } from "../input";

type SevenContextType = {
  seven: Field<boolean>;
  oppositionSeven: Field<boolean>;
  silent: Field<boolean>;
  oppositionSilent: Field<boolean>;
};

const SevenContext = createContext<SevenContextType>({
  seven: {
    value: false,
    onChange: () => {},
  },
  oppositionSeven: {
    value: false,
    onChange: () => {},
  },
  silent: {
    value: true,
    onChange: () => {},
  },
  oppositionSilent: {
    value: true,
    onChange: () => {},
  },
});

export function SevenProvider({ children }: { children: ReactNode }) {
  const [seven, setSeven] = useState<boolean>(false);
  const [oppositionSeven, setOppositionSeven] = useState<boolean>(false);
  const [silent, setSilent] = useState<boolean>(true);
  const [oppositionSilent, setOppositionSilent] = useState<boolean>(true);

  return (
    <SevenContext.Provider
      value={{
        seven: {
          value: seven,
          onChange: setSeven,
        },
        oppositionSeven: {
          value: oppositionSeven,
          onChange: setOppositionSeven,
        },
        silent: {
          value: silent,
          onChange: setSilent,
        },
        oppositionSilent: {
          value: oppositionSilent,
          onChange: setOppositionSilent,
        },
      }}
    >
      {children}
    </SevenContext.Provider>
  );
}

function useSevenContext(playedBy: string | undefined) {
  const ctx = useContext(SevenContext);

  if (playedBy === "opposition") {
    return {
      ...ctx.oppositionSeven,
      silent: ctx.oppositionSilent,
      disabled: ctx.seven.value,
    };
  }

  return {
    value: ctx.seven.value,
    onChange: ctx.seven.onChange,
    silent: ctx.silent,
    disabled: ctx.oppositionSeven.value,
  };
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
      value="silent"
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
  isDisabled,
  playedBy,
}: Props<IndeterminateBool>) {
  const [value, setValue] = useState<"won" | "loss" | "not-played">(
    "not-played"
  );
  const ctx = useSevenContext(playedBy);
  const onCheckedChange = useCallback(
    (checked: boolean) => {
      if (value === "won") {
        ctx.onChange(true);
        setValue("loss");
      } else if (value === "loss") {
        ctx.onChange?.(false);
        ctx.silent.onChange(true);
        setValue("not-played");
      } else {
        ctx.onChange?.(checked);
        setValue("won");
      }
    },
    [ctx, value]
  );

  return (
    <div className="flex space-x-2">
      <SilentBox
        name={`seven.${playedBy}`}
        value={ctx.silent.value}
        onChange={ctx.silent.onChange}
        isDisabled={!ctx.value}
      />
      <rc.Root
        id={id}
        name={`seven.${playedBy}`}
        checked={ctx.value}
        value={value}
        disabled={isDisabled}
        onCheckedChange={onCheckedChange}
        asChild
      >
        <Touchable border aspect="square" color="game">
          <rc.CheckboxIndicator forceMount>
            <AnimatePresence initial={false}>
              {value === "loss" ? (
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
              ) : value === "won" ? (
                <div className="scale-125 text-2xl font-medium">7</div>
              ) : null}
            </AnimatePresence>
          </rc.CheckboxIndicator>
        </Touchable>
      </rc.Root>
    </div>
  );
}

export function parseSevenFormData(form: FormData) {
  const seven = form.getAll("seven.player");
  const oppositionSeven = form.getAll("seven.opposition");

  const sevenRole = seven.length
    ? "player"
    : oppositionSeven.length
    ? "opposition"
    : null;

  if (sevenRole === "player") {
    const silent = seven.includes("silent");
    const won = seven.includes("won");
    const flekCount = silent ? 0 : parseInt(seven[1] as string, 10);
    return {
      silent,
      won,
      role: sevenRole,
      flekCount,
    };
  } else if (sevenRole === "opposition") {
    const silent = oppositionSeven.includes("silent");
    const won = oppositionSeven.includes("won");
    const flekCount = silent ? 0 : parseInt(oppositionSeven[1] as string, 10);
    return {
      silent,
      won,
      role: sevenRole,
      flekCount,
    };
  }

  return undefined;
}

export function Seven({ playedBy }: { playedBy: string }) {
  const ctx = useSevenContext(playedBy);
  const [flek, setFlek] = useState<number>(0);

  return (
    <motion.div className="w-full" layout>
      <motion.div layout className="flex w-full items-center justify-between">
        <span className="text-gray-11">Sedma</span>
        <SevenBox isDisabled={ctx.disabled} playedBy={playedBy} />
      </motion.div>
      <AnimatePresence>
        {!ctx.disabled && ctx.silent.value === false && (
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
              name={`seven.${playedBy}`}
              value={flek}
              onChange={setFlek}
            >
              <Input type="number" step={1} min={0} max={9} />
            </FormControl>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
