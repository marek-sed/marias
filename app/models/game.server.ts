import type { Player, Game } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getGames() {
  return prisma.game.findMany({
    include: {
      players: {
        select: {
          player: true,
        },
      },
    },
  });
}

export type ActiveGameType = Awaited<ReturnType<typeof getActiveGame>>;
export async function getActiveGame() {
  return prisma.game.findFirst({
    where: {
      isActive: true,
    },
    include: {
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
