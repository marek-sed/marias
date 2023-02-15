import type { ReactNode } from "react";
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

import * as rtg from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";
import { useState, createContext, useContext } from "react";
import { Touchable } from "./touchable";

type MarriageSymbolsContextType = {
  player: MarriageSymbol[];
  opposition: MarriageSymbol[];
  setPlayer: (value: MarriageSymbol[]) => void;
  setOpposition: (value: MarriageSymbol[]) => void;
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
export function MarriageSymbols({ playedBy }: Props) {
  const { value, setValue, disabled } = useMarriageContext(playedBy);

  return (
    <rtg.Root
      className={rootClass()}
      type="multiple"
      value={value}
      onValueChange={(value) => {
        setValue(value as MarriageSymbol[]);
      }}
      aria-label="Text alignment"
    >
      <input type="hidden" name="marriage" value={value} />
      <rtg.Item
        asChild
        value="spade"
        disabled={disabled.includes("spade")}
        aria-label="spade"
      >
        <Touchable color="game" aspect="square">
          {!value?.includes("spade") ? (
            <BsSuitSpade className="h-6 w-6" />
          ) : (
            <BsSuitSpadeFill className="h-6 w-6" />
          )}
        </Touchable>
      </rtg.Item>
      <rtg.Item
        asChild
        value="club"
        disabled={disabled.includes("club")}
        aria-label="club"
      >
        <Touchable color="game" aspect="square">
          {!value?.includes("club") ? (
            <BsSuitClub className="h-6 w-6" />
          ) : (
            <BsSuitClubFill className="h-6 w-6" />
          )}
        </Touchable>
      </rtg.Item>

      <rtg.Item
        asChild
        disabled={disabled.includes("diamond")}
        className="ToggleGroupItem"
        value="diamond"
        aria-label="diamond"
      >
        <Touchable color="game" aspect="square">
          {!value?.includes("diamond") ? (
            <BsSuitDiamond className="h-6 w-6" />
          ) : (
            <BsSuitDiamondFill className="h-6 w-6" />
          )}
        </Touchable>
      </rtg.Item>

      <rtg.Item
        asChild
        disabled={disabled.includes("heart")}
        className="ToggleGroupItem"
        value="heart"
        aria-label="heart"
      >
        <Touchable color="red" aspect="square">
          {!value?.includes("heart") ? (
            <BsHeart className="h-6 w-6" />
          ) : (
            <BsHeartFill className="h-6 w-6" />
          )}
        </Touchable>
      </rtg.Item>
    </rtg.Root>
  );
}
