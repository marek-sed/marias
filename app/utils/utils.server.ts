import type {
  ColorGameResult,
  TrickGameResult,
  Seven,
  HundredGameResult,
  Round,
  Player,
} from "@prisma/client";
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

export type ColorGamePayload = Pick<
  ColorGameResult,
  | "flekCount"
  | "gameOfHearts"
  | "points"
  | "marriagePlayer"
  | "marriageOpposition"
>;
export function calculateColorGamePoints(
  game: Omit<ColorGamePayload, "flekCount">
) {
  const { points, marriageOpposition, marriagePlayer } = game;
  let playerPoints = points + marriagePlayer;
  let oppositionPoints = 90 - points + marriageOpposition;

  return {
    playerPoints,
    oppositionPoints,
  };
}

export function getColorGameCost(game: ColorGamePayload) {
  let power = game.flekCount;
  power = power + (game.gameOfHearts ? 1 : 0);

  const { playerPoints, oppositionPoints } = calculateColorGamePoints(game);
  if (playerPoints - 90 > 0) {
    const pointsPower = (playerPoints - 90) / 10;
    power = power + pointsPower;
  } else if (oppositionPoints - 90 > 0) {
    const pointsPower = (oppositionPoints - 90) / 10;
    power = power + pointsPower;
  }

  const won = playerPoints > oppositionPoints ? 1 : -1;
  return Math.pow(2, power) * won;
}

export type SevenPayload = Pick<Seven, "flekCount" | "silent" | "won" | "role">;
export function getSevenCost(
  seven?: SevenPayload | null,
  gameOfHearts: boolean = false
) {
  if (!seven) {
    return 0;
  }

  let power = seven.flekCount + 1;
  if (seven.silent) {
    power = 0;
  }
  power = power + (gameOfHearts ? 1 : 0);
  let won = seven.won ? 1 : -1;
  if (seven.role === "opposition") {
    won = won * -1;
  }

  return Math.pow(2, power) * won;
}

export function costOfColorGame(
  game: ColorGamePayload,
  seven?: SevenPayload | null
) {
  return getColorGameCost(game) + getSevenCost(seven, game.gameOfHearts);
}

export function costOfHundredGame(
  game: Omit<HundredGameResult, "gameId" | "roundNumber">,
  seven: SevenPayload | undefined | null
) {
  let hundredGameCost = getColorGameCost({
    ...game,
    flekCount: 2,
  });

  if (game.contra) {
    hundredGameCost = hundredGameCost * -1;
  }

  return hundredGameCost + getSevenCost(seven, game.gameOfHearts);
}

const trickRates: Record<"betl" | "durch", number> = {
  betl: 5,
  durch: 10,
};
export function costOfTrickGame(
  type: "betl" | "durch",
  game: Pick<TrickGameResult, "open" | "won">
) {
  let rate = trickRates[type];
  rate = game.open ? rate * 2 : rate;
  return game.won ? rate : rate * -1;
}
