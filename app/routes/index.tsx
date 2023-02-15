import { Link } from "@remix-run/react";

export const handle = {
  title: "Marias",
};

export default function Index() {
  return (
    <div className="flex flex-col space-y-2">
      <Link to="games/">Hry</Link>
      <Link to="settings">Nastavenia</Link>
    </div>
  );
}
