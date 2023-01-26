import type { LoaderArgs } from "@remix-run/node";
import type { Option } from "~/components/select";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getFullGame } from "~/models/game.server";
import { getPlayers } from "~/models/settings.server";
import { isPlayerActor, isPlayerOposition } from "~/utils/utils.server";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FormControl, Label } from "~/components/formControl";
import { Select } from "~/components/select";
import { Checkbox, IndeterminateCheckbox } from "~/components/checkbox";
import { Input } from "~/components/input";
import { GamePicker } from "~/components/gamePicker";
import { HeartBox } from "~/components/heartBox";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/components/button";
import { GameContext } from "~/components/gameContext";
import { Marriage } from "~/components/marriage";

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
type GameProps = {
  type: GameType;
  playerOptions: Option[];
  playedBy: {
    value: string;
    onChange: (value: string) => void;
  };
  better: {
    onChange: (v: boolean) => void;
    value: boolean;
  };
  seven: {
    onChange: (v: boolean) => void;
    value: boolean;
  };
  points: {
    onChange: (v: number) => void;
    value: number;
  };
};

export default function ActiveGame() {
  const rootRef = useRef<HTMLDivElement>(null);

  const [flek, setFlek] = useState(0);
  const { game, playerOptions, actor, oposition, lastRound } =
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
    },
    [setCalled, setCounter100]
  );

  const playedLegendLabel = counter100
    ? oposition.map((p) => p.name).join(", ")
    : playerOptions.find((opt) => opt.value === playedBy)?.label;

  const opositioniLegendLabel = !counter100
    ? oposition.map((p) => p.name).join(", ")
    : playerOptions.find((opt) => opt.value === playedBy)?.label;

  const [better, setBetter] = useState<boolean>(false);
  useEffect(() => {
    rootRef.current?.style.setProperty(
      "--game-color",
      better ? "var(--bronze11)" : "var(--green11)"
    );

    rootRef.current?.style.setProperty(
      "--game-color-hover",
      better ? "var(--bronze10)" : "var(--green10)"
    );

    rootRef.current?.style.setProperty(
      "--game-color-active",
      better ? "var(--bronze11)" : "var(--green11)"
    );

    rootRef.current?.style.setProperty(
      "--game-bg-color",
      better ? "var(--bronze1)" : "var(--green1)"
    );

    rootRef.current?.style.setProperty(
      "--game-bg-hover-color",
      better ? "var(--bronze3)" : "var(--green3)"
    );

    rootRef.current?.style.setProperty(
      "--game-bg-active-color",
      better ? "var(--bronze5)" : "var(--green5)"
    );

    rootRef.current?.style.setProperty(
      "--game-border-color",
      better ? "var(--bronze6)" : "var(--green6)"
    );

    rootRef.current?.style.setProperty(
      "--game-border-hover-color",
      better ? "var(--bronze8)" : "var(--green8)"
    );
  }, [better]);

  const [won, setWon] = useState<boolean | "indeterminate">("indeterminate");
  const [seven, setSeven] = useState(false);
  const [points, setPoints] = useState(50);
  const isNormalGame = called !== "betl" && called !== "durch";

  return (
    <GameContext value={{ type: better ? "better" : "default" }}>
      <div ref={rootRef} className="mx-auto max-w-screen-sm space-y-2">
        <h1 className="text-xl">Kolo {lastRound}</h1>
        <Form className="space-y-4" method="post">
          <fieldset className="relative rounded border border-gray-7 bg-gray-2 px-3 py-3">
            <legend className="text-green-12">Zvolena hra</legend>
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
                  {called === "game" || called === "hundred" ? (
                    <motion.div
                      key="gamehundred"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.3,
                      }}
                    >
                      {called === "hundred" && (
                        <FormControl
                          name="players"
                          label="Proti"
                          value={counter100}
                          onChange={setCounter100}
                        >
                          <Checkbox />
                        </FormControl>
                      )}

                      <div className="w-full items-center space-y-4 pt-8">
                        <FormControl
                          direction="horizontal"
                          label="Lepsia"
                          name="better"
                          value={better}
                          onChange={setBetter}
                        >
                          <HeartBox />
                        </FormControl>

                        <FormControl
                          name="sedma"
                          label="Sedma"
                          value="indeterminate"
                        >
                          <IndeterminateCheckbox />
                        </FormControl>

                        <FormControl
                          direction="horizontal"
                          name="flek"
                          value={flek}
                          onChange={setFlek}
                          label="Flek"
                        >
                          <Input
                            key={better.toString()}
                            color="game"
                            step={1}
                            max={10}
                            type="number"
                          />
                        </FormControl>
                      </div>
                    </motion.div>
                  ) : (
                    // BETL DURCH
                    <motion.div
                      key="betldurch"
                      className="space-y-4"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.3,
                      }}
                    >
                      <FormControl
                        name="player"
                        label="Hru zahlasil"
                        value={playedBy}
                        onChange={setPlayedBy}
                      >
                        <Select
                          placeholder="Kto hral sam?"
                          options={playerOptions}
                        />
                      </FormControl>
                      <FormControl
                        label="Vylozeny"
                        name="openDurch"
                        defaultValue={true}
                      >
                        <Checkbox />
                      </FormControl>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </fieldset>
          <motion.fieldset
            layout
            className="relative rounded border border-gray-7 bg-gray-2 p-4"
          >
            <motion.legend
              key={playedLegendLabel}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-green-12"
            >
              {playedLegendLabel}
            </motion.legend>
            <div className="flex flex-col items-center space-y-4">
              <FormControl
                name="silentSeven"
                label="Ticha sedma"
                value="indeterminate"
              >
                <IndeterminateCheckbox />
              </FormControl>

              <FormControl name="mariage" label="Hlasky">
                <Marriage />
              </FormControl>

              <FormControl
                name="points"
                label="Body"
                value={points}
                onChange={setPoints}
              >
                <Input type="number" min={0} max={90} step={10} />
              </FormControl>
            </div>
          </motion.fieldset>

          {called !== "betl" && called !== "durch" && (
            <motion.fieldset
              layout
              className="relative rounded border border-gray-7 bg-gray-2 p-4"
            >
              <motion.legend
                key={opositioniLegendLabel}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-green-12"
              >
                {opositioniLegendLabel}
              </motion.legend>
              <div className="flex flex-col items-center space-y-4">
                <FormControl
                  name="silentSeven"
                  label="Ticha sedma"
                  value="indeterminate"
                >
                  <IndeterminateCheckbox />
                </FormControl>

                <FormControl name="mariage" label="Hlasky">
                  <Marriage />
                </FormControl>

                <FormControl
                  name="points"
                  label="Body"
                  value={points}
                  onChange={setPoints}
                >
                  <Input type="number" min={0} max={90} step={10} />
                </FormControl>
              </div>
            </motion.fieldset>
          )}

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
