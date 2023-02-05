import type {
  ColorGameResult,
  HundredGameResult,
  Seven,
  TrickGameResult,
} from "@prisma/client";
import { prisma } from "~/db.server";

import {
  costOfColorGame,
  costOfHundredGame,
  costOfTrickGame,
} from "~/utils/utils.server";

export async function createTrickGameRound(
  playerId: string,
  gameType: "betl" | "durch",
  result: TrickGameResult
) {
  const cost = costOfTrickGame(gameType, result);

  return prisma.round.create({
    data: {
      playerId,
      gameType: gameType,
      gameId: result.gameId,
      cost,
      number: result.roundNumber,
      TrickGameResult: {
        create: {
          open: result.open,
          won: result.won,
        },
      },
    },
  });
}

export async function createColorGameRound(
  playerId: string,
  result: ColorGameResult,
  seven?: Omit<Seven, "gameId" | "roundNumber">
) {
  const cost = costOfColorGame(result, seven);

  console.log("submit color", playerId, result, seven);

  return prisma.round.create({
    data: {
      playerId,
      gameType: "color",
      gameId: result.gameId,
      cost,
      number: result.roundNumber,
      ColorGameResult: {
        create: {
          points: result.points,
          flekCount: result.flekCount,
          gameOfHearts: result.gameOfHearts,
          marriageOpposition: result.marriageOpposition,
          marriagePlayer: result.marriagePlayer,
          seven: seven
            ? {
                create: {
                  ...seven,
                },
              }
            : undefined,
        },
      },
    },
  });
}

export async function createHundredGameRound(
  playerId: string,
  result: HundredGameResult,
  seven?: Omit<Seven, "gameId" | "roundNumber">
) {
  const cost = costOfHundredGame(result, seven);

  return prisma.round.create({
    data: {
      playerId,
      gameType: "hundred",
      gameId: result.gameId,
      cost,
      number: result.roundNumber,
      HundredGameResult: {
        create: {
          points: result.points,
          contra: result.contra,
          gameOfHearts: result.gameOfHearts,
          marriageOpposition: result.marriageOpposition,
          marriagePlayer: result.marriagePlayer,
          seven: seven
            ? {
                create: {
                  ...seven,
                },
              }
            : undefined,
        },
      },
    },
  });
}
