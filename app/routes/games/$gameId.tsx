import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Form, Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getFullGame } from "~/models/game.server";
import { getPlayers } from "~/models/settings.server";
import {
  isPlayerCallingTheGame as isPlayerActor,
  playerPositionToRole,
} from "~/utils/utils.server";

import { useState } from "react";
import { FormControl } from "~/components/formControl";
import { Select } from "~/components/select";
import { Checkbox } from "~/components/checkbox";
import { Input } from "~/components/input";

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

function PlayerTable() {}

type Option = { value: string; label: string };
const calledGameTypes = [
  { label: "Hra", value: "game" },
  { label: "Stovka", value: "hundred" },
  { label: "Betl", value: "betl" },
  { label: "Durch", value: "durch" },
];

const silentGameTypes = [
  { label: "Sedma", value: "seven" },
  { label: "Hundred", value: "hundred" },
  { label: "Sto sedma", value: "hundredSeven" },
];

export default function ActiveGame() {
  const { game, playerOptions, actorOption, lastRound } =
    useLoaderData<typeof loader>();

  const [playedBy, setPlayedBy] = useState(actorOption.value);
  const [called, setCalled] = useState(calledGameTypes[0].value);
  console.log("called", called);
  const [silent, setSilent] = useState(silentGameTypes[0].value);
  const [better, setBetter] = useState(false);
  const [points, setPoints] = useState(50);
  const [flex, setFlek] = useState(0);
  const isNormalGame = called !== "betl" && called !== "durch";

  return (
    <div className="">
      <Form className="mx-auto max-w-screen-sm space-y-4" method="post">
        <fieldset className="rounded border border-sage-7 p-3">
          <legend>Hlasene</legend>
          <div className="flex flex-col items-center space-y-4">
            <FormControl
              name="gameType"
              label="Typ hry"
              value={called}
              onChange={setCalled}
            >
              <Select placeholder="Vyber hru" options={calledGameTypes} />
            </FormControl>
            {isNormalGame && (
              <>
                <FormControl
                  name="isBetter"
                  label="Lepsia"
                  value={better}
                  onChange={setBetter}
                >
                  <Checkbox />
                </FormControl>
                <FormControl name="seven" label="Sedma" defaultValue={false}>
                  <Checkbox />
                </FormControl>
                <FormControl
                  name="points"
                  value={points}
                  onChange={setPoints}
                  label="Body"
                >
                  <Input type="number" />
                </FormControl>
              </>
            )}
            {!isNormalGame && (
              <>
                <FormControl
                  name="player"
                  label="Hru hral"
                  value={playedBy}
                  onChange={setPlayedBy}
                >
                  <Select placeholder="Kto hral sam?" options={playerOptions} />
                </FormControl>
                <FormControl name="won" label="Vyhral?" defaultValue={false}>
                  <Checkbox />
                </FormControl>
              </>
            )}
          </div>
        </fieldset>

        {isNormalGame && (
          <fieldset className="rounded border border-sage-7 p-3">
            <legend>Nehlasene</legend>
            <div>
              <div className="grid grid-cols-3">
                <div>
                  {playerOptions.find((p) => p.value === playedBy)?.label}
                </div>
                <div />
                <div>obrancovia</div>
              </div>
              <div className="grid grid-cols-3">
                <div>
                  {playerOptions.find((p) => p.value === playedBy)?.label}
                </div>
                <div />
                <div>obrancovia</div>
              </div>
            </div>
          </fieldset>
        )}
        <button className="rounded bg-sage-4 px-4 py-2">zapist kolo</button>
      </Form>
      {lastRound}
      <table>
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
      </table>
    </div>
  );
}
