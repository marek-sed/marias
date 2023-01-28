import { ReactNode, useCallback } from "react";
import type { MarriageType } from "~/utils/types";
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

type MarriageContextType = {
  actor: MarriageType[];
  opposition: MarriageType[];
  setActor: (v: MarriageType[]) => void;
  setOpposition: (v: MarriageType[]) => void;
};
const MarriageContext = createContext<MarriageContextType>({
  actor: [],
  opposition: [],
  setActor: (v: MarriageType[]) => {},
  setOpposition: (v: MarriageType[]) => {},
});
function useMarriageContext() {
  return useContext(MarriageContext);
}

export function MarriageProvider({ children }: { children: ReactNode }) {
  const [actor, setActor] = useState<MarriageType[]>([]);
  const [opposition, setOpposition] = useState<MarriageType[]>([]);

  return (
    <MarriageContext.Provider
      value={{ actor, opposition, setActor, setOpposition }}
    >
      {children}
    </MarriageContext.Provider>
  );
}

const rootClass = cva([
  "flex divide-x-2 divide-game-border-color  hover:border-game-border-hover-color border-game-border-color rounded border-2",
]);

type Props = {
  value?: MarriageType[];
  onChange?: (v: MarriageType[]) => void;
  playedBy: string;
};
export function Marriage({ value, onChange, playedBy }: Props) {
  const { actor, opposition, setActor, setOpposition } = useMarriageContext();
  const disabled = playedBy === "actor" ? opposition : actor;
  const setDisabled = useCallback(
    (value: MarriageType[]) => {
      if (playedBy === "actor") {
        setActor(value);
      } else {
        setOpposition(value);
      }
    },
    [playedBy, setActor, setOpposition]
  );

  return (
    <rtg.Root
      className={rootClass()}
      type="multiple"
      value={value}
      onValueChange={(value) => {
        if (value) {
          onChange?.(value as MarriageType[]);
          setDisabled(value as MarriageType[]);
        }
      }}
      aria-label="Text alignment"
    >
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
