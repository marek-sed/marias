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
import appCss from "~/styles/app.css";
import { GearIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: appCss,
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

function Menu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="rounded bg-sage-9 p-2">
        <HamburgerMenuIcon />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="space-y-4 rounded-lg  border border-sage-6 bg-sage-3 py-2 text-end text-sage-12 shadow-xl">
          <DropdownMenu.Item className="px-4">
            <Link className="inline-flex items-center space-x-2" to="/games">
              <span>Hry</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-4">
            <Link className="inline-flex items-center space-x-2" to="/settings">
              <span>Settings</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="m-0 h-0.5 bg-sage-7" />
          <DropdownMenu.Item className="px-4">Odhlasit</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default function App() {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const action = currentMatch.handle?.action;

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative flex h-screen flex-col overflow-scroll bg-sage-1">
        <header className="sticky top-0 z-20 flex h-16 justify-between space-x-4  border-sage-6 bg-sage-2 py-4 px-6 text-2xl text-sage-12 shadow-sm shadow-sage-6">
          <div className="flex items-center space-x-4">
            <h1 className="app-title">{currentMatch.handle?.title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            {action}
            <Menu />
          </div>
        </header>
        <main className="py-8 px-6 text-sage-12">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
