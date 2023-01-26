import {
  CircleIcon,
  CropIcon,
  HeartFilledIcon,
  SquareIcon,
} from "@radix-ui/react-icons";
import * as rtg from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { Touchable } from "./pressable";

const rootClass = cva([
  "flex divide-x-2 divide-game-border-color  border-game-border-color rounded border-2",
]);

const itemClass = cva(["data-[state=on]:bg-game-bg-active-color"]);

export function Marriage() {
  const [value, setValue] = useState(["left"]);
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
      <rtg.Item
        asChild
        className={itemClass()}
        value="left"
        aria-label="Left aligned"
      >
        <Touchable color="game" aspect="square">
          <SquareIcon />
        </Touchable>
      </rtg.Item>
      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="center"
        aria-label="Center aligned"
      >
        <Touchable color="game" aspect="square">
          <CropIcon />
        </Touchable>
      </rtg.Item>

      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="right"
        aria-label="Right aligned"
      >
        <Touchable aspect="square">
          <CircleIcon />
        </Touchable>
      </rtg.Item>

      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="right"
        aria-label="Right aligned"
      >
        <Touchable aspect="square">
          <HeartFilledIcon />
        </Touchable>
      </rtg.Item>
    </rtg.Root>
  );
}
