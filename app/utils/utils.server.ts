import { getPlayerCount } from "~/models/settings.server";

export async function canStartNewGame() {
  const playerCount = await getPlayerCount();
  return playerCount >= 3;
}

export function playerPositionToRole(
  position: number,
  roundNumber: number,
  playerCount = 4
) {
  return (position + roundNumber) % playerCount;
}

export function isPlayerActor(
  position: number,
  roundNumber: number,
  playerCount = 4
) {
  return playerPositionToRole(position, roundNumber, playerCount) === 0;
}

export function isPlayerOposition(
  position: number,
  roundNumber: number,
  playerCount = 4
) {
  const role = playerPositionToRole(position, roundNumber, playerCount);
  return role === 1 || role === 2;
}
