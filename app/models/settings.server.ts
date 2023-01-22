import type { Stake, Player } from "@prisma/client";
import { prisma } from "~/db.server";

export type GameType = Extract<keyof Omit<Stake, "id">, string>;

export async function getPlayers() {
  return prisma.player.findMany();
}

export async function getPlayerCount() {
  return prisma.player.count();
}

export type PlayerPayload = Omit<Player, "id"> & { id?: string };
export async function savePlayers(payload: PlayerPayload[]) {
  for (const player of payload) {
    if (player.id) {
      await prisma.player.update({
        where: { id: player.id },
        data: {
          name: player.name,
          position: player.position,
        },
      });
    } else {
      await prisma.player.create({
        data: {
          name: player.name,
          position: player.position,
        },
      });
    }
  }
}

// Stakes

export async function getStakes() {
  return prisma.stake.findFirst();
}

export async function saveStakes(payload: Stake) {
  return prisma.stake.update({
    data: payload,
    where: { id: payload.id },
  });
}
