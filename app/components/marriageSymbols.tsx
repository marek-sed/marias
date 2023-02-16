import type { ReactNode, SetStateAction, Dispatch } from "react";
import { useCallback } from "react";
import type { IconType } from "react-icons";
import type { MarriageSymbol } from "~/models/round.server";
import {
  BsHeart,
  BsHeartFill,
  BsSuitClub,
  BsSuitClubFill,
  BsSuitDiamond,
  BsSuitDiamondFill,
  BsSuitSpade,
  BsSuitSpadeFill,
} from "react-icons/bs";

import * as rc from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";
import { useState, createContext, useContext } from "react";
import { Touchable } from "./touchable";

type MarriageSymbolsContextType = {
  player: MarriageSymbol[];
  opposition: MarriageSymbol[];
  setPlayer: Dispatch<SetStateAction<MarriageSymbol[]>>;
  setOpposition: Dispatch<SetStateAction<MarriageSymbol[]>>;
};
const MarriageSymbolContext = createContext<MarriageSymbolsContextType>({
  player: [],
  opposition: [],
  setPlayer: () => {},
  setOpposition: () => {},
});
function useMarriageContext(playedBy: "player" | "opposition") {
  const ctx = useContext(MarriageSymbolContext);

  console.log(ctx);
  if (playedBy === "opposition") {
    return {
      value: ctx.opposition,
      setValue: ctx.setOpposition,
      disabled: ctx.player,
    };
  }

  return {
    value: ctx.player,
    setValue: ctx.setPlayer,
    disabled: ctx.opposition,
  };
}

export function MarriageSymbolsProvider({
  children,
  initialValues,
}: {
  children: ReactNode;
  initialValues: {
    player: MarriageSymbol[];
    opposition: MarriageSymbol[];
  };
}) {
  const [player, setPlayer] = useState(initialValues.player);
  const [opposition, setOpposition] = useState(initialValues.opposition);
  return (
    <MarriageSymbolContext.Provider
      value={{
        player,
        opposition,
        setOpposition,
        setPlayer,
      }}
    >
      {children}
    </MarriageSymbolContext.Provider>
  );
}

const rootClass = cva([
  "flex divide-x-2 divide-game-border-color hover:border-game-border-hover-color border-game-border-color rounded border-2",
]);

type Props = {
  playedBy: "player" | "opposition";
};
const symbols: MarriageSymbol[] = ["spade", "club", "diamond", "heart"];
const icons: Record<MarriageSymbol, [IconType, IconType]> = {
  spade: [BsSuitSpade, BsSuitSpadeFill],
  club: [BsSuitClub, BsSuitClubFill],
  diamond: [BsSuitDiamond, BsSuitDiamondFill],
  heart: [BsHeart, BsHeartFill],
};

export function MarriageSymbols({ playedBy }: Props) {
  const { value, setValue, disabled } = useMarriageContext(playedBy);
  const onCheckedChange = useCallback(
    (checked: rc.CheckedState, symbol: MarriageSymbol) => {
      console.log("checked change", checked, symbol);
      if (checked) {
        setValue((s) => [...s, symbol]);
      } else {
        setValue((s) => s.filter((v) => v !== symbol));
      }
    },
    [setValue]
  );

  return (
    <div className={rootClass()}>
      {symbols.map((symbol) => {
        const [UnChecked, Checked] = icons[symbol];
        return (
          <rc.Root
            key={symbol}
            onCheckedChange={(checked) => {
              onCheckedChange(checked, symbol);
            }}
            name={`marriage.${playedBy}`}
            asChild
            defaultChecked={value.includes(symbol)}
            value={symbol}
            disabled={disabled.includes(symbol)}
            aria-label={symbol}
          >
            <Touchable
              color={symbol === "heart" ? "red" : "game"}
              aspect="square"
            >
              <rc.CheckboxIndicator forceMount>
                {!value?.includes(symbol) ? (
                  <UnChecked className="h-6 w-6" />
                ) : (
                  <Checked className="h-6 w-6" />
                )}
              </rc.CheckboxIndicator>
            </Touchable>
          </rc.Root>
        );
      })}
    </div>
  );
}
