import type { TrickGameResult } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { z } from "zod";

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
import {
  createColorGameRound,
  createTrickGameRound,
} from "~/models/round.server";

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

const GameTypeEnum = z.enum(["color", "hundred", "betl", "durch"]);
export const action = async ({ request, params }: ActionArgs) => {
  const gameId = z.string().parse(params.gameId);
  const form = await request.formData();

  const gameType = GameTypeEnum.parse(form.get("gameType"));
  const player = z.string().parse(form.get("player"));
  const roundNumberStr = z.string().parse(form.get("roundNumber"));
  const roundNumber = parseInt(roundNumberStr, 10);

  switch (gameType) {
    case "color": {
      const gameOfHearts = Boolean(form.get("gameOfHearts"));
      const flekCount = parseInt(form.get("flek") as string, 10);
      const points = parseInt(form.get("points") as string, 10);
      const marriageOpposition = 0;
      const marriagePlayer = 0;

      await createColorGameRound(
        player,
        gameType,
        {
          gameId,
          roundNumber,
          gameOfHearts,
          points,
          flekCount,
          marriageOpposition: 0,
          marriagePlayer: 0,
        },
        {
          gameId,
          roundNumber,
          role: "",
          flekCount: 0,
          silent: false,
          won: false,
        }
      );
      return null;
    }
    case "hundred": {
      return null;
    }
    case "betl":
    case "durch":
      const open = Boolean(form.get("open"));
      const won = Boolean(form.get("won"));

      createTrickGameRound(player, gameType, {
        open,
        won,
        roundNumber,
        gameId,
      });

      return null;
    default:
      return null;
  }

  return null;
};

const roundTypes = [
  { label: "Farba", value: "color" },
  { label: "Stovka", value: "hundred" },
  { label: "Betl", value: "betl" },
  { label: "Durch", value: "durch" },
] as const;

type RoundType = (typeof roundTypes)[number]["value"];

export default function ActiveGame() {
  const [flek, setFlek] = useState(0);
  const { playerOptions, actor, oposition, lastRound } =
    useLoaderData<typeof loader>();

  const [playedBy, setPlayedBy] = useState(actor.id);
  const [counter100, setCounter100] = useState(false);
  const [called, setCalled] = useState<RoundType>(roundTypes[0].value);

  const onGameChanged = useCallback(
    (called: RoundType) => {
      setCalled(called as RoundType);
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
                  options={roundTypes as unknown as Option[]}
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
