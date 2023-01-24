import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { cva, VariantProps } from "class-variance-authority";
import { useCallback } from "react";
import { Button } from "./button";

const rootClass = cva("border-2 border-game-color h-10 rounded ", {
  variants: {
    type: {
      text: "",
      number: "flex h-10 items-center",
    },
  },
});

const inputClass = cva(
  ["text-lg", "bg-sage-3 text-sage-12", "h-9 border-none", "focus:ring-0"],
  {
    variants: {
      type: {
        number: "text-right w-13",
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
        <Button
          tabIndex={-1}
          type="button"
          onClick={decrement}
          color={color}
          aspect="square"
        >
          <MinusIcon className="h-6 w-6" />
        </Button>
      )}
      <input
        className={inputClass({ type: type })}
        {...{ type, min, max, step, value, onChange, defaultValue, ...props }}
      />
      {type === "number" && (
        <Button
          tabIndex={-1}
          type="button"
          onClick={increment}
          color={color}
          aspect="square"
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
