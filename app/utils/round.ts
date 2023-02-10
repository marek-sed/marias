import type {
  GameType,
  PrismaFullRound,
  Round,
  Seven,
} from "~/models/round.server";

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
      (round?.colorGameResult?.gameOfHearts ||
        round?.hundredGameResult?.gameOfHearts) ??
      false,
    flek: round?.colorGameResult?.flekCount ?? 0,
    contra: round?.hundredGameResult?.contra ?? false,
    points:
      (round?.colorGameResult?.points || round?.hundredGameResult?.points) ?? 0,
    marriagePlayer: round?.colorGameResult?.marriagePlayer ?? 0,
    marriageOpposition: round?.colorGameResult?.marriageOpposition || 0,
    seven: round?.seven,
    open: round?.trickGameResult?.open ?? false,
    won: round?.trickGameResult?.won ?? false,
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
        cost: 0,
        number,
        colorGameResult: {
          gameOfHearts: Boolean(form.get("gameOfHearts")),
          flekCount: parseInt(form.get("flek") as string, 10),
          points: parseInt(form.get("points") as string, 10),
          ...parseMarriageFormData(form),
        },
        seven: parseSevenFormData(form),
      };
      break;
    case "hundred":
      parsed = {
        gameType,
        playerId,
        cost: 0,
        number,
        hundredGameResult: {
          gameOfHearts: Boolean(form.get("gameOfHearts")),
          contra: Boolean(form.get("contra")),
          points: parseInt(form.get("points") as string, 10),
          //   ...parseMarriageFormData(form),
          marriages: [],
        },
        seven: parseSevenFormData(form),
      };
      break;
    case "betl":
    case "durch":
      parsed = {
        cost: 0,
        gameType,
        playerId,
        number,
        trickGameResult: {
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
