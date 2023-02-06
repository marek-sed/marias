import type { Player } from "@prisma/client";

type Props = {
  players: Player[];
  costPerPlayer: Record<string, number>;
};
export function GameResult({ players, costPerPlayer }: Props) {
  return (
    <div className="rounded border-2 border-gray-6 bg-gray-2">
      <table className="w-full table-fixed">
        <thead>
          <tr className="divide-x-2 divide-gray-6">
            {players.map((p) => (
              <th key={p.id} className="py-2 px-4 font-bold text-gray-11">
                {p.name}
              </th>
            ))}

            <th className="py-2 px-4 font-bold text-gray-11">Mirka</th>
          </tr>
        </thead>
        <tbody>
          <tr className="divide-x-2 divide-gray-6">
            {Object.keys(costPerPlayer).map((pId) => (
              <td key={pId} className="pb-2 text-center">
                {costPerPlayer[pId]}
              </td>
            ))}
            <td className="pb-2 text-center">49</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
