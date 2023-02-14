import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { json } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { FAB } from "~/components/fab";
import { Card, Drag } from "~/components/game/Card";
import { GameChart } from "~/components/game/Chart";
import { GameResult } from "~/components/game/Result";
import { getGames } from "~/models/game.server";
import { useAnimatedLoaderData } from "~/utils";
import { humanFormat } from "~/utils/date";
import {
  calculateCostsPerRound,
  getGameResult,
  getGraphData,
} from "~/utils/game";

export const handle = {
  title: "Hry",
};

export const loader = async () => {
  const allGames = await getGames();
  const games = allGames.map((game) => {
    return {
      id: game.id,
      date: game.createdAt,
      players: game.players.map((p) => p.player),
      result: getGameResult(
        game.rounds,
        game.players.map((p) => p.player)
      ),
    };
  });

  return json({ games });
};

export default function Index() {
  const { games } = useAnimatedLoaderData<typeof loader>();
  const [firstGame, ...olderGames] = games;

  return (
    <div className="mx-auto flex max-w-screen-sm flex-col space-y-8">
      <Drag id={firstGame.id} onDragEnd={(id) => alert(id)}>
        <Link to={`games/${firstGame.id}`}>
          <Card>
            <Card.Header>
              {humanFormat(firstGame.date).toLocaleString()}
            </Card.Header>
            <Card.Body>
              <GameResult
                type="borderless"
                players={firstGame.players}
                result={firstGame.result}
              />
            </Card.Body>
            <Card.Footer>
              <Form method="delete">
                <button>
                  <TrashIcon className="h-7 w-7 text-red-9" />
                </button>
              </Form>
            </Card.Footer>
          </Card>
        </Link>
      </Drag>
      <FAB to="/games/new-table" className="self-end">
        <PlusIcon className="h-8 w-8" />
        <span>Nova Hra</span>
      </FAB>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {olderGames.map((game) => {
          return (
            <Card key={game.id}>
              <Card.Header>
                {humanFormat(game.date).toLocaleString()}
              </Card.Header>
              <Card.Body>
                <GameResult players={game.players} result={firstGame.result} />
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
