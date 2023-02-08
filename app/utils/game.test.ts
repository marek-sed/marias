import type { Round } from "@prisma/client";
import { calculateCosts, getGraphData } from "./game";

describe("calculate current cost", () => {
  const players = Array(4)
    .fill(null)
    .map((_, i) => ({ id: `${i + 1}`, name: "" }));
  test("no rounds played", () => {
    const rounds: Round[] = [];

    expect(calculateCosts(rounds, players)).toEqual({
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
    });
  });

  test("one round played", () => {
    const rounds: Round[] = [
      {
        cost: 2,
        playerId: "1",
        number: 1,
        gameId: "dummyId",
        gameType: "color",
      },
    ];

    expect(calculateCosts(rounds, players)).toEqual({
      "1": 2,
      "2": -2,
      "3": -2,
      "4": -2,
    });
  });

  test("two rounds played", () => {
    const rounds: Round[] = [
      {
        cost: 2,
        playerId: "1",
        number: 1,
        gameId: "dummyId",
        gameType: "color",
      },
      {
        cost: -10,
        playerId: "3",
        number: 2,
        gameId: "dummyId",
        gameType: "durch",
      },
    ];

    expect(calculateCosts(rounds, players)).toEqual({
      "1": 12,
      "2": 8,
      "3": -12,
      "4": 8,
    });
  });

  test("three rounds played", () => {
    const rounds: Round[] = [
      {
        cost: 2,
        playerId: "1",
        number: 1,
        gameId: "dummyId",
        gameType: "color",
      },
      {
        cost: -10,
        playerId: "3",
        number: 2,
        gameId: "dummyId",
        gameType: "durch",
      },
      {
        cost: 8,
        playerId: "4",
        number: 2,
        gameId: "dummyId",
        gameType: "hundred",
      },
    ];

    expect(calculateCosts(rounds, players)).toEqual({
      "1": 4,
      "2": 0,
      "3": -20,
      "4": 16,
    });
  });
});

describe("graphData", () => {
  const players = [
    { id: "cldroi9lp0002rzt1wfcurgba", name: "Maros" },
    { id: "cldroi9lr0004rzt1ce4acltw", name: "Igor" },
    { id: "cldroi9lr0006rzt1xxqqvbh8", name: "Roman" },
  ];

  const rounds = [
    {
      playerId: "cldroi9lr0006rzt1xxqqvbh8",
      gameType: "color",
      cost: 2,
      number: 1,
      gameId: "cldroi9lt0008rzt17ybxgwce",
      player: {
        id: "cldroi9lr0006rzt1xxqqvbh8",
        name: "Igor",
      },
      HundredGameResult: null,
      ColorGameResult: null,
    },
    {
      playerId: "cldroi9lr0006rzt1xxqqvbh8",
      gameType: "hundred",
      cost: 3,
      number: 2,
      gameId: "cldroi9lt0008rzt17ybxgwce",
      player: {
        id: "cldroi9lr0006rzt1xxqqvbh8",
        name: "Igor",
      },
      HundredGameResult: null,
      ColorGameResult: null,
    },
    {
      playerId: "cldroi9lr0006rzt1xxqqvbh8",
      gameType: "color",
      cost: -3,
      number: 3,
      gameId: "cldroi9lt0008rzt17ybxgwce",
      player: {
        id: "cldroi9lr0006rzt1xxqqvbh8",
        name: "Igor",
      },
      HundredGameResult: null,
      ColorGameResult: null,
    },
    {
      playerId: "cldroi9lr0006rzt1xxqqvbh8",
      gameType: "color",
      cost: 1,
      number: 4,
      gameId: "cldroi9lt0008rzt17ybxgwce",
      player: {
        id: "cldroi9lr0006rzt1xxqqvbh8",
        name: "Igor",
      },
      HundredGameResult: null,
      ColorGameResult: {
        gameOfHearts: false,
      },
    },
    {
      playerId: "cldroi9lr0004rzt1ce4acltw",
      gameType: "hundred",
      cost: 4,
      number: 5,
      gameId: "cldroi9lt0008rzt17ybxgwce",
      player: {
        id: "cldroi9lr0004rzt1ce4acltw",
        name: "Roman",
      },
      HundredGameResult: {
        gameOfHearts: false,
      },
      ColorGameResult: null,
    },
    {
      playerId: "cldroi9lp0002rzt1wfcurgba",
      gameType: "betl",
      cost: -15,
      number: 6,
      gameId: "cldroi9lt0008rzt17ybxgwce",
      player: {
        id: "cldroi9lp0002rzt1wfcurgba",
        name: "Maros",
      },
      HundredGameResult: null,
      ColorGameResult: null,
    },
    {
      playerId: "cldroi9lr0006rzt1xxqqvbh8",
      gameType: "durch",
      cost: -30,
      number: 7,
      gameId: "cldroi9lt0008rzt17ybxgwce",
      player: {
        id: "cldroi9lr0006rzt1xxqqvbh8",
        name: "Igor",
      },
      HundredGameResult: null,
      ColorGameResult: null,
    },
    {
      playerId: "cldroi9lr0004rzt1ce4acltw",
      gameType: "color",
      cost: 1,
      number: 8,
      gameId: "cldroi9lt0008rzt17ybxgwce",
      player: {
        id: "cldroi9lr0004rzt1ce4acltw",
        name: "Roman",
      },
      HundredGameResult: null,
      ColorGameResult: {
        gameOfHearts: false,
      },
    },
  ];

  test("graph data", () => {
    expect(getGraphData(rounds, players)).toMatchInlineSnapshot(`
      [
        {
          "chartType": "line",
          "name": "Maros",
          "values": [
            -2,
            -5,
            -2,
            -3,
            -7,
            -22,
            8,
            7,
          ],
        },
        {
          "chartType": "line",
          "name": "Igor",
          "values": [
            -2,
            -5,
            -2,
            -3,
            1,
            16,
            46,
            47,
          ],
        },
        {
          "chartType": "line",
          "name": "Roman",
          "values": [
            2,
            5,
            2,
            3,
            -1,
            14,
            -16,
            -17,
          ],
        },
      ]
    `);
  });
});
