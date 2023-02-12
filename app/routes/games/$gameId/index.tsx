import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";

import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPlayersAtTable } from "~/models/player.server";
import { getRoundsForGame } from "~/models/round.server";
import { calculateCostsPerRound } from "~/utils/game";
import { RoundBody, RoundHeader } from "~/components/round";
import { GameResult } from "~/components/game/Result";
import { GameChart } from "~/components/game/Chart";

import frapeCss from "~/styles/frappe.css";
import { useIsPresent } from "framer-motion";
import { useAnimatedLoaderData } from "~/utils";

export const handle = {
  title: "Hra",
  parent: ".",
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: frapeCss,
    },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.gameId, "game id not found");

  const { gameId } = params;

  const rounds = await getRoundsForGame(gameId);
  const players = await (await getPlayersAtTable(gameId)).map((p) => p.player);

  const costsPerRound = calculateCostsPerRound(rounds, players);

  return json({ rounds, players, costsPerRound });
};

export default function Rounds() {
  const data = useAnimatedLoaderData<typeof loader>();

  const { rounds, players, costsPerRound } = data;
  const result = costsPerRound.length
    ? costsPerRound[costsPerRound.length - 1]
    : undefined;

  return (
    <div className="relative mx-auto max-w-screen-sm space-y-8">
      <GameResult {...{ players, result }} />
      <GameChart {...{ players, rounds }} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {rounds.map((round, i) => (
          <li key={round.number}>
            <Link to={`${round.number}`}>
              <article className="group space-y-2 rounded border-2 border-gray-6 bg-gray-2 pb-2">
                <RoundHeader
                  round={round}
                  gameOfHearts={
                    !!round.colorGameResult?.gameOfHearts ||
                    !!round.hundredGameResult?.gameOfHearts
                  }
                />
                <RoundBody
                  {...{ round, players, costPerPlayer: costsPerRound[i] }}
                />
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
  formMethod,
  defaultShouldRevalidate,
}) => {
  if (currentParams.gameId === nextParams.gameId) {
    return false;
  }

  return defaultShouldRevalidate;
};
