import { PlusIcon, TrashIcon, CheckIcon } from "@radix-ui/react-icons";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useSubmit, Link } from "@remix-run/react";
import { useCallback } from "react";
import { FAB } from "~/components/fab";
import { Card, Drag } from "~/components/game/Card";
import { GameResult } from "~/components/game/Result";
import { deleteGame, finishGame, getGames } from "~/models/game.server";
import { useAnimatedLoaderData } from "~/utils";
import { humanFormat } from "~/utils/date";
import { getGameResult } from "~/utils/game";

export const handle = {
  title: "Hry",
};

export const loader = async () => {
  const allGames = await getGames();
  let games = allGames.map((game) => {
    return {
      id: game.id,
      isActive: game.isActive,
      date: game.createdAt,
      players: game.players.map((p) => p.player),
      result: getGameResult(
        game.rounds,
        game.players.map((p) => p.player)
      ),
    };
  });

  const activeGame = games.find((game) => game.isActive);
  games = games.filter((game) => !game.isActive);

  return json({ activeGame, games });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = formData.get("id") as string;

  switch (intent) {
    case "delete": {
      await deleteGame(id);
      break;
    }
    case "finish": {
      await finishGame(id);
    }
  }

  return json({ ok: true });
};

export default function Index() {
  const { activeGame, games } = useAnimatedLoaderData<typeof loader>();
  const submit = useSubmit();
  const onDragEnd = useCallback(
    (id: string | number) => {
      const data = new FormData();
      data.append("id", `${id}`);
      submit(data, { method: "post", replace: true });
    },
    [submit]
  );

  return (
    <div className="relative mx-auto flex max-w-screen-sm flex-col space-y-8">
      {activeGame ? (
        <Drag id={activeGame.id} onDragEnd={onDragEnd} BG={Drag.BgFinish}>
          <Drag.BgFinish />
          <Link to={`games/${activeGame.id}`}>
            <Card>
              <Card.Header>
                {humanFormat(activeGame.date).toLocaleString()}
              </Card.Header>
              <Card.Body>
                <GameResult
                  type="borderless"
                  players={activeGame.players}
                  result={activeGame.result}
                />
              </Card.Body>
              <Card.Action id={activeGame.id} variant="finish">
                <CheckIcon className="h-6 w-6" />
              </Card.Action>
            </Card>
          </Link>
        </Drag>
      ) : (
        <p className="">Nemate ziadne aktivnu hru</p>
      )}
      {!activeGame && (
        <FAB to="/games/new-table" className="self-end">
          <PlusIcon className="h-8 w-8" />
          <span>Nova Hra</span>
        </FAB>
      )}
      <div className="absolute top-48 space-y-1 text-lg">
        <h2>Starsie hry</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {games.map((game) => {
            return (
              <Drag
                key={game.id}
                id={game.id}
                onDragEnd={onDragEnd}
                BG={Drag.BgDelete}
              >
                <Link to={`games/${game.id}`}>
                  <Card>
                    <Card.Header>{humanFormat(game.date)}</Card.Header>
                    <Card.Body>
                      <GameResult
                        type="borderless"
                        players={game.players}
                        result={game.result}
                      />
                    </Card.Body>
                    <Card.Action id={game.id} variant="delete">
                      <TrashIcon className="h-6 w-6" />
                    </Card.Action>
                  </Card>
                </Link>
              </Drag>
            );
          })}
        </div>
      </div>
    </div>
  );
}
