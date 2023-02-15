import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";

import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPlayersAtTable } from "~/models/player.server";
import { getRoundsForGame } from "~/models/round.server";
import { calculateCostsPerRound, getGraphData } from "~/utils/game";
import { Outlet } from "@remix-run/react";

export default function Games() {
  return <Outlet />;
}
