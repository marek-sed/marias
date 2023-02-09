import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { GameType } from "~/utils/round";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

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
  upsertColorGameRound,
  createHundredGameRound,
  createTrickGameRound,
  getRound,
} from "~/models/round.server";
import { getRoundInitialValues, parseRoundFormData } from "~/utils/round";
import invariant from "tiny-invariant";

export const handle = {
  title: "Hra",
  backLink: (
    <Link className="btn" to="/games">
      <ArrowLeftIcon />
    </Link>
  ),
};

export const loader = async ({ params }: LoaderArgs) => {
  const { gameId, round: roundId } = params;
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
  let currentRound = Math.max(...game.rounds.map((r) => r.number)) + 1;

  const actor = game.players.find((p) =>
    isPlayerActor(p.position, currentRound, game.players.length)
  )!.player;

  let round = undefined;
  let initialValues = undefined;
  if (roundId !== "new" && typeof roundId === "string") {
    const roundNumber = parseInt(roundId, 10);
    round = await getRound(gameId, roundNumber);
  }
  initialValues = getRoundInitialValues(round, {
    nextRoundNUmber: currentRound,
    actorId: actor.id,
  });

  const oposition = game.players
    .filter((p) =>
      isPlayerOposition(p.position, currentRound, game.players.length)
    )
    .map((p) => p.player);

  return json({
    playerOptions,
    actor,
    oposition,
    round,
    initialValues,
  });
};

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.gameId, "invalid game id");
  const { gameId } = params;
  const form = await request.formData();

  const round = parseRoundFormData(form);

  switch (round.gameType) {
    case "color": {
      await upsertColorGameRound(gameId, round);
      return null;
    }
    case "hundred": {
      await createHundredGameRound(gameId, round);
      return null;
    }
    case "betl":
    case "durch":
      createTrickGameRound(gameId, round);
      return null;
    default:
      return null;
  }
};

const roundTypes = [
  { label: "Farba", value: "color" },
  { label: "Stovka", value: "hundred" },
  { label: "Betl", value: "betl" },
  { label: "Durch", value: "durch" },
] as const;

export default function Round() {
  const [flek, setFlek] = useState(0);
  const { playerOptions, actor, oposition, initialValues } =
    useLoaderData<typeof loader>();

  const [playedBy, setPlayedBy] = useState(initialValues.playerId);
  const [counter100, setCounter100] = useState(initialValues.contra);
  const [called, setCalled] = useState<GameType>(initialValues.gameType);

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
  const isGameOfColor = called === "color" || called === "hundred";

  const { rootRef } = useGameTheme(better);
  return (
    <GameContext value={{ type: better ? "better" : "default" }}>
      <div ref={rootRef} className="space-y-2">
        <h1 className="text-xl">Kolo {initialValues.roundNumber}</h1>
        <Form className="space-y-4" method="post">
          <input
            type="hidden"
            name="roundNumber"
            value={initialValues.roundNumber}
          />
          <input type="hidden" name="playedBy" value={playedBy} />

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
              </motion.div>
            </div>
          </Fieldset>
          {isGameOfColor ? (
            <ColorResult
              player={{
                label: playedLegendLabel,
                marriage: initialValues.marriagePlayer,
                points: initialValues.points,
              }}
              opposition={{
                label: opositioniLegendLabel,
                marriage: initialValues.marriageOpposition,
              }}
            />
          ) : (
            <TrickResult playedBy={playedLegendLabel}></TrickResult>
          )}

          <div className="flex w-full justify-end pt-8">
            <div className="w-48">
              <Button type="submit" size="large" border>
                Zapisat kolo
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </GameContext>
  );
}
