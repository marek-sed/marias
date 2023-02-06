import type { GameType } from "./types";

const gameTypeTranslations: Record<GameType, string> = {
  betl: "betl",
  durch: "durch",
  color: "farba",
  hundred: "stovka",
};

export function translateGameType(type: GameType) {
  return gameTypeTranslations[type];
}
