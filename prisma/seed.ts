import { PrismaClient, Table } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const initialStakes = {
  color: 1,
  seven: 2,
  hundred: 4,
  betl: 15,
  durch: 30,
} as const;

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.trickGameResult.deleteMany({});
  await prisma.round.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.game.deleteMany({});

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const player1 = await prisma.player.create({
    data: {
      name: "Maros",
    },
  });

  const player2 = await prisma.player.create({
    data: {
      name: "Roman",
    },
  });

  const player3 = await prisma.player.create({
    data: {
      name: "Igor",
    },
  });

  const game = await prisma.game.create({
    data: {
      rounds: {
        create: [],
      },
      players: {
        create: [
          {
            position: 1,
            player: {
              connect: {
                id: player1.id,
              },
            },
          },
          {
            position: 2,
            player: {
              connect: {
                id: player2.id,
              },
            },
          },
          {
            position: 3,
            player: {
              connect: {
                id: player3.id,
              },
            },
          },
        ],
      },
    },
  });

  const round1 = await prisma.round.create({
    data: {
      cost: 2,
      gameType: "color",
      number: 1,
      game: {
        connect: {
          id: game.id,
        },
      },
      player: {
        connect: {
          id: player3.id,
        },
      },
    },
  });

  const round2 = await prisma.round.create({
    data: {
      cost: 3,
      gameType: "hundred",
      number: 2,
      game: {
        connect: {
          id: game.id,
        },
      },
      player: {
        connect: {
          id: player3.id,
        },
      },
    },
  });

  const round3 = await prisma.round.create({
    data: {
      cost: -3,
      gameType: "color",
      number: 3,
      game: {
        connect: {
          id: game.id,
        },
      },
      player: {
        connect: {
          id: player3.id,
        },
      },
    },
  });
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
