import { PlusIcon } from "@radix-ui/react-icons";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { useAnimatedLoaderData } from "~/utils";

export const handle = {
  title: "Hry",
};

export const loader = async () => {
  const games = await getGames();

  return json({ games });
};

export default function Index() {
  const { games } = useAnimatedLoaderData<typeof loader>();
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 py-5 sm:grid-cols-2">
        {games.map((game) => {
          return (
            <article
              className="cursor-pointer rounded border border-gray-7 px-4 py-2 transition ease-in-out hover:scale-105 hover:border-2 hover:border-grass-9"
              key={game.id}
            >
              <Link to={`games/${game.id}`}>
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
      <div className="fixed bottom-8 right-6">
        <Link
          className="block  rounded-full bg-grass-9 p-2.5 text-gray-12"
          to="/games/new-table"
        >
          <PlusIcon className="h-7 w-7" />
        </Link>
      </div>
    </div>
  );
}
