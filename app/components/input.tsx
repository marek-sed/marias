import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { useCallback } from "react";

const rootClass = cva("border-2 rounded border-teal-7", {
  variants: {
    type: {
      text: "",
      number: "flex h-8 items-center",
    },
  },
});

const inputClass = cva(
  [
    "bg-sage-7 text-sage-12",
    "border-none boder-teal-9 border-2",
    "h-full",
    "focus:ring-0",
  ],
  {
    variants: {
      type: {
        number: "text-right w-13",
        text: "text-start",
      },
    },
  }
);

const numberButton = cva([
  "flex justify-center items-center",
  "bg-sage-7 text-teal-9",
  "h-full w-6",
  "active:bg-teal-10 active:text-sage-7",
]);

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
        <button
          tabIndex={-1}
          type="button"
          onClick={decrement}
          className={numberButton()}
        >
          <MinusIcon />
        </button>
      )}
      <input
        className={inputClass({ type: type })}
        {...{ type, min, max, step, value, onChange, defaultValue, ...props }}
      />
      {type === "number" && (
        <button
          tabIndex={-1}
          type="button"
          onClick={increment}
          className={numberButton()}
        >
          <PlusIcon />
        </button>
      )}
    </div>
  );
}
