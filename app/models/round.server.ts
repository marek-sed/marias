import type {
  ColorGameResult,
  Marriage,
  Seven,
  TrickGameResult,
} from "@prisma/client";
import { prisma } from "~/db.server";

export async function createTrickGameRound(
  playerId: string,
  gameType: "betl" | "durch",
  { open, won, gameId, roundNumber }: TrickGameResult
) {
  const game = await prisma.gameType.findUnique({ where: { name: gameType } });
  const rate = open ? game!.rate * 2 : game!.rate;
  const playerScore = won ? -rate : rate;
  const oppositionScore = won ? rate : -rate;

  return prisma.round.create({
    data: {
      playerId,
      gameTypeName: gameType,
      gameId,
      playerScore,
      oppositionScore,
      number: roundNumber,
      TrickGameResult: {
        create: {
          open: !!open,
          won: !!won,
        },
      },
    },
  });
}

type ColorGamePayload = ColorGameResult & {
  seven: Pick<Seven, "role" | "silent">;
  marriages: Pick<Marriage, "club" | "diamond" | "heart" | "spade" | "role">[];
};
export async function createColorGameRound(
  playerId: string,
  gameType: "color" | "hundred",
  {
    gameId,
    roundNumber,
    gameOfHearts,
    points,
    flekCount,
    marriages,
    seven,
  }: ColorGamePayload
) {
  const gameRates = await prisma.gameType.findMany({
    where: {
      OR: [
        {
          name: gameType,
        },
        { name: "seven" },
      ],
    },
  });

  const gameRate = gameRates.find((gr) => gr.name === gameType)!.rate;
  const sevenRate = gameRates.find((gr) => gr.name === "seven")!.rate;

  let rate = gameRate * flekCount;
  if (gameOfHearts) {
    rate = rate * 2;
  }

  const playerScore = 0;
  const oppositionScore = 0;

  return prisma.round.create({
    data: {
      gameId,
      number: roundNumber,
      playerId,
      gameTypeName: gameType,
      playerScore,
      oppositionScore,
      ColorGameResult: {
        create: {
          points,
          flekCount,
          gameOfHearts,
          marriage: {
            create: [
              {
                spade: false,
                club: false,
                heart: false,
                diamond: false,
                role: "player",
              },
              {
                spade: false,
                club: false,
                heart: false,
                diamond: false,
                role: "opposition",
              },
            ],
          },
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
