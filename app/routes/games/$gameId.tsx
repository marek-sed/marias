import type { LoaderArgs } from "@remix-run/node";
import type { Option } from "~/components/select";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getFullGame } from "~/models/game.server";
import { getPlayers } from "~/models/settings.server";
import {
  isPlayerCallingTheGame as isPlayerActor,
  playerPositionToRole,
} from "~/utils/utils.server";

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
  const actorOption = { value: actor.id, label: actor.name };

  return json({ game, playerOptions, actorOption, lastRound });
};

const calledGameTypes = [
  { label: "Hra", value: "game" },
  { label: "Stovka", value: "hundred" },
  { label: "Betl", value: "betl" },
  { label: "Durch", value: "durch" },
] as const;

const silentGameTypes = [
  { label: "Sedma", value: "seven" },
  { label: "Sto proti", value: "hundred" },
  { label: "Betl", value: "betl" },
  { label: "Durch", value: "durch" },
];

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
  const { game, playerOptions, actorOption, lastRound } =
    useLoaderData<typeof loader>();

  const [playedBy, setPlayedBy] = useState(actorOption.value);
  const [called, setCalled] = useState<GameType>(calledGameTypes[1].value);

  const onGameChanged = useCallback(
    (called: GameType) => {
      setCalled(called as GameType);
      if (called === "betl" || called === "durch") {
        setBetter(false);
      }
    },
    [setCalled]
  );
  const [counter100, setCounter100] = useState(false);
  const [better, setBetter] = useState<boolean>(true);
  useLayoutEffect(() => {
    rootRef.current?.style.setProperty(
      "--game-color",
      better ? "var(--bronze11)" : "var(--green11)"
    );

    rootRef.current?.style.setProperty(
      "--game-bg-color",
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
        <h1 className="mt-4 text-xl">Kolo {lastRound}</h1>
        <Form className="space-y-4" method="post">
          <fieldset className="relative rounded border border-sage-7 bg-sage-2 px-3 py-3">
            <legend className="text-teal-12">
              {calledGameTypes.find(({ value }) => value === called)?.label}
            </legend>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex w-full justify-between">
                <GamePicker
                  key={better.toString()}
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
          <fieldset className="relative rounded border border-sage-7 bg-sage-2 p-4">
            <legend className="text-teal-12">Obrana</legend>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex w-full justify-between">
                <div className="flex space-x-1">
                  <Label name="gameType">Zvol hru</Label>
                </div>
              </div>
            </div>
          </fieldset>

          <div className="flex w-full justify-end">
            <Button
              color="game"
              type="button"
              size="large"
              border
              // className="flex h-12 w-48 items-center justify-center rounded border-2 border-teal-7 bg-gradient-to-tr
              //  from-teal-2 via-sage-2 to-bronze-4 font-semibold text-teal-12 hover:border-teal-8"
            >
              Zapisat kolo
            </Button>
          </div>
        </Form>
      </div>
    </GameContext>
  );
}
