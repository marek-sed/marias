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
  useNavigationType,
  useNavigate,
  useLocation,
  useNavigation,
  useTransition,
  useOutlet,
} from "@remix-run/react";

import { getUser } from "./session.server";
import appCss from "~/styles/app.css";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigationAnimation } from "./utils";

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
  const goBack = useGoBack();
  const currentMatch = matches[matches.length - 1];
  console.log("matches", matches);
  let parentPath;
  if (matches.length > 1) {
    if (currentMatch.id.endsWith("index")) {
      parentPath = matches[matches.length - 3]?.pathname;
    } else {
      parentPath = matches[matches.length - 2]?.pathname;
    }
  }

  const outlet = useOutlet();
  const { x } = useNavigationAnimation();

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
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    goBack();
                  }}
                  to={parentPath}
                >
                  <CaretLeftIcon className="h-8 w-8" />
                </Link>
              </div>
            )}
            <h1 className="app-title">{currentMatch.handle?.title}</h1>
          </div>
        </header>
        <main className="py-8 px-6 text-gray-12">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentMatch.id}
              initial={{ x: x[0], opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  delay: 0.1,
                  ease: "easeInOut",
                  duration: 0.25,
                },
              }}
              exit={{ x: x[1], opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
