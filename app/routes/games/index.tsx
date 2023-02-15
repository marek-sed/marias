import { PlusIcon, CheckIcon } from "@radix-ui/react-icons";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useSubmit, Link } from "@remix-run/react";
import { useCallback } from "react";
import { FAB } from "~/components/fab";
import { Card, Drag } from "~/components/game/Card";
import { GameResult } from "~/components/game/Result";
import { deleteGame, finishGame, getActiveGames } from "~/models/game.server";
import { useAnimatedLoaderData } from "~/utils";
import { humanFormat } from "~/utils/date";
import { getGameResult, getGraphData } from "~/utils/game";

export const handle = {
  title: "Hry",
};

export const loader = async () => {
  const allGames = await getActiveGames();
  let games = allGames.map((game) => {
    return {
      id: game.id,
      isActive: game.isActive,
      date: game.createdAt,
      players: game.players.map((p) => p.player),
      numberOfRounds: game.rounds.length,
      result: getGameResult(
        game.rounds,
        game.players.map((p) => p.player)
      ),
      graph: getGraphData(
        game.rounds,
        game.players.map((p) => p.player)
      ),
    };
  });

  const activeGame = games.find((game) => game.isActive);
  games = games.filter((game) => !game.isActive);

  return json({ activeGame });
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

export default function GamesIndex() {
  const { activeGame } = useAnimatedLoaderData<typeof loader>();
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
        <div className="space-y-2">
          <Drag id={activeGame.id} onDragEnd={onDragEnd} BG={Drag.BgFinish}>
            <Drag.BgFinish />
            <Link to={`${activeGame.id}/`}>
              <Card>
                <Card.Header>{humanFormat(activeGame.date)}</Card.Header>
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
        </div>
      ) : (
        <p className="">Nemate ziadnu aktivnu hru</p>
      )}
      <FAB to="new-table" className="self-end">
        <PlusIcon className="h-8 w-8" />
        <span>Nova Hra</span>
      </FAB>
    </div>
  );
}
