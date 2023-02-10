import { prisma } from "~/db.server";

export async function getPlayersAtTable(gameId: string) {
  return prisma.gameTable.findMany({
    where: {
      gameId,
    },
    include: {
      player: true,
    },
  });
}
