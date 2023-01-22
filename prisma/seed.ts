import { PlayerInGame, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const initialStakes = {
  game: 1,
  betterGame: 2,
  seven: 2,
  betterSeven: 4,
  hundred: 4,
  betterHundred: 8,
  hundredSeven: 6,
  betl: 15,
  durch: 30,
} as const;

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.round.deleteMany({});
  await prisma.playerInGame.deleteMany({});
  await prisma.playerInRound.deleteMany({});
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

  await prisma.stake.create({ data: initialStakes });

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
            totalScore: 10,
            player: {
              connect: {
                id: player1.id,
              },
            },
          },
          {
            position: 2,
            totalScore: 24,
            player: {
              connect: {
                id: player2.id,
              },
            },
          },
          {
            position: 3,
            totalScore: 17,
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
      number: 1,
      game: {
        connect: {
          id: game.id,
        },
      },
      players: {
        create: [
          {
            score: 10,
            player: {
              connect: {
                id: player1.id,
              },
            },
          },
          {
            score: 14,
            player: {
              connect: {
                id: player2.id,
              },
            },
          },
          {
            score: 18,
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

  const round2 = await prisma.round.create({
    data: {
      number: 2,
      game: {
        connect: {
          id: game.id,
        },
      },
      players: {
        create: [
          {
            score: 10,
            player: {
              connect: {
                id: player1.id,
              },
            },
          },
          {
            score: 14,
            player: {
              connect: {
                id: player2.id,
              },
            },
          },
          {
            score: 18,
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

  const round3 = await prisma.round.create({
    data: {
      number: 3,
      game: {
        connect: {
          id: game.id,
        },
      },
      players: {
        create: [
          {
            score: 10,
            player: {
              connect: {
                id: player1.id,
              },
            },
          },
          {
            score: 14,
            player: {
              connect: {
                id: player2.id,
              },
            },
          },
          {
            score: 18,
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
