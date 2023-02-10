import type {
  Prisma,
  Round as PrismaRound,
  ColorGameResult as PrismaColorGameResult,
  HundredGameResult as PrismaHundredGameResult,
  TrickGameResult as PrismaTrickGameResult,
  Seven as PrismaSeven,
  Marriage as PrismaMarriage,
} from "@prisma/client";

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
      colorGameResult: true,
      hundredGameResult: true,
      trickGameResult: true,
      seven: true,
    },
  });

  return round as PrismaRound & {
    ColorGameResult?: ColorGameResult & { seven?: Seven | null };
    HundredGameResult?: HundredGameResult & { seven?: Seven | null };
    TrickGameResult?: TrickGameResult;
  };
}

export async function getRoundsForGame(gameId: string) {
  const getRounds = (gameId: string) =>
    prisma.round.findMany({
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
        hundredGameResult: {
          select: {
            gameOfHearts: true,
          },
        },
        colorGameResult: {
          select: {
            gameOfHearts: true,
          },
        },
      },
    });

  type R = Omit<
    Prisma.PromiseReturnType<typeof getRounds>[number],
    "gameType"
  > & {
    gameType: GameType;
  };

  return getRounds(gameId) as Prisma.PrismaPromise<R[]>;
}

export async function createTrickGameRound(
  gameId: string,
  payload: BetlGameRound | DurchGameRound
) {
  const cost = costOfTrickGame(payload.gameType, payload.trickGameResult);

  return prisma.round.create({
    data: {
      playerId: payload.playerId,
      gameType: payload.gameType,
      gameId: gameId,
      cost,
      number: payload.number,
      trickGameResult: {
        create: {
          open: payload.trickGameResult.open,
          won: payload.trickGameResult.won,
        },
      },
    },
  });
}

export async function upsertColorGameRound(
  gameId: string,
  payload: ColorGameRound
) {
  const cost = costOfColorGame(payload.colorGameResult, payload.seven);

  return prisma.round.create({
    data: {
      gameId,
      number: payload.number,
      playerId: payload.playerId,
      gameType: "color",
      cost,
      colorGameResult: {
        create: {
          ...payload.colorGameResult,
        },
      },
      seven: payload.seven
        ? {
            create: {
              ...payload.seven,
            },
          }
        : undefined,
    },
  });
}

export async function createHundredGameRound(
  gameId: string,
  payload: HundredGameRound
) {
  const cost = costOfHundredGame(payload.hundredGameResult, payload.seven);

  return prisma.round.create({
    data: {
      gameId: gameId,
      number: payload.number,
      playerId: payload.playerId,
      gameType: "hundred",
      cost,
      hundredGameResult: {
        create: {
          ...payload.hundredGameResult,
        },
      },
      seven: payload.seven
        ? {
            create: {
              ...payload.seven,
            },
          }
        : undefined,
    },
  });
}

export type PrismaFullRound = PrismaRound & {
  colorGameResult?: PrismaColorGameResult & { seven?: PrismaSeven | null };
  hundredGameResult?: PrismaHundredGameResult & { seven?: PrismaSeven | null };
  trickGameResult?: PrismaTrickGameResult;
  seven?: Seven;
};

export type ColorGameResult = Omit<
  PrismaColorGameResult,
  "gameId" | "roundNumber"
>;
export type Marriage = Omit<PrismaMarriage, "gameId" | "roundNumber">;
export type HundredGameResult = Omit<
  PrismaHundredGameResult,
  "gameId" | "roundNumber"
> & {
  marriages: Marriage[];
};

export type TrickGameResult = Omit<
  PrismaTrickGameResult,
  "gameId" | "roundNumber"
>;

export type Seven = Omit<PrismaSeven, "gameId" | "roundNumber">;
export type GameType = "color" | "hundred" | "betl" | "durch";
export type RoundBase = Omit<PrismaRound, "gameId">;

export type ColorGameRound = RoundBase & {
  gameType: "color";
  colorGameResult: ColorGameResult;
  seven?: Seven;
};
export type HundredGameRound = RoundBase & {
  gameType: "hundred";
  hundredGameResult: HundredGameResult;
  seven?: Seven;
};
export type BetlGameRound = RoundBase & {
  gameType: "betl";
  trickGameResult: TrickGameResult;
};
export type DurchGameRound = RoundBase & {
  gameType: "durch";
  trickGameResult: TrickGameResult;
};

export type Round =
  | ColorGameRound
  | HundredGameRound
  | BetlGameRound
  | DurchGameRound;
