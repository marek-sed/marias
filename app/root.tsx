import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLocation,
  useMatches,
  useNavigate,
  useOutlet,
} from "@remix-run/react";

import { getUser } from "./session.server";
import appCss from "~/styles/app.css";
import { CaretLeftIcon, PlusIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigationAnimation } from "./utils";
import { FAB } from "./components/fab";
import { AnimatedOutlet } from "./components/animatedOutlet";

const useGoBack = () => {
  const navigate = useNavigate();
  return () =>
    navigate(-1 as any, {
      state: {
        direction: "LEFT",
      },
    });
};
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

export default function App() {
  const matches = useMatches();
  const { pathname } = useLocation();
  const goBack = useGoBack();
  const currentMatch = matches[matches.length - 1];
  console.log("matches", currentMatch.handle?.FAB);
  let parentPath;
  if (matches.length > 1) {
    if (currentMatch.id.endsWith("index")) {
      parentPath = matches[matches.length - 3]?.pathname;
    } else {
      parentPath = matches[matches.length - 2]?.pathname;
    }
  }

  return (
    <html lang="en" className="h-screen">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative bg-gray-1">
        <header className="sticky top-0 z-20 flex h-12 border-gray-6 bg-gray-2 px-6 text-xl text-gray-12 shadow-sm shadow-gray-6">
          <div className="flex items-center space-x-1 text-xl ">
            {parentPath && (
              <div className="-ml-4 py-2 text-gray-11">
                <Link to={parentPath}>
                  <CaretLeftIcon className="h-8 w-8" />
                </Link>
              </div>
            )}
            <h1 className="app-title">{currentMatch.handle?.title}</h1>
          </div>
        </header>
        <main className="mx-auto max-w-screen-sm py-8 px-6 text-gray-12">
          <AnimatedOutlet />
        </main>

        {/* <ScrollRestoration /> */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
