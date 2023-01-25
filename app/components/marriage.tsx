import {
  CircleIcon,
  CropIcon,
  HeartFilledIcon,
  SquareIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import * as rtg from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { Pressable } from "./pressable";

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
        <Pressable aspect="square">
          <SquareIcon />
        </Pressable>
      </rtg.Item>
      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="center"
        aria-label="Center aligned"
      >
        <Pressable aspect="square">
          <CropIcon />
        </Pressable>
      </rtg.Item>

      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="right"
        aria-label="Right aligned"
      >
        <Pressable aspect="square">
          <CircleIcon />
        </Pressable>
      </rtg.Item>

      <rtg.Item
        asChild
        className="ToggleGroupItem"
        value="right"
        aria-label="Right aligned"
      >
        <Pressable aspect="square">
          <HeartFilledIcon />
        </Pressable>
      </rtg.Item>
    </rtg.Root>
  );
}
