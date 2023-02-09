import type {
  ColorGameResult,
  HundredGameResult,
  Round as PrismaRound,
  Seven,
  TrickGameResult,
} from "@prisma/client";
import type {
  BetlGameRound,
  ColorGameRound,
  DurchGameRound,
  HundredGameRound,
} from "~/utils/round";

import {
  costOfColorGame,
  costOfHundredGame,
  costOfTrickGame,
} from "~/utils/utils.server";
import { prisma } from "~/db.server";

export async function getRound(gameId: string, roundNumber: number) {
  const round = await prisma.round.findUnique({
    where: {
      gameId_number: {
        gameId,
        number: roundNumber,
      },
    },
    include: {
      ColorGameResult: {
        include: {
          seven: true,
        },
      },
      HundredGameResult: {
        include: {
          seven: true,
        },
      },
      TrickGameResult: true,
    },
  });

  return round as PrismaRound & {
    ColorGameResult?: ColorGameResult & { seven?: Seven | null };
    HundredGameResult?: HundredGameResult & { seven?: Seven | null };
    TrickGameResult?: TrickGameResult;
  };
}

export async function getRoundsForGame(gameId: string) {
  return prisma.round.findMany({
    where: {
      gameId,
    },
    select: {
      playerId: true,
      gameType: true,
      cost: true,
      number: true,
      gameId: true,
      player: {
        select: {
          id: true,
          name: true,
        },
      },
      HundredGameResult: {
        select: {
          gameOfHearts: true,
        },
      },
      ColorGameResult: {
        select: {
          gameOfHearts: true,
        },
      },
    },
  });
}

export async function createTrickGameRound(
  gameId: string,
  payload: BetlGameRound | DurchGameRound
) {
  const cost = costOfTrickGame(payload.gameType, payload.TrickGameResult);

  return prisma.round.create({
    data: {
      playerId: payload.playerId,
      gameType: payload.gameType,
      gameId: gameId,
      cost,
      number: payload.number,
      TrickGameResult: {
        create: {
          open: payload.TrickGameResult.open,
          won: payload.TrickGameResult.won,
        },
      },
    },
  });
}

export async function upsertColorGameRound(
  gameId: string,
  payload: ColorGameRound
) {
  const cost = costOfColorGame(
    payload.ColorGameResult,
    payload.ColorGameResult.seven
  );

  return prisma.round.create({
    data: {
      gameId,
      number: payload.number,
      playerId: payload.playerId,
      gameType: "color",
      cost,
      ColorGameResult: {
        create: {
          ...payload.ColorGameResult,
          seven: payload.ColorGameResult.seven
            ? {
                create: {
                  ...payload.ColorGameResult.seven,
                },
              }
            : undefined,
        },
      },
    },
  });
}

export async function createHundredGameRound(
  gameId: string,
  payload: HundredGameRound
) {
  const cost = costOfHundredGame(
    payload.HundredGameResult,
    payload.HundredGameResult.seven
  );

  return prisma.round.create({
    data: {
      gameId: gameId,
      number: payload.number,
      playerId: payload.playerId,
      gameType: "hundred",
      cost,
      HundredGameResult: {
        create: {
          ...payload.HundredGameResult,
          seven: payload.HundredGameResult.seven
            ? {
                create: {
                  ...payload.HundredGameResult.seven,
                },
              }
            : undefined,
        },
      },
    },
  });
}
