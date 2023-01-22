import type { ActionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getPlayers } from "~/models/settings.server";
import { createGame } from "~/models/game.server";

export const handle = {
  title: "Nova hra",
};

export const loader = async () => {
  const players = await getPlayers();

  return json({ players });
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();

  const playerIds = form.getAll("position") as string[];
  const game = await createGame(playerIds);

  return redirect(`../${game.id}`);
};

export default function NewTable() {
  const { players } = useLoaderData<typeof loader>();
  const chairs = Array(3)
    .fill(null)
    .map((_, i) => i);

  const optionalChairs = Array(2)
    .fill(null)
    .map((_, i) => i + 3);

  return (
    <div className="w-full">
      <div className="py-5">
        <h2 className="mb-10 text-center text-lg font-bold">
          Zadefinujte stol
        </h2>
        <Form method="post" className="flex flex-col space-y-2">
          {chairs.map((chairPosition) => (
            <label
              key={chairPosition}
              className="flex w-full items-center justify-between"
            >
              Stolicka {chairPosition + 1}
              <select
                name="position"
                defaultValue={players?.[chairPosition]?.id}
                className="ml-5 w-48 rounded border-b bg-sage-4"
              >
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
          ))}

          {optionalChairs.map((chairPosition) => (
            <label
              key={chairPosition}
              className="flex w-full items-center justify-between"
            >
              Stolicka {chairPosition + 1}
              <select
                name={`chair${chairPosition + 1}`}
                className="ml-5 w-48 rounded border-b bg-sage-4"
              >
                <option value="">nehra</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            className="self-end rounded border border-teal-7 px-8 py-2"
            type="submit"
          >
            Vytvorit
          </button>
        </Form>
      </div>
    </div>
  );
}
