import type { ColorGameResult, Seven, TrickGameResult } from "@prisma/client";
import { prisma } from "~/db.server";

import { costOfColorGame, costOfTrickGame } from "~/utils/utils.server";

export async function createTrickGameRound(
  playerId: string,
  gameType: "betl" | "durch",
  result: TrickGameResult
) {
  const cost = costOfTrickGame(gameType, result);

  return prisma.round.create({
    data: {
      playerId,
      gameTypeName: gameType,
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
  gameType: "color" | "hundred",
  result: ColorGameResult,
  seven?: Omit<Seven, "gameId" | "roundNumber">
) {
  const cost = costOfColorGame(result, seven);

  return prisma.round.create({
    data: {
      playerId,
      gameTypeName: gameType,
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
