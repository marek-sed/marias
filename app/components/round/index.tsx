import type { Round } from "@prisma/client";
import type { VariantProps } from "class-variance-authority";
import { cx } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { GiTwoCoins } from "react-icons/gi";

import { translateGameType } from "~/utils/translations";
import { GameType } from "~/utils/types";

type Props = {
  round: Pick<Round, "playerId" | "number" | "cost" | "gameType">;
  gameOfHearts: boolean;
};
const iconClass = cva(["h-5 w-5"], {
  variants: {
    type: {
      won: "text-gold-11",
      loss: "text-gold-11",
    },
  },
});

const countClass = cva("flex items-center", {
  variants: {
    type: {
      won: "text-gold-11",
      loss: "text-gold-11",
    },
  },
});
type IconType = VariantProps<typeof iconClass>;

export function RoundResult({ round, gameOfHearts }: Props) {
  let type: IconType["type"] = "won";
  if (round.cost <= 0) {
    type = "loss";
  }

  return (
    <div className={countClass({ type })}>
      <span>{round.cost}</span>
      <div className="pl-1">
        <GiTwoCoins className={iconClass({ type })} />
      </div>
    </div>
  );
}

export function RoundHeader({ round, gameOfHearts }: Props) {
  return (
    <header className="flex justify-between bg-gray-4 py-3.5 px-4 text-lg font-medium group-hover:bg-gray-6">
      <div className="flex items-center">
        <h1 className="flex space-x-1">{round.number}.</h1>
      </div>
      <span className="capitalize text-gray-12">
        {translateGameType(round.gameType as GameType)}
      </span>
      <RoundResult round={round} gameOfHearts={gameOfHearts} />
    </header>
  );
}

type RoundBodyProps = Omit<Props, "gameOfHearts"> & {
  players: { id: string; name: string }[];
  costPerPlayer: Record<string, number>;
};
export function RoundBody({ round, players, costPerPlayer }: RoundBodyProps) {
  return (
    <div className="py-1.5">
      <table className="w-full table-fixed">
        <thead>
          <tr className="">
            {players.map((p) => (
              <th
                key={p.id}
                className={cx(
                  "py-1 px-2 text-center",
                  p.id === round.playerId ? "text-grass-11" : "text-gray-11"
                )}
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="">
            {Object.keys(costPerPlayer).map((pId) => (
              <td key={pId} className="text-center text-gray-11">
                {costPerPlayer[pId]}
              </td>
            ))}

            <td className="text-center text-gray-11">49</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
