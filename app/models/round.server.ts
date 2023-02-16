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
      hundredGameResult: {
        include: {
          marriage: true,
        },
      },
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

function upsertOrDeleteSeven(
  gameId: string,
  payload: ColorGameRound | HundredGameRound
) {
  const gameId_roundNumber = {
    gameId,
    roundNumber: payload.number,
  };
  return payload.seven
    ? prisma.seven.upsert({
        where: {
          gameId_roundNumber,
        },
        create: {
          gameId,
          roundNumber: payload.number,
          ...payload.seven!,
        },
        update: {
          ...payload.seven!,
        },
      })
    : prisma.seven.deleteMany({ where: gameId_roundNumber });
}

function upsertColorGameResult(gameId: string, payload: ColorGameRound) {
  const roundNumber = payload.number;

  return prisma.colorGameResult.upsert({
    where: {
      gameId_roundNumber: {
        gameId,
        roundNumber,
      },
    },
    update: {
      ...payload.colorGameResult,
    },
    create: {
      gameId,
      roundNumber,
      ...payload.colorGameResult,
    },
  });
}

function upsertHundredGameResult(gameId: string, payload: HundredGameRound) {
  const gameId_roundNumber = {
    gameId,
    roundNumber: payload.number,
  };

  return [
    prisma.hundredGameResult.upsert({
      where: { gameId_roundNumber },
      update: {
        contra: payload.hundredGameResult.contra,
        gameOfHearts: payload.hundredGameResult.gameOfHearts,
        points: payload.hundredGameResult.points,
      },
      create: {
        ...gameId_roundNumber,
        contra: payload.hundredGameResult.contra,
        gameOfHearts: payload.hundredGameResult.gameOfHearts,
        points: payload.hundredGameResult.points,
      },
    }),
    ...payload.hundredGameResult.marriage.map((marriage) =>
      prisma.marriage.upsert({
        where: {
          gameId_roundNumber_role: {
            ...gameId_roundNumber,
            role: marriage.role,
          },
        },
        update: {
          ...marriage,
          hundredGameResult: {
            connect: {
              gameId_roundNumber,
            },
          },
        },
        create: {
          ...gameId_roundNumber,
          ...marriage,
        },
      })
    ),
  ];
}

function upsertColorRound(gameId: string, payload: ColorGameRound) {
  const cost = costOfColorGame(payload.colorGameResult, payload.seven);
  const where = {
    gameId,
    roundNumber: payload.number,
  };

  return prisma.$transaction([
    prisma.round.upsert({
      where: {
        gameId_number: {
          gameId,
          number: payload.number,
        },
      },
      update: {
        ...payload,
        cost,
        colorGameResult: undefined,
        seven: undefined,
      },
      create: {
        gameId,
        ...payload,
        cost,
        colorGameResult: undefined,
        seven: undefined,
      },
    }),
    upsertOrDeleteSeven(gameId, payload),
    upsertColorGameResult(gameId, payload),
    prisma.hundredGameResult.deleteMany({ where }),
    prisma.trickGameResult.deleteMany({ where }),
  ]);
}

function upsertHundredRound(gameId: string, payload: HundredGameRound) {
  const cost = costOfHundredGame(payload.hundredGameResult, payload.seven);

  const where = {
    gameId,
    roundNumber: payload.number,
  };

  return prisma.$transaction([
    prisma.round.upsert({
      where: {
        gameId_number: {
          gameId,
          number: payload.number,
        },
      },
      update: {
        ...payload,
        cost,
        hundredGameResult: undefined,
        seven: undefined,
      },
      create: {
        gameId,
        ...payload,
        cost,
        hundredGameResult: undefined,
        seven: undefined,
      },
    }),
    upsertOrDeleteSeven(gameId, payload),
    ...upsertHundredGameResult(gameId, payload),
    prisma.colorGameResult.deleteMany({ where }),
    prisma.trickGameResult.deleteMany({ where }),
  ]);
}

function upsertTrickRound(
  gameId: string,
  payload: BetlGameRound | DurchGameRound
) {
  const cost = costOfTrickGame(payload.gameType, payload.trickGameResult);
  const where = {
    gameId,
    roundNumber: payload.number,
  };

  return prisma.$transaction([
    prisma.round.upsert({
      where: {
        gameId_number: {
          gameId,
          number: payload.number,
        },
      },
      update: {
        gameType: payload.gameType,
        playerId: payload.playerId,
        cost,
        trickGameResult: {
          upsert: {
            create: {
              ...payload.trickGameResult,
            },
            update: {
              ...payload.trickGameResult,
            },
          },
        },
      },
      create: {
        gameId,
        number: payload.number,
        gameType: payload.gameType,
        playerId: payload.playerId,
        cost,
        trickGameResult: {
          create: {
            ...payload.trickGameResult,
          },
        },
      },
    }),
    prisma.colorGameResult.deleteMany({ where }),
    prisma.hundredGameResult.deleteMany({ where }),
    prisma.seven.deleteMany({ where }),
  ]);
}

export async function upsertRound(gameId: string, payload: Round) {
  switch (payload.gameType) {
    case "color":
      upsertColorRound(gameId, payload);
      break;
    case "hundred":
      upsertHundredRound(gameId, payload);
      break;
    case "betl":
    case "durch":
      upsertTrickRound(gameId, payload);
      break;
  }
}

export type PrismaFullRound = PrismaRound & {
  colorGameResult?: PrismaColorGameResult & { seven?: PrismaSeven | null };
  hundredGameResult?: PrismaHundredGameResult & {
    seven?: PrismaSeven | null;
    marriage?: Marriage[];
  };
  trickGameResult?: PrismaTrickGameResult;
  seven?: Seven;
};

export type ColorGameResult = Omit<
  PrismaColorGameResult,
  "gameId" | "roundNumber"
>;
export type MarriageSymbol = "spade" | "club" | "diamond" | "heart";
export type Marriage = Omit<PrismaMarriage, "gameId" | "roundNumber">;
export type HundredGameResult = Omit<
  PrismaHundredGameResult,
  "gameId" | "roundNumber"
> & {
  marriage: Marriage[];
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
