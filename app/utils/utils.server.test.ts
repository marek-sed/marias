import { Marriage, Seven } from "@prisma/client";
import { WorkerContext } from "vitest";
import { MarriageType } from "./types";
import {
  playerPositionToRole,
  marriageToPoints,
  calculateColorGamePoints,
  costOfColorGame,
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

describe("marriageToPoints", () => {
  test("should return 0 when no marriage was called", () => {
    expect(
      marriageToPoints({
        club: false,
        heart: false,
        diamond: false,
        spade: false,
      })
    ).toBe(0);
  });

  test("should return 20 when not heart marriage was called", () => {
    expect(
      marriageToPoints({
        club: false,
        heart: false,
        diamond: true,
        spade: false,
      })
    ).toBe(20);
  });

  test("should return 40 when not heart marriage was called", () => {
    expect(
      marriageToPoints({
        club: false,
        heart: true,
        diamond: false,
        spade: false,
      })
    ).toBe(40);
  });

  test("should return 100 when all marriages have been called", () => {
    expect(
      marriageToPoints({
        club: true,
        heart: true,
        diamond: true,
        spade: true,
      })
    ).toBe(100);
  });
});

describe("color game", () => {
  const g = (flekCount: number, points: number, gameOfHearts: boolean) => ({
    flekCount,
    points,
    gameOfHearts,
  });
  const m = (
    heart: boolean,
    spade: boolean,
    club: boolean,
    diamond: boolean,
    role: "player" | "opposition"
  ) => ({ spade, club, diamond, heart, role });
  const s =
    (silent: boolean, won: boolean) => (role: "player" | "opposition") =>
      ({
        silent,
        won,
        role,
      } as Pick<Seven, "role" | "silent" | "won">);

  const ssw = s(true, true);
  const ssl = s(true, false);
  const sw = s(false, true);
  const sl = s(false, false);

  const rates = {
    game: 1,
    seven: 2,
  };
  test("flek 0", () => {
    const marriages: MarriageType[] = [];
    const w = sw("player");
    const l = sl("player");

    expect(costOfColorGame(g(0, 0, false), rates, marriages)).toBe(1);
    expect(costOfColorGame(g(0, 0, false), rates, marriages)).toBe(1);
    expect(costOfColorGame(g(0, 0, true), rates, marriages)).toBe(2);
    expect(costOfColorGame(g(0, 0, true), rates, marriages)).toBe(2);

    expect(costOfColorGame(g(0, 0, false), rates, marriages, w)).toBe(3);
    expect(costOfColorGame(g(0, 0, false), rates, marriages, l)).toBe(-1);
    expect(costOfColorGame(g(0, 0, true), rates, marriages, w)).toBe(6);
    expect(costOfColorGame(g(0, 0, true), rates, marriages, l)).toBe(-2);
  });

  test("flek 1, 0 marriages", () => {
    const noMarriages: MarriageType[] = [];
    expect(costOfColorGame(g(1, 50, false), rates, noMarriages)).toBe(2);
    expect(costOfColorGame(g(1, 50, true), rates, noMarriages)).toBe(4);
    expect(costOfColorGame(g(1, 40, false), rates, noMarriages)).toBe(-2);
    expect(costOfColorGame(g(1, 40, true), rates, noMarriages)).toBe(-4);
  });

  test("flek 1 with marriages", () => {
    const pm1: MarriageType = m(true, false, false, false, "player");
    const om1: MarriageType = m(false, true, false, false, "opposition");

    const pm2: MarriageType = m(false, true, true, false, "player");
    const om2: MarriageType = m(false, true, true, false, "opposition");

    expect(costOfColorGame(g(1, 50, false), rates, [pm1, om1])).toBe(2);
    expect(costOfColorGame(g(1, 50, true), rates, [pm1, om1])).toBe(4);
    expect(costOfColorGame(g(1, 30, false), rates, [pm1, om1])).toBe(-2);
    expect(costOfColorGame(g(1, 30, true), rates, [pm1, om1])).toBe(-4);

    expect(costOfColorGame(g(1, 50, false), rates, [pm2, om2])).toBe(2);
    expect(costOfColorGame(g(1, 50, true), rates, [pm2, om2])).toBe(4);
    expect(costOfColorGame(g(1, 40, false), rates, [pm2, om2])).toBe(-2);
    expect(costOfColorGame(g(1, 40, true), rates, [pm2, om2])).toBe(-4);
  });
  test("flek 1 seven", () => {
    const nm: MarriageType[] = [];

    // normal
    expect(costOfColorGame(g(1, 50, false), rates, nm, ssw("player"))).toBe(3);
    expect(costOfColorGame(g(1, 50, false), rates, nm, ssw("opposition"))).toBe(
      1
    );

    expect(costOfColorGame(g(1, 50, false), rates, nm, ssl("player"))).toBe(1);
    expect(costOfColorGame(g(1, 50, false), rates, nm, ssl("opposition"))).toBe(
      3
    );

    expect(costOfColorGame(g(1, 50, false), rates, nm, sl("player"))).toBe(0);
    expect(costOfColorGame(g(1, 50, false), rates, nm, sw("player"))).toBe(4);
    expect(costOfColorGame(g(1, 50, false), rates, nm, sl("opposition"))).toBe(
      4
    );
    expect(costOfColorGame(g(1, 50, false), rates, nm, sw("opposition"))).toBe(
      0
    );

    // heart
    expect(costOfColorGame(g(1, 50, true), rates, nm, ssw("player"))).toBe(6);
    expect(costOfColorGame(g(1, 30, true), rates, nm, ssl("player"))).toBe(-6);
    expect(costOfColorGame(g(1, 50, true), rates, nm, sw("player"))).toBe(8);
    expect(costOfColorGame(g(1, 30, true), rates, nm, sl("player"))).toBe(-8);
  });

  test("flek 2", () => {
    const nm: MarriageType[] = [];

    expect(costOfColorGame(g(2, 50, true), rates, nm, ssw("player"))).toBe(6);
    expect(costOfColorGame(g(2, 30, true), rates, nm, ssl("player"))).toBe(-6);
    expect(costOfColorGame(g(2, 50, true), rates, nm, sw("player"))).toBe(8);
    expect(costOfColorGame(g(2, 30, true), rates, nm, sl("player"))).toBe(-8);
  });
});
