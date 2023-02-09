import type {
  Round as PrismaRound,
  ColorGameResult as PrismaColorGameResult,
  HundredGameResult as PrismaHundredGameResult,
  TrickGameResult as PrismaTrickGameResult,
  Seven as PrismaSeven,
} from "@prisma/client";

type PrismaFullRound = PrismaRound & {
  ColorGameResult?: PrismaColorGameResult & { seven?: PrismaSeven | null };
  HundredGameResult?: PrismaHundredGameResult & { seven?: PrismaSeven | null };
  TrickGameResult?: PrismaTrickGameResult;
};

type ColorGameResult = Omit<PrismaColorGameResult, "gameId" | "roundNumber"> & {
  seven?: Seven | null;
};
type HundredGameResult = Omit<
  PrismaHundredGameResult,
  "gameId" | "roundNumber"
> & {
  seven?: Seven | null;
};

type TrickGameResult = Omit<PrismaTrickGameResult, "gameId" | "roundNumber">;

type Seven = Omit<PrismaSeven, "gameId" | "roundNumber">;
export type GameType = "color" | "hundred" | "betl" | "durch";
type RoundBase = Omit<PrismaRound, "cost" | "gameId">;

export type ColorGameRound = RoundBase & {
  gameType: "color";
  ColorGameResult: ColorGameResult;
};
export type HundredGameRound = RoundBase & {
  gameType: "hundred";
  HundredGameResult: HundredGameResult;
};
export type BetlGameRound = RoundBase & {
  gameType: "betl";
  TrickGameResult: TrickGameResult;
};
export type DurchGameRound = RoundBase & {
  gameType: "durch";
  TrickGameResult: TrickGameResult;
};

export type Round =
  | ColorGameRound
  | HundredGameRound
  | BetlGameRound
  | DurchGameRound;

type RoundValues = {
  roundNumber: number | undefined;
  gameType: GameType;
  gameOfHearts: boolean;
  playerId: string;
  contra: boolean;
  points: number;
  flek: number;
  marriagePlayer: number;
  marriageOpposition: number;
  seven: Seven | undefined | null;
  open: boolean;
  won: boolean;
};
export function getRoundInitialValues(
  round: PrismaFullRound | undefined,
  fallback: { nextRoundNUmber: number; actorId: string }
) {
  const initialValues: RoundValues = {
    gameType: (round?.gameType as GameType) ?? "color",
    roundNumber: round?.number ?? fallback.nextRoundNUmber,
    playerId: round?.playerId ?? fallback.actorId,
    gameOfHearts:
      (round?.ColorGameResult?.gameOfHearts ||
        round?.HundredGameResult?.gameOfHearts) ??
      false,
    flek: round?.ColorGameResult?.flekCount ?? 0,
    contra: round?.HundredGameResult?.contra ?? false,
    points:
      (round?.ColorGameResult?.points || round?.HundredGameResult?.points) ?? 0,
    marriagePlayer:
      (round?.ColorGameResult?.marriagePlayer ||
        round?.HundredGameResult?.marriagePlayer) ??
      0,
    marriageOpposition:
      (round?.ColorGameResult?.marriageOpposition ||
        round?.HundredGameResult?.marriageOpposition) ??
      0,
    seven: round?.ColorGameResult?.seven,
    open: false,
    won: false,
  };

  return initialValues;
}

export function parseRoundFormData(form: FormData) {
  const gameType = form.get("gameType") as GameType;
  const playerId = form.get("playedBy") as string;
  const roundNumberStr = form.get("roundNumber") as string;
  const number = parseInt(roundNumberStr, 10);

  let parsed: Round;
  switch (gameType) {
    case "color":
      parsed = {
        gameType,
        playerId,
        number,
        ColorGameResult: {
          gameOfHearts: Boolean(form.get("gameOfHearts")),
          flekCount: parseInt(form.get("flek") as string, 10),
          points: parseInt(form.get("points") as string, 10),
          ...parseMarriageFormData(form),
          seven: parseSevenFormData(form),
        },
      };
      break;
    case "hundred":
      parsed = {
        gameType,
        playerId,
        number,
        HundredGameResult: {
          gameOfHearts: Boolean(form.get("gameOfHearts")),
          contra: Boolean(form.get("contra")),
          points: parseInt(form.get("points") as string, 10),
          ...parseMarriageFormData(form),
          seven: parseSevenFormData(form),
        },
      };
      break;
    case "betl":
    case "durch":
      parsed = {
        gameType,
        playerId,
        number,
        TrickGameResult: {
          open: Boolean(form.get("open")),
          won: Boolean(form.get("won")),
        },
      };
  }

  return parsed;
}

export function parseMarriageFormData(form: FormData) {
  const marriageOpposition = parseInt(
    form.get("marriage.opposition") as string,
    10
  );
  const marriagePlayer = parseInt(form.get("marriage.player") as string, 10);

  return {
    marriageOpposition,
    marriagePlayer,
  };
}

export function parseSevenFormData(form: FormData) {
  const seven = form.getAll("seven.player");
  const oppositionSeven = form.getAll("seven.opposition");

  const sevenRole = seven.length
    ? "player"
    : oppositionSeven.length
    ? "opposition"
    : null;

  if (sevenRole === "player") {
    const silent = seven.includes("silent");
    const won = seven.includes("won");
    const flekCount = silent ? 0 : parseInt(seven[1] as string, 10);
    return {
      silent,
      won,
      role: sevenRole,
      flekCount,
    };
  } else if (sevenRole === "opposition") {
    const silent = oppositionSeven.includes("silent");
    const won = oppositionSeven.includes("won");
    const flekCount = silent ? 0 : parseInt(oppositionSeven[1] as string, 10);
    return {
      silent,
      won,
      role: sevenRole,
      flekCount,
    };
  }

  return undefined;
}
