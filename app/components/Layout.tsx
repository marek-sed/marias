import type { ReactNode } from "react";
import { GearIcon } from "@radix-ui/react-icons";
import { Link, useMatches } from "@remix-run/react";

export function Layout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const matches = useMatches();
  console.log(matches);

  const currentMatch = matches[matches.length - 1];

  return (
    <>
      <header className="app-header">
        <div className="hstack">
          {currentMatch.handle?.backLink && (
            <div>{currentMatch.handle?.backLink}</div>
          )}
          <h1 className="app-title">{title}</h1>
        </div>
        <nav>
          <Link to="/settings" className="btn">
            <GearIcon />
          </Link>
        </nav>
      </header>
      <main>
        <div className="content">{children}</div>
      </main>
    </>
  );
}
