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
  {
    gameId,
    roundNumber,
    gameOfHearts,
    points,
    flekCount,
    marriageOpposition,
    marriagePlayer,
  }: ColorGameResult,
  seven: Seven
) {
  const cost = costOfColorGame(
    {
      flekCount,
      gameOfHearts,
      points,
      marriagePlayer,
      marriageOpposition,
    },
    seven
  );

  return prisma.round.create({
    data: {
      gameId,
      number: roundNumber,
      playerId,
      gameTypeName: gameType,
      cost,
      ColorGameResult: {
        create: {
          points,
          flekCount,
          gameOfHearts,
          seven: {
            create: {
              won: false,
              silent: true,
              role: "player",
            },
          },
        },
      },
    },
  });
}
