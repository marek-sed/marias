import type { Stake } from "@prisma/client";
import type { GameType, PlayerPayload } from "~/models/settings.server";
import { getPlayers } from "~/models/settings.server";
import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getStakes, saveStakes, savePlayers } from "~/models/settings.server";
import settingsHref from "~/styles/settings.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: settingsHref }];
};

export const handle = {
  title: "Nastavenia",
  backLink: (
    <Link to="/games" className="btn">
      <ArrowLeftIcon />
    </Link>
  ),
};

export const loader = async () => {
  const stakes = await getStakes();
  const players = await getPlayers();

  if (!stakes) {
    throw Error("Stakes not found make sure they are seeded");
  }

  return json({
    stakes,
    players,
  });
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const intent = form.get("intent");

  switch (intent) {
    case "savePlayers": {
      const payload: PlayerPayload[] = [];
      const ids = form.getAll("id");
      const names = form.getAll("name");
      names.forEach((name, index) => {
        if (name) {
          payload.push({
            id: ids?.[index] ? (ids?.[index] as string) : undefined,
            name: name as string,
          });
        }
      });

      await savePlayers(payload);
      break;
    }
    case "saveStakes": {
      const payload: Partial<Stake> = {};
      for (const [name, value] of form) {
        if (name === "intent") continue;
        if (name === "id") {
          payload[name] = value as string;
          continue;
        }
        payload[name as GameType] = parseInt(value as string, 10);
      }

      await saveStakes(payload as Stake);
      break;
    }
  }

  return null;
};

const gameNames: Record<GameType, string> = {
  game: "Hra",
  betterGame: "Lepšia hra",
  seven: "Sedma",
  betterSeven: "Lepšia sedma",
  hundred: "Stovka",
  betterHundred: "Lepšia stovka",
  hundredSeven: "Sto sedma",
  betl: "Betl",
  durch: "Durch",
};

export default function Settings() {
  const { stakes, players } = useLoaderData<typeof loader>();
  const playerPositions = Array(5)
    .fill(null)
    .map((_, i) => i + 1);

  return (
    <div>
      <Form method="post" className="vstack">
        <h2>Hraci</h2>
        <div>
          {players.map((player, i) => (
            <div key={player.id} className="form-control">
              <input type="hidden" name="id" value={player.id} />
              <label>Hrac {i + 1}</label>
              <input name="name" defaultValue={player.name} type="text" />
            </div>
          ))}
        </div>

        <button name="intent" value="savePlayers" type="submit">
          Ulozit hracov
        </button>
      </Form>
      <hr className="full" />
      <Form method="post" className="vstack">
        <h2>Stavky</h2>
        <div>
          {Object.entries(stakes).map(([stake, value]) => {
            if (stake === "id") {
              return (
                <input key={stake} type="hidden" name="id" value={value} />
              );
            }
            return (
              <div key={stake} className="form-control">
                <label>{gameNames[stake as GameType]}</label>
                <input type="number" name={stake} defaultValue={value} />
              </div>
            );
          })}
        </div>
        <button name="intent" value="saveStakes" type="submit">
          Ulozit stavky
        </button>
      </Form>
    </div>
  );
}
