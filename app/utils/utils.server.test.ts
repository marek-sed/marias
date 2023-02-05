import {
  playerPositionToRole,
  getColorGameCost,
  costOfTrickGame,
  getSevenCost,
  costOfHundredGame,
} from "./utils.server";

test("position 0 to role in rounds", () => {
  expect(playerPositionToRole(0, 0)).toBe(0);
  expect(playerPositionToRole(0, 1)).toBe(1);
  expect(playerPositionToRole(0, 2)).toBe(2);
  expect(playerPositionToRole(0, 3)).toBe(3);
  expect(playerPositionToRole(0, 4)).toBe(0);
});

test("position 1 to role in rounds", () => {
  expect(playerPositionToRole(1, 0)).toBe(1);
  expect(playerPositionToRole(1, 1)).toBe(2);
  expect(playerPositionToRole(1, 2)).toBe(3);
  expect(playerPositionToRole(1, 3)).toBe(0);
  expect(playerPositionToRole(1, 4)).toBe(1);
});

test("position 2 to role in rounds", () => {
  expect(playerPositionToRole(2, 0)).toBe(2);
  expect(playerPositionToRole(2, 1)).toBe(3);
  expect(playerPositionToRole(2, 2)).toBe(0);
  expect(playerPositionToRole(2, 3)).toBe(1);
  expect(playerPositionToRole(2, 4)).toBe(2);
});

test("position 3 to role in rounds", () => {
  expect(playerPositionToRole(3, 0)).toBe(3);
  expect(playerPositionToRole(3, 1)).toBe(0);
  expect(playerPositionToRole(3, 2)).toBe(1);
  expect(playerPositionToRole(3, 3)).toBe(2);
  expect(playerPositionToRole(3, 4)).toBe(3);
});

describe("color game cost", () => {
  const g = (
    flekCount: number,
    points: number,
    gameOfHearts: boolean,
    marriagePlayer = 0,
    marriageOpposition = 0
  ) => ({
    flekCount,
    points,
    gameOfHearts,
    marriagePlayer,
    marriageOpposition,
  });

  test("won - color game", () => {
    expect(getColorGameCost(g(0, 50, false))).toBe(1);
    expect(getColorGameCost(g(0, 50, true))).toBe(2);
    expect(getColorGameCost(g(1, 50, false))).toBe(2);
    expect(getColorGameCost(g(1, 50, true))).toBe(4);
    expect(getColorGameCost(g(2, 50, false))).toBe(4);
    expect(getColorGameCost(g(2, 50, true))).toBe(8);
    expect(getColorGameCost(g(3, 50, false))).toBe(8);
    expect(getColorGameCost(g(3, 50, true))).toBe(16);
  });

  test("won - hundred and more points", () => {
    expect(getColorGameCost(g(1, 40, false, 60, 20))).toBe(4);
    expect(getColorGameCost(g(1, 50, false, 60, 20))).toBe(8);
    expect(getColorGameCost(g(1, 40, false, 80, 20))).toBe(16);
    expect(getColorGameCost(g(1, 40, true, 60, 20))).toBe(8);
    expect(getColorGameCost(g(1, 50, true, 60, 20))).toBe(16);
    expect(getColorGameCost(g(1, 40, true, 80, 20))).toBe(32);
  });

  test("loss - color game", () => {
    expect(getColorGameCost(g(0, 40, false))).toBe(-1);
    expect(getColorGameCost(g(0, 40, true))).toBe(-2);
    expect(getColorGameCost(g(1, 40, false))).toBe(-2);
    expect(getColorGameCost(g(1, 40, true))).toBe(-4);
    expect(getColorGameCost(g(2, 40, false))).toBe(-4);
    expect(getColorGameCost(g(2, 40, true))).toBe(-8);
    expect(getColorGameCost(g(3, 40, false))).toBe(-8);
    expect(getColorGameCost(g(3, 40, true))).toBe(-16);
  });

  test("loss 100 game", () => {
    expect(getColorGameCost(g(1, 50, false, 40, 60))).toBe(-4);
    expect(getColorGameCost(g(1, 60, false, 20, 80))).toBe(-8);
    expect(getColorGameCost(g(1, 50, false, 20, 80))).toBe(-16);

    expect(getColorGameCost(g(1, 50, true, 40, 60))).toBe(-8);
    expect(getColorGameCost(g(1, 60, true, 20, 80))).toBe(-16);
    expect(getColorGameCost(g(1, 50, true, 20, 80))).toBe(-32);
  });
});

