import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { useCallback } from "react";

const inputClass = cva(
  ["bg-sage-7 text-sage-12", "border-none", "focus:ring-0", "h-8 w-16", ""],
  {
    variants: {
      type: {
        number: "text-right",
        text: "",
      },
    },
  }
);

const numberButton = cva(
  ["flex justify-center items-center", "bg-sage-7 text-teal-9", "h-full w-6"],
  {
    variants: {
      position: {
        left: "rounded-l",
        right: "rounded-r",
      },
    },
  }
);

type Props = {
  id?: string;
  name?: string;
  type: "number" | "text";
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
    const v = value ?? defaultValue;
    onNumericChange?.(Math.max(v - step, min));
  }, [value, onNumericChange, defaultValue, step, min]);

  const increment = useCallback(() => {
    const v = value ?? defaultValue;
    onNumericChange?.(Math.min(v + step, max));
  }, [value, onNumericChange, defaultValue, step, max]);

  return (
    <div className="flex h-8 items-center">
      <button
        type="button"
        onClick={decrement}
        className={numberButton({ position: "left" })}
      >
        <MinusIcon />
      </button>
      <input
        className={inputClass({ type: type })}
        {...{ type, min, max, step, value, onChange, defaultValue, ...props }}
      />
      <button
        type="button"
        onClick={increment}
        className={numberButton({ position: "right" })}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
