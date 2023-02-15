import type { Player, Game } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getGames() {
  return prisma.game.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      rounds: {
        select: {
          cost: true,
          playerId: true,
        },
      },
      players: {
        select: {
          player: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export type ActiveGameType = Awaited<ReturnType<typeof getActiveGames>>;
export async function getActiveGames() {
  return prisma.game.findMany({
    where: {
      isActive: true,
    },
    include: {
      rounds: {
        select: {
          cost: true,
          playerId: true,
        },
      },
      players: {
        include: {
          player: true,
        },
      },
    },
  });
}

export async function getFullGame(id: Game["id"]) {
  const activeGame = await prisma.game.findFirst({
    where: {
      id,
    },
    include: {
      rounds: true,
      players: {
        select: {
          player: true,
          position: true,
        },
      },
    },
  });

  return activeGame;
}

export async function createGame(players: Array<Player["id"]>) {
  const gamePlayers = players.map((pId, i) => ({
    position: i + 1,
    player: {
      connect: {
        id: pId,
      },
    },
  }));

  return prisma.game.create({
    data: {
      isActive: true,
      players: {
        create: gamePlayers,
      },
      rounds: {
        create: [],
      },
    },
  });
}

export async function finishGame(gameId: Game["id"]) {
  return prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      isActive: false,
    },
  });
}

export async function deleteGame(gameId: Game["id"]) {
  return prisma.game.delete({
    where: {
      id: gameId,
    },
  });
}
