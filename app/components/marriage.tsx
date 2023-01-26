import { GiSpades, GiHearts, GiClubs, GiDiamonds } from "react-icons/gi";
import { HeartIcon } from "@radix-ui/react-icons";

import * as rtg from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { Touchable } from "./pressable";

const rootClass = cva([
  "flex divide-x-2 divide-game-border-color  hover:border-game-border-hover-color border-game-border-color rounded border-2",
]);

const itemClass = cva([
  "data-[state=on]:bg-game-bg-active-color hover:border-game-border-hover-color",
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
      <rtg.Item asChild value="spades" aria-label="Left aligned">
        <Touchable color="game" aspect="square">
          <GiSpades className="h-5 w-5" />
        </Touchable>
      </rtg.Item>
      <rtg.Item asChild value="center" aria-label="Center aligned">
        <Touchable color="game" aspect="square">
          <GiClubs className="h-5 w-5" />
        </Touchable>
      </rtg.Item>

      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="diamonds"
        aria-label="Diamonds"
      >
        <Touchable
          isPressed={value.includes("diamonds")}
          color="game"
          aspect="square"
        >
          <GiDiamonds className="h-5 w-5" />
        </Touchable>
      </rtg.Item>

      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="right"
        aria-label="Right aligned"
      >
        <Touchable color="red" aspect="square">
          <HeartIcon className="h-6 w-6 text-red-9" />
        </Touchable>
      </rtg.Item>
    </rtg.Root>
  );
}
