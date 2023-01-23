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

import { useEffect, useRef, useState } from "react";
import { FormControl, Label } from "~/components/formControl";
import { Select } from "~/components/select";
import { Checkbox } from "~/components/checkbox";
import { Input } from "~/components/input";
import { RadioGroup } from "~/components/radioGroup";
import { HeartBox } from "~/components/heartBox";
import { AnimatePresence, motion } from "framer-motion";

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
function Game({
  type,
  playerOptions,
  playedBy,
  seven,
  better,
  points,
}: GameProps) {
  const [flek, setFlek] = useState(0);

  switch (type) {
    case "game":
    case "hundred":
      return (
        <>
          <FormControl name="flek" value={flek} onChange={setFlek} label="Flek">
            <Input step={1} type="number" />
          </FormControl>
          <FormControl name="better" label="Lepsia" {...better}>
            <Checkbox />
          </FormControl>
          <FormControl name="seven" label="Sedma" {...seven}>
            <Checkbox />
          </FormControl>
          {type === "game" ? (
            <FormControl name="won" label="Vyhral?" defaultValue={false}>
              <Checkbox />
            </FormControl>
          ) : (
            <FormControl name="points" {...points} label="Body">
              <Input type="number" />
            </FormControl>
          )}
        </>
      );
    case "betl":
    case "durch":
      return (
        <>
          <FormControl name="player" label="Hru zahlasil" {...playedBy}>
            <Select placeholder="Kto hral sam?" options={playerOptions} />
          </FormControl>
          <FormControl label="Vylozeny" name="openDurch" defaultValue={false}>
            <Checkbox />
          </FormControl>

          <FormControl name="won" label="Vyhral?" defaultValue={false}>
            <Checkbox />
          </FormControl>
        </>
      );
  }
}

export default function ActiveGame() {
  const formRef = useRef<HTMLFormElement>(null);
  const { game, playerOptions, actorOption, lastRound } =
    useLoaderData<typeof loader>();

  const [playedBy, setPlayedBy] = useState(actorOption.value);
  const [called, setCalled] = useState<GameType>(calledGameTypes[0].value);
  const [silent, setSilent] = useState(silentGameTypes[0].value);
  const [better, setBetter] = useState<boolean>(false);
  const [won, setWon] = useState(false);
  const [seven, setSeven] = useState(false);
  const [points, setPoints] = useState(50);
  const isNormalGame = called !== "betl" && called !== "durch";

  return (
    <div className="mx-auto max-w-screen-sm space-y-2">
      <h1 className="mt-4 text-xl">Kolo {lastRound}</h1>
      <Form ref={formRef} className="space-y-4" method="post">
        <fieldset className="relative rounded border border-sage-7 p-4">
          <legend>{actorOption.label}</legend>
          <AnimatePresence initial={false}>
            {(called === "game" || called === "hundred") && (
              <motion.div
                className="absolute right-1 -top-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  transition: {
                    duration: 0.3,
                  },
                }}
              >
                <FormControl name="better" defaultValue={false}>
                  <HeartBox />
                </FormControl>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex w-full justify-between">
              <div className="flex space-x-1">
                <Label name="gameType">Zvol hru</Label>
              </div>
              <motion.div layout className="inline-flex items-center space-x-1">
                <RadioGroup
                  id="gameType"
                  name="gameType"
                  value={called}
                  onChange={setCalled as any}
                  options={calledGameTypes as unknown as Option[]}
                />
              </motion.div>
            </div>

            <Game
              type={called}
              playerOptions={playerOptions}
              playedBy={{ value: playedBy, onChange: setPlayedBy }}
              seven={{ value: seven, onChange: setSeven }}
              better={{ value: better, onChange: setBetter }}
              points={{ value: points, onChange: setPoints }}
            />
          </div>
        </fieldset>
        <fieldset className="relative rounded border border-sage-7 p-4">
          <legend>Obrana</legend>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex w-full justify-between">
              <div className="flex space-x-1">
                <Label name="gameType">Zvol hru</Label>
              </div>
              <motion.div layout className="inline-flex items-center space-x-1">
                <RadioGroup
                  id="gameType"
                  name="gameType"
                  value={called}
                  onChange={setCalled as any}
                  options={silentGameTypes as unknown as Option[]}
                />
              </motion.div>
            </div>
          </div>
        </fieldset>
        <button className="rounded bg-sage-4 px-4 py-2">zapist kolo</button>
      </Form>
      {/* <table>
        <thead>
          <tr>
            <th>Kolo</th>
            {game?.players.map(({ player }) => (
              <th key={player.id}>{player.name}</th>
            ))}
            <th>Erik</th>
          </tr>
        </thead>

        <tbody>
          {game?.rounds.map((round) => (
            <tr key={round.id}>
              <td>{round.number}</td>
              {round.players.map((player, idx) => (
                <td key={`round-player-${idx}`}>{player.score}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}
