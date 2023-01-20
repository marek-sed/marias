import { ArrowLeftIcon } from "@radix-ui/react-icons";
import type { LinksFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import settingsHref from "~/styles/settings.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: settingsHref }];
};

export const handle = {
  title: "Nastavenia",
  backLink: (
    <Link to=".." className="btn">
      <ArrowLeftIcon />
    </Link>
  ),
};

const games = {
  game: 1,
  betterGame: 2,
  seven: 2,
  betterSeven: 4,
  hundred: 4,
  betterHundred: 8,
  hundredSeven: 6,
  betl: 15,
  durch: 30,
} as const;

type GameType = Extract<keyof typeof games, string>;
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
} as const;

export default function Settings() {
  return (
    <div>
      <Form method="post" className="vstack">
        <h2>Hraci</h2>
        <div>
          <div className="form-control">
            <label>Hrac 1</label>
            <input type="text" />
          </div>

          <div className="form-control">
            <label>Hrac 2</label>
            <input type="text" />
          </div>

          <div className="form-control">
            <label>Hrac 3</label>
            <input type="text" />
          </div>

          <div className="form-control">
            <label>Hrac 4</label>
            <input type="text" />
          </div>
        </div>

        <button type="submit">Ulozit hracov</button>
      </Form>
      <hr className="full" />
      <Form method="post" className="vstack">
        <h2>Stavky</h2>
        <div>
          {Object.entries(games).map(([game, value]) => {
            return (
              <div key={game} className="form-control">
                <label>{gameNames[game as GameType]}</label>
                <input type="number" defaultValue={value} />
              </div>
            );
          })}
        </div>
        <button type="submit">Ulozit stavky</button>
      </Form>
    </div>
  );
}
