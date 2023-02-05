import { ArrowLeftIcon, PlusIcon } from "@radix-ui/react-icons";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { createGame, getActiveGame, getGames } from "~/models/game.server";
import { getPlayers } from "~/models/settings.server";

export const handle = {
  title: "Hry",
  action: <NewTable />,
};

export const loader = async () => {
  const games = await getGames();
  const activeGame = await getActiveGame();

  return json({ games, activeGame });
};

function NewTable() {
  const { activeGame } = useLoaderData<typeof loader>();
  if (activeGame) {
    return <span>nope</span>;
  }
  return (
    <Link className="rounded bg-grass-9 p-2 text-gray-12" to="/games/new-table">
      <PlusIcon />
    </Link>
  );
}

export default function GamesIndex() {
  const { games } = useLoaderData<typeof loader>();
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-6 py-5 sm:grid-cols-2">
        {games.map((game) => {
          return (
            <article
              className="cursor-pointer rounded border border-gray-7 px-4 py-2 transition ease-in-out hover:scale-105 hover:border-2 hover:border-grass-9"
              key={game.id}
            >
              <Link to={game.id}>
                <header className="text-xl font-bold">
                  {new Date(game.createdAt).toLocaleString()}
                </header>
                <div>
                  {game.players.map(({ player }) => (
                    <div
                      key={player.id}
                      className="grid-row-1 grid w-full grid-cols-2 sm:w-1/2"
                    >
                      <span>{player.name}:</span>
                    </div>
                  ))}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
