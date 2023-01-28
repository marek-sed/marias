import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { useCallback } from "react";
import { Touchable } from "./touchable";

const rootClass = cva(
  "border-2 border-game-border-color hover:border-game-border-hover-color  rounded ",
  {
    variants: {
      type: {
        text: "",
        number: "flex items-center",
      },
    },
  }
);

const inputClass = cva(
  ["text-lg", "bg-game-bg-color text-green-12", "border-none", "focus:ring-0"],
  {
    variants: {
      type: {
        number: "w-11 px-0 text-center",
        text: "text-start",
      },
    },
  }
);

type Props = {
  id?: string;
  name?: string;
  type: "number" | "text";
  color?: "game" | "accent" | "default";
  step?: number;
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
};

export function Input({
  type,
  onChange: onNumericChange,
  value,
  defaultValue,
  color,
  min = 0,
  max = 190,
  step = 10,
  ...props
}: Props) {
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const number = parseInt(evt.target.value, 10);
      onNumericChange?.(number);
    },
    [onNumericChange]
  );

  const decrement = useCallback(() => {
    const v = value ?? defaultValue ?? 0;
    onNumericChange?.(Math.max(v - step, min));
  }, [value, onNumericChange, defaultValue, step, min]);

  const increment = useCallback(() => {
    const v = value ?? defaultValue ?? 0;
    onNumericChange?.(Math.min(v + step, max));
  }, [value, onNumericChange, defaultValue, step, max]);

  return (
    <div className={rootClass({ type })}>
      {type === "number" && (
        <Touchable
          color="game"
          tabIndex={-1}
          onClick={decrement}
          aspect="square"
        >
          <MinusIcon className="h-8 w-8" />
        </Touchable>
      )}
      <input
        className={inputClass({ type: type })}
        {...{ type, min, max, step, value, onChange, defaultValue, ...props }}
      />
      {type === "number" && (
        <Touchable
          color="game"
          tabIndex={-1}
          onClick={increment}
          aspect="square"
        >
          <PlusIcon className="h-8 w-8" />
        </Touchable>
      )}
    </div>
  );
}
