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
import { useState } from "react";
import { Touchable } from "./pressable";

const rootClass = cva([
  "flex divide-x-2 divide-game-border-color  hover:border-game-border-hover-color border-game-border-color rounded border-2",
]);

export function Marriage() {
  const [value, setValue] = useState(["spades"]);
  return (
    <rtg.Root
      className={rootClass()}
      type="multiple"
      value={value}
      onValueChange={(value) => {
        if (value) setValue(value);
      }}
      aria-label="Text alignment"
    >
      <rtg.Item asChild value="spade" aria-label="spade">
        <Touchable color="game" aspect="square">
          {!value.includes("spade") ? (
            <BsSuitSpade className="h-6 w-6" />
          ) : (
            <BsSuitSpadeFill className="h-6 w-6" />
          )}
        </Touchable>
      </rtg.Item>
      <rtg.Item asChild value="club" aria-label="club">
        <Touchable color="game" aspect="square">
          {!value.includes("club") ? (
            <BsSuitClub className="h-6 w-6" />
          ) : (
            <BsSuitClubFill className="h-6 w-6" />
          )}
        </Touchable>
      </rtg.Item>

      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="diamond"
        aria-label="diamond"
      >
        <Touchable color="game" aspect="square">
          {!value.includes("diamond") ? (
            <BsSuitDiamond className="h-6 w-6" />
          ) : (
            <BsSuitDiamondFill className="h-6 w-6" />
          )}
        </Touchable>
      </rtg.Item>

      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="heart"
        aria-label="heart"
      >
        <Touchable color="red" aspect="square">
          {!value.includes("heart") ? (
            <BsHeart className="h-6 w-6" />
          ) : (
            <BsHeartFill className="h-6 w-6" />
          )}
        </Touchable>
      </rtg.Item>
    </rtg.Root>
  );
}
