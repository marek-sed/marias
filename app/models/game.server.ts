import type { Player, Game } from "@prisma/client";
import { prisma } from "~/db.server";
import { playerPositionToRole } from "~/utils/utils.server";

export async function getGames() {
  return prisma.game.findMany({
    include: {
      players: {
        select: {
          player: true,
          totalScore: true,
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
      rounds: {
        include: {
          players: {
            include: {
              player: true,
            },
          },
        },
      },
      players: {
        select: {
          totalScore: true,
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

  const roundPlayers = players.map((pId, i) => ({
    playerId: pId,
    score: 0,
  }));

  return prisma.game.create({
    data: {
      isActive: true,
      players: {
        create: gamePlayers,
      },
      rounds: {
        create: {
          number: 1,
          players: {
            create: roundPlayers,
          },
        },
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
