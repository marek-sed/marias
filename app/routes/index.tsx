import { Link } from "@remix-run/react";
import type { ReactNode } from "react";
import { ArrowLeftIcon, GearIcon } from "@radix-ui/react-icons";

import { useOptionalUser } from "~/utils";
import { Layout } from "~/components/Layout";

export const handle = {
  title: "Marias",
};

export default function Index() {
  const user = useOptionalUser();
  return <Link to="/game">Začať novú hru</Link>;
}
