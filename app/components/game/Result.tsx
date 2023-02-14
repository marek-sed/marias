import type { Player } from "@prisma/client";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const rootClass = cva("rounded", {
  variants: {
    type: {
      borderless: "",
      border: "rounded border-2 border-gray-6 bg-gray-2",
    },
  },
  defaultVariants: {
    type: "border",
  },
});
const trClass = cva("", {
  variants: {
    type: {
      borderless: "",
      border: "divide-x-2 divide-gray-6",
    },
  },
  defaultVariants: {
    type: "border",
  },
});
type Variants = VariantProps<typeof rootClass>;
type Props = Variants & {
  players: Player[];
  result: Record<string, number> | undefined;
};
export function GameResult({ players, result, type }: Props) {
  return (
    <div className={rootClass({ type })}>
      <table className="w-full table-fixed">
        <thead>
          <tr className={trClass({ type })}>
            {players.map((p) => (
              <th key={p.id} className="py-2 px-0 font-bold text-gray-11">
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result ? (
            <tr className={trClass({ type })}>
              {Object.keys(result).map((pId) => (
                <td key={pId} className="pb-2 text-center">
                  {result[pId]}
                </td>
              ))}
            </tr>
          ) : (
            <tr>
              {players.map((p) => (
                <td key={p.id}>0</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
