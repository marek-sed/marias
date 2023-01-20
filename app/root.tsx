import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "@remix-run/react";

import { getUser } from "./session.server";
import globalCss from "~/styles/global.css";
import { Layout } from "./components/Layout";
import { GearIcon } from "@radix-ui/react-icons";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalCss,
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const isRoot = currentMatch.pathname === "/";

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header className="app-header">
          <div className="hstack">
            {currentMatch.handle?.backLink && (
              <div>{currentMatch.handle?.backLink}</div>
            )}
            <h1 className="app-title">{currentMatch.handle?.title}</h1>
          </div>
          {isRoot && (
            <nav>
              <Link to="/settings" className="btn">
                <GearIcon />
              </Link>
            </nav>
          )}
        </header>
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
