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
import { insertIf } from "~/utils";

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

export async function upsertRound(gameId: string, payload: Round) {
  let cost;
  switch (payload.gameType) {
    case "color":
      cost = costOfColorGame(payload.colorGameResult, payload.seven);
      break;
    case "hundred":
      cost = costOfHundredGame(payload.hundredGameResult, payload.seven);
      break;
    case "betl":
    case "durch":
      cost = costOfTrickGame(payload.gameType, payload.trickGameResult);
      break;
  }
  console.log("cost is", cost);

  const shouldDeleteSeven =
    (payload.gameType === "color" || payload.gameType === "hundred") &&
    payload.seven === undefined;

  return prisma.$transaction([
    prisma.round.upsert({
      where: {
        gameId_number: {
          gameId,
          number: payload.number,
        },
      },
      update: {
        playerId: payload.playerId,
        gameType: payload.gameType,
        cost,
        colorGameResult:
          payload.gameType === "color"
            ? {
                upsert: {
                  create: {
                    ...payload.colorGameResult,
                  },
                  update: {
                    ...payload.colorGameResult,
                  },
                },
              }
            : undefined,
        hundredGameResult:
          payload.gameType === "hundred"
            ? {
                upsert: {
                  create: {
                    ...payload.hundredGameResult,
                  },
                  update: {
                    ...payload.hundredGameResult,
                  },
                },
              }
            : undefined,
        trickGameResult:
          payload.gameType === "betl" || payload.gameType === "durch"
            ? {
                upsert: {
                  create: {
                    ...payload.trickGameResult,
                  },
                  update: {
                    ...payload.trickGameResult,
                  },
                },
              }
            : undefined,
        seven:
          (payload.gameType === "color" || payload.gameType === "hundred") &&
          payload.seven
            ? {
                upsert: {
                  create: {
                    ...payload.seven,
                  },
                  update: {
                    ...payload.seven,
                  },
                },
              }
            : undefined,
      },
      create: {
        gameId,
        number: payload.number,
        playerId: payload.playerId,
        gameType: "color",
        cost,
        colorGameResult:
          payload.gameType === "color"
            ? {
                create: {
                  ...payload.colorGameResult,
                },
              }
            : undefined,
        hundredGameResult:
          payload.gameType === "hundred"
            ? {
                create: {
                  ...payload.hundredGameResult,
                },
              }
            : undefined,
        trickGameResult:
          payload.gameType === "betl" || payload.gameType === "durch"
            ? {
                create: {
                  ...payload.trickGameResult,
                },
              }
            : undefined,
        seven:
          (payload.gameType === "color" || payload.gameType === "hundred") &&
          payload.seven
            ? {
                create: {
                  ...payload.seven,
                },
              }
            : undefined,
      },
    }),
    ...insertIf(
      shouldDeleteSeven,
      prisma.seven.deleteMany({
        where: {
          gameId,
          roundNumber: payload.number,
        },
      })
    ),
    ...insertIf(
      payload.gameType !== "color",
      prisma.colorGameResult.deleteMany({
        where: { gameId, roundNumber: payload.number },
      })
    ),
    ...insertIf(
      payload.gameType !== "hundred",
      prisma.hundredGameResult.deleteMany({
        where: { gameId, roundNumber: payload.number },
      })
    ),
    ...insertIf(
      payload.gameType !== "betl" && payload.gameType !== "durch",
      prisma.trickGameResult.deleteMany({
        where: { gameId, roundNumber: payload.number },
      })
    ),
  ]);
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
