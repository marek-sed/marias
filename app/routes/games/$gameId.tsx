import type { TrickGameResult } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { z } from "zod";
import type { toZod } from "tozod";

import type { Option } from "~/components/select";
import { GamePicker } from "~/components/gamePicker";
import { ColorGame, ColorResult } from "~/components/game/Color";
import { TrickGame, TrickResult } from "~/components/game/Trick";
import { Fieldset } from "~/components/fieldset";
import { Button } from "~/components/button";
import { GameContext } from "~/components/gameContext";
import { useGameTheme } from "~/utils/game";
import { getFullGame } from "~/models/game.server";
import { isPlayerActor, isPlayerOposition } from "~/utils/utils.server";
import { createTrickGameRound } from "~/models/round.server";

export const handle = {
  title: "Hra",
  backLink: (
    <Link className="btn" to="/games">
      <ArrowLeftIcon />
    </Link>
  ),
};

export const loader = async ({ params }: LoaderArgs) => {
  const { gameId } = params;
  if (!gameId) {
    throw new Response("Not found", { status: 401 });
  }

  const game = await getFullGame(gameId);

  if (!game) {
    throw new Response("Not found", { status: 401 });
  }

  const playerOptions = game.players.map(({ player: p }) => ({
    value: p.id,
    label: p.name,
  }));
  const lastRound = Math.max(...game.rounds.map((r) => r.number));
  const actor = game.players.find((p) =>
    isPlayerActor(p.position, lastRound, game.players.length)
  )!.player;
  const oposition = game.players
    .filter((p) =>
      isPlayerOposition(p.position, lastRound, game.players.length)
    )
    .map((p) => p.player);

  return json({ playerOptions, actor, oposition, lastRound });
};

export const action = async ({ request, params }: ActionArgs) => {
  const { gameId } = params;
  const form = await request.formData();

  const GameTypeEnum = z.enum(["color", "hundred", "betl", "durch"]);
  const gameType = GameTypeEnum.parse(form.get("gameType"));
  const player = z.string().parse(form.get("player"));

  switch (gameType) {
    case "color": {
      return null;
    }
    case "hundred": {
      return null;
    }
    case "betl":
    case "durch":
      const payload = Object.fromEntries(form);
      const trickGameSchema: toZod<TrickGameResult> = z.object({
        gameId: z.string(),
        open: z.boolean(),
        won: z.boolean(),
        roundNumber: z.number().int(),
      });

      const trickResult = trickGameSchema.parse({ gameId, ...payload });

      createTrickGameRound(player, gameType, trickResult);

      return null;
    default:
      return null;
  }

  return null;
};

const calledGameTypes = [
  { label: "Farba", value: "color" },
  { label: "Stovka", value: "hundred" },
  { label: "Betl", value: "betl" },
  { label: "Durch", value: "durch" },
] as const;

type GameType = (typeof calledGameTypes)[number]["value"];

export default function ActiveGame() {
  const [flek, setFlek] = useState(0);
  const { playerOptions, actor, oposition, lastRound } =
    useLoaderData<typeof loader>();

  const [playedBy, setPlayedBy] = useState(actor.id);
  const [counter100, setCounter100] = useState(false);
  const [called, setCalled] = useState<GameType>(calledGameTypes[2].value);

  const onGameChanged = useCallback(
    (called: GameType) => {
      setCalled(called as GameType);
      if (called === "betl" || called === "durch") {
        setBetter(false);
        setCounter100(false);
      }
      if (called === "color" || called === "hundred") {
        setPlayedBy(actor.id);
      }
    },
    [setCalled, actor.id, setCounter100]
  );

  const playedLegendLabel = counter100
    ? oposition.map((p) => p.name).join(", ")
    : playerOptions.find((opt) => opt.value === playedBy)?.label;

  const opositioniLegendLabel = !counter100
    ? oposition.map((p) => p.name).join(", ")
    : playerOptions.find((opt) => opt.value === playedBy)?.label;

  const [better, setBetter] = useState<boolean>(false);
  const { rootRef } = useGameTheme(better);
  const isGameOfColor = called === "color" || called === "hundred";

  return (
    <GameContext value={{ type: better ? "better" : "default" }}>
      <div ref={rootRef} className="mx-auto max-w-screen-sm space-y-2">
        <h1 className="text-xl">Kolo {lastRound}</h1>
        <Form className="space-y-4" method="post">
          <input type="hidden" name="roundNumber" value={lastRound + 1} />
          <Fieldset legend="Zvolena hra">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex w-full justify-between">
                <GamePicker
                  id="gameType"
                  name="gameType"
                  value={called}
                  onChange={onGameChanged as any}
                  options={calledGameTypes as unknown as Option[]}
                />
              </div>

              <motion.div
                layout
                className="w-full"
                transition={{
                  duration: 0.3,
                }}
              >
                <AnimatePresence mode="popLayout">
                  {isGameOfColor ? (
                    <ColorGame
                      called={called}
                      better={{ value: better, onChange: setBetter }}
                      flek={{ value: flek, onChange: setFlek }}
                      counter100={{
                        value: counter100,
                        onChange: setCounter100,
                      }}
                    />
                  ) : (
                    // BETL DURCH
                    <TrickGame
                      playedBy={{ value: playedBy, onChange: setPlayedBy }}
                      playerOptions={playerOptions}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </Fieldset>
          {isGameOfColor ? (
            <ColorResult
              player={{ label: playedLegendLabel }}
              opposition={{ label: opositioniLegendLabel }}
            />
          ) : (
            <TrickResult playedBy={playedLegendLabel}></TrickResult>
          )}

          <div className="flex w-full justify-end pt-8">
            <div className="w-48">
              <Button color="game" type="submit" size="large" border>
                Zapisat kolo
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </GameContext>
  );
}
