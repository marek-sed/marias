import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPlayersAtTable } from "~/models/player.server";
import { getRoundsForGame } from "~/models/round.server";
import { calculateCosts } from "~/utils/utils.server";
import { RoundBody, RoundHeader } from "~/components/round";
import { GameResult } from "~/components/game/result";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.gameId, "game id not found");

  const { gameId } = params;

  const rounds = await getRoundsForGame(gameId);
  const players = await (await getPlayersAtTable(gameId)).map((p) => p.player);

  const costPerPlayer = calculateCosts(rounds, players);

  return json({ rounds, players, costPerPlayer });
};

export default function Rounds() {
  const { rounds, players, costPerPlayer } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-screen-sm space-y-8">
      <div className="space-y-2">
        <h1>Skore:</h1>
        <GameResult {...{ players, costPerPlayer }} />
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {rounds.map((round) => (
          <li key={round.number}>
            <Link to={`${round.number}`}>
              <article className="group space-y-2 rounded border-2 border-gray-6 bg-gray-2 pb-2">
                <RoundHeader
                  round={round}
                  gameOfHearts={
                    !!round.ColorGameResult?.gameOfHearts ||
                    !!round.HundredGameResult?.gameOfHearts
                  }
                />
                <RoundBody {...{ round, players, costPerPlayer }} />
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
