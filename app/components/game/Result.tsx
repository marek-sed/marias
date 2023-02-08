import type { Player } from "@prisma/client";

type Props = {
  players: Player[];
  result: Record<string, number> | undefined;
};
export function GameResult({ players, result }: Props) {
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
          {result ? (
            <tr className="divide-x-2 divide-gray-6">
              {Object.keys(result).map((pId) => (
                <td key={pId} className="pb-2 text-center">
                  {result[pId]}
                </td>
              ))}
              <td className="pb-2 text-center">49</td>
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
