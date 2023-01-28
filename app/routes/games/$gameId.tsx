import type { LoaderArgs } from "@remix-run/node";
import type { Option } from "~/components/select";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getFullGame } from "~/models/game.server";
import { isPlayerActor, isPlayerOposition } from "~/utils/utils.server";

import { useCallback, useState } from "react";
import { FormControl } from "~/components/formControl";
import { Select } from "~/components/select";
import { Checkbox, IndeterminateCheckbox } from "~/components/checkbox";
import { Input } from "~/components/input";
import { GamePicker } from "~/components/gamePicker";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/components/button";
import { GameContext } from "~/components/gameContext";
import { Marriage } from "~/components/marriage";
import { useGameTheme } from "~/utils/game";
import { ColorGame, ColorResult } from "~/components/game/Color";
import { TrickGame } from "~/components/game/Trick";
import { Fieldset } from "~/components/fieldset";
import { IndeterminateBool } from "~/utils/types";

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
  console.log("players", game.players, game.rounds);
  const lastRound = Math.max(...game.rounds.map((r) => r.number));
  const actor = game.players.find((p) =>
    isPlayerActor(p.position, lastRound, game.players.length)
  )!.player;
  const oposition = game.players
    .filter((p) =>
      isPlayerOposition(p.position, lastRound, game.players.length)
    )
    .map((p) => p.player);

  return json({ game, playerOptions, actor, oposition, lastRound });
};

const calledGameTypes = [
  { label: "Hra", value: "game" },
  { label: "Stovka", value: "hundred" },
  { label: "Betl", value: "betl" },
  { label: "Durch", value: "durch" },
] as const;

type GameType = (typeof calledGameTypes)[number]["value"];

export default function ActiveGame() {
  const [flek, setFlek] = useState(0);
  const { game, playerOptions, actor, oposition, lastRound } =
    useLoaderData<typeof loader>();

  const [playedBy, setPlayedBy] = useState(actor.id);
  const [counter100, setCounter100] = useState(false);
  const [called, setCalled] = useState<GameType>(calledGameTypes[1].value);

  const onGameChanged = useCallback(
    (called: GameType) => {
      setCalled(called as GameType);
      if (called === "betl" || called === "durch") {
        setBetter(false);
        setCounter100(false);
      }
      if (called === "game" || called === "hundred") {
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

  const [won, setWon] = useState<boolean | "indeterminate">("indeterminate");
  const [points, setPoints] = useState(50);
  const isGameOfColor = called === "game" || called === "hundred";

  return (
    <GameContext value={{ type: better ? "better" : "default" }}>
      <div ref={rootRef} className="mx-auto max-w-screen-sm space-y-2">
        <h1 className="text-xl">Kolo {lastRound}</h1>
        <Form className="space-y-4" method="post">
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
          ) : null}

          <div className="flex w-full justify-end">
            <div className="w-48">
              <Button color="game" type="button" size="large" border>
                Zapisat kolo
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </GameContext>
  );
}
