import { Link, Outlet } from "@remix-run/react";

export default function GameIdIndex() {
  return (
    <div className="mx-auto flex max-w-screen-sm flex-col">
      <nav className="mb-8 space-x-2 self-end">
        <Link to=".">Priebeh</Link> <Link to="new">Zapisat Kolo</Link>
      </nav>
      <Outlet />
    </div>
  );
}
