import { ColorGameResult, Marriage, Seven } from "@prisma/client";
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

type MarriageValues = Pick<Marriage, "club" | "diamond" | "heart" | "spade">;
export function marriageToPoints({
  club,
  diamond,
  spade,
  heart,
}: MarriageValues) {
  const points = [20, 20, 20, 40];
  const m = [club, diamond, spade, heart];
  return m.reduce((acc, el, index) => (el ? acc + points[index] : acc), 0);
}

export function calculateColorGamePoints(
  points: number,
  marriages: Pick<Marriage, "club" | "diamond" | "heart" | "spade" | "role">[]
) {
  const playerMarriage = marriages.find((m) => m.role === "player");
  const oppositionMarriage = marriages.find((m) => m.role === "opposition");

  let playerPoints = points;
  let oppositionPoints = 90 - points;
  if (playerMarriage) {
    playerPoints += marriageToPoints(playerMarriage);
  }
  if (oppositionMarriage) {
    oppositionPoints += marriageToPoints(oppositionMarriage);
  }

  console.log("p, o", playerPoints, oppositionPoints);
  return {
    playerPoints,
    oppositionPoints,
  };
}

export function getHundredMultiplier(points: number) {
  if (points > 100) {
    return points / 10 - 9;
  } else if (points < 100) {
    return 10 - points / 10;
  } else {
    return 1;
  }
}

export function costOfColorGame(
  game: Pick<ColorGameResult, "flekCount" | "gameOfHearts" | "points">,
  rates: { game: number; seven: number },
  marriages: Pick<Marriage, "club" | "diamond" | "heart" | "spade" | "role">[],
  seven?: Pick<Seven, "role" | "silent" | "won">
) {
  const { playerPoints, oppositionPoints } = calculateColorGamePoints(
    game.points,
    marriages
  );
  let costOfGame = rates.game;
  let costOfSeven = rates.seven;
  if (game.gameOfHearts) {
    costOfGame = rates.game * 2;
    costOfSeven = rates.seven * 2;
  }

  if (seven) {
    costOfSeven = costOfSeven / (seven.silent ? 2 : 1);
    if (seven.role === "player") {
      costOfSeven *= seven.won ? 1 : -1;
    } else if (seven.role === "opposition") {
      costOfSeven *= seven.won ? -1 : 1;
    }
  } else {
    costOfSeven = 0;
  }

  if (game.flekCount === 0) {
    return costOfGame + costOfSeven;
  }

  costOfGame *= game.flekCount * 2;

  // silent hundred
  if (playerPoints >= 100) {
    costOfGame = costOfGame * getHundredMultiplier(playerPoints) + costOfSeven;
  } else if (oppositionPoints >= 100) {
    costOfGame =
      costOfGame * getHundredMultiplier(oppositionPoints) + costOfSeven;
  } else if (playerPoints > oppositionPoints) {
    costOfGame = costOfGame + costOfSeven;
  } else if (playerPoints < oppositionPoints) {
    return costOfGame * -1 + costOfSeven;
  }

  return costOfGame;
}
