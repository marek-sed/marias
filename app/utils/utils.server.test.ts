import { playerPositionToRole } from "./utils.server";

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