describe("seven cost", () => {
  const s = (
    flekCount: number,
    won: boolean,
    silent = false,
    role: "player" | "opposition" = "player"
  ) => ({
    flekCount,
    won,
    silent,
    role,
  });

  test("silent game is independent of flekCount", () => {
    expect(getSevenCost(s(0, true, true))).toBe(1);
    expect(getSevenCost(s(1, true, true))).toBe(1);
    expect(getSevenCost(s(2, true, true))).toBe(1);
    expect(getSevenCost(s(3, true, true))).toBe(1);
    expect(getSevenCost(s(4, true, true))).toBe(1);
    expect(getSevenCost(s(5, true, true))).toBe(1);
  });

  test("player - normal game", () => {
    expect(getSevenCost(s(0, true, true))).toBe(1);
    expect(getSevenCost(s(0, true, false))).toBe(2);

    expect(getSevenCost(s(1, true, true))).toBe(1);
    expect(getSevenCost(s(1, true, false))).toBe(4);

    expect(getSevenCost(s(2, false, true))).toBe(-1);
    expect(getSevenCost(s(2, false, false))).toBe(-8);
  });
  test("player - seven game of hearts", () => {
    expect(getSevenCost(s(0, true, true), true)).toBe(2);
    expect(getSevenCost(s(0, true, false), true)).toBe(4);

    expect(getSevenCost(s(1, true, true), true)).toBe(2);
    expect(getSevenCost(s(1, true, false), true)).toBe(8);

    expect(getSevenCost(s(2, false, true), true)).toBe(-2);
    expect(getSevenCost(s(2, false, false), true)).toBe(-16);

    expect(getSevenCost(s(3, false, true), true)).toBe(-2);
    expect(getSevenCost(s(3, false, false), true)).toBe(-32);
  });

  test("opposition - normal game", () => {
    expect(getSevenCost(s(0, true, true, "opposition"))).toBe(-1);
    expect(getSevenCost(s(0, true, false, "opposition"))).toBe(-2);

    expect(getSevenCost(s(1, true, true, "opposition"))).toBe(-1);
    expect(getSevenCost(s(1, true, false, "opposition"))).toBe(-4);

    expect(getSevenCost(s(2, false, true, "opposition"))).toBe(1);
    expect(getSevenCost(s(2, false, false, "opposition"))).toBe(8);
  });
  test("opposition - seven game of hearts", () => {
    expect(getSevenCost(s(0, true, true, "opposition"), true)).toBe(-2);
    expect(getSevenCost(s(0, true, false, "opposition"), true)).toBe(-4);

    expect(getSevenCost(s(1, true, true, "opposition"), true)).toBe(-2);
    expect(getSevenCost(s(1, true, false, "opposition"), true)).toBe(-8);

    expect(getSevenCost(s(2, false, true, "opposition"), true)).toBe(2);
    expect(getSevenCost(s(2, false, false, "opposition"), true)).toBe(16);

    expect(getSevenCost(s(3, false, true, "opposition"), true)).toBe(2);
    expect(getSevenCost(s(3, false, false, "opposition"), false)).toBe(16);
  });
});

describe("hundred round cost", () => {
  test("hundred", () => {
    expect(
      costOfHundredGame(
        {
          contra: false,
          gameOfHearts: false,
          marriageOpposition: 20,
          marriagePlayer: 60,
          points: 40,
          gameId: "",
          roundNumber: 1,
        },
        undefined
      )
    ).toBe(8);
  });

  test("hundred hearts", () => {
    expect(
      costOfHundredGame(
        {
          contra: false,
          gameOfHearts: true,
          marriageOpposition: 20,
          marriagePlayer: 60,
          points: 40,
          gameId: "",
          roundNumber: 1,
        },
        undefined
      )
    ).toBe(16);
  });

  test("hundred contra", () => {
    expect(
      costOfHundredGame(
        {
          contra: true,
          gameOfHearts: false,
          marriageOpposition: 20,
          marriagePlayer: 60,
          points: 40,
          gameId: "",
          roundNumber: 1,
        },
        undefined
      )
    ).toBe(-8);
  });

  test("hundred overflow", () => {
    expect(
      costOfHundredGame(
        {
          contra: false,
          gameOfHearts: false,
          marriageOpposition: 20,
          marriagePlayer: 80,
          points: 40,
          gameId: "",
          roundNumber: 1,
        },
        undefined
      )
    ).toBe(32);
  });
});

describe("trick round cost", () => {
  test("betl cost", () => {
    expect(
      costOfTrickGame("betl", {
        open: false,
        won: true,
      })
    ).toBe(15);
    expect(
      costOfTrickGame("betl", {
        open: true,
        won: true,
      })
    ).toBe(30);
    expect(
      costOfTrickGame("betl", {
        open: false,
        won: false,
      })
    ).toBe(-15);
    expect(
      costOfTrickGame("betl", {
        open: true,
        won: false,
      })
    ).toBe(-30);
  });

  test("durch cost", () => {
    expect(
      costOfTrickGame("durch", {
        open: false,
        won: true,
      })
    ).toBe(30);
    expect(
      costOfTrickGame("durch", {
        open: true,
        won: true,
      })
    ).toBe(60);
    expect(
      costOfTrickGame("durch", {
        open: false,
        won: false,
      })
    ).toBe(-30);
    expect(
      costOfTrickGame("durch", {
        open: true,
        won: false,
      })
    ).toBe(-60);
  });
});
