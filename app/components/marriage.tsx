import type { ReactNode } from "react";

import * as rrg from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";
import { useCallback, useState, createContext, useContext } from "react";
import { Touchable } from "./touchable";
import { motion } from "framer-motion";

type MarriageContextType = {
  player: MarriageValue;
  opposition: MarriageValue;
  onChangePlayer: (v: MarriageValue) => void;
  onChangeOpposition: (v: MarriageValue) => void;
  playerEnabled: MarriageValue[];
  oppositionEnabled: MarriageValue[];
};
const MarriageContext = createContext<MarriageContextType>({
  player: "0",
  opposition: "0",
  onChangePlayer: (v: MarriageValue | undefined) => {},
  onChangeOpposition: (v: MarriageValue | undefined) => {},
  playerEnabled: [],
  oppositionEnabled: [],
});
function useMarriageContext(playedBy: string) {
  const ctx = useContext(MarriageContext);

  if (playedBy === "player") {
    return {
      value: ctx.player,
      onChange: ctx.onChangePlayer,
      enabled: ctx.playerEnabled,
    };
  }
  return {
    value: ctx.opposition,
    onChange: ctx.onChangeOpposition,
    enabled: ctx.oppositionEnabled,
  };
}

function getEnabledOptions(opposingMarriage: MarriageValue | undefined) {
  let enabled: MarriageValue[] = [];
  if (opposingMarriage) {
    let remaining = 100 - parseInt(opposingMarriage);
    let val = 0;
    while (val <= remaining) {
      enabled.push(`${val}` as MarriageValue);
      val = val + 20;
    }
  }

  return enabled;
}

export function MarriageProvider({
  children,
  initialValues,
}: {
  initialValues: {
    player: number;
    opposition: number;
  };
  children: ReactNode;
}) {
  const [player, setPlayer] = useState<MarriageValue>(
    `${initialValues.player}` as MarriageValue
  );

  const onChangePlayer = useCallback(
    (v: MarriageValue) => {
      setPlayer(v);
      setOppositionEnabled(getEnabledOptions(v));
    },
    [setPlayer]
  );

  const [opposition, setOpposition] = useState<MarriageValue>(
    `${initialValues.opposition}` as MarriageValue
  );
  const onChangeOpposition = useCallback(
    (v: MarriageValue) => {
      setOpposition(v);
      setPlayerEnabled(getEnabledOptions(v));
    },
    [setOpposition]
  );

  const [playerEnabled, setPlayerEnabled] = useState<MarriageValue[]>(
    getEnabledOptions(opposition)
  );
  const [oppositionEnabled, setOppositionEnabled] = useState<MarriageValue[]>(
    getEnabledOptions(player)
  );

  return (
    <MarriageContext.Provider
      value={{
        player,
        opposition,
        onChangeOpposition,
        onChangePlayer,
        playerEnabled,
        oppositionEnabled,
      }}
    >
      {children}
    </MarriageContext.Provider>
  );
}

const rootClass = cva([
  "flex divide-x divide-game-border-color  hover:border-game-border-hover-color border-game-border-color rounded border-2",
  "",
]);

export type MarriageValue = "0" | "20" | "40" | "60" | "80" | "100";
type Props = {
  name?: string;
  playedBy: string;
};
const marriageOptions: MarriageValue[] = ["20", "40", "60", "80", "100"];

export function Marriage({ name, playedBy }: Props) {
  const { value, onChange, enabled } = useMarriageContext(playedBy);

  return (
    <rrg.Root
      name={`marriage.${playedBy}`}
      className={rootClass()}
      value={value}
      onValueChange={(v) => {
        onChange(v as MarriageValue);
      }}
      aria-label={`marriage.${playedBy}`}
    >
      <rrg.Item value="0" className="hidden"></rrg.Item>
      {marriageOptions.map((v) => (
        <rrg.Item
          key={v}
          onClick={() => {
            if (v === value) {
              onChange("0");
            }
          }}
          asChild
          value={v}
          aria-label={v}
          disabled={!enabled.includes(v)}
        >
          <Touchable color="game" selected={v === value} aspect="11/12">
            <rrg.Indicator asChild>
              <motion.div
                layoutId={name}
                transition={{
                  ease: "easeOut",
                  duration: 0.3,
                }}
                style={{ height: 44 }}
                className="absolute top-0 left-0 z-10 w-full bg-game-bg-active-color"
              ></motion.div>
            </rrg.Indicator>

            <label className="relative z-10 block cursor-pointer">{v}</label>
          </Touchable>
        </rrg.Item>
      ))}
    </rrg.Root>
  );
}
