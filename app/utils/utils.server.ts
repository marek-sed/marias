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

export function isPlayerCallingTheGame(
  position: number,
  roundNumber: number,
  playerCount = 4
) {
  return playerPositionToRole(position, roundNumber, playerCount) === 0;
}
