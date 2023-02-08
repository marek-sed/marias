import type { Player, Round } from "@prisma/client";
import { useEffect, useRef } from "react";

export function useGameTheme(better: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rootRef.current?.style.setProperty(
      "--game-color",
      better ? "var(--bronze11)" : "var(--grass11)"
    );

    rootRef.current?.style.setProperty(
      "--game-color-hover",
      better ? "var(--bronze10)" : "var(--grass10)"
    );

    rootRef.current?.style.setProperty(
      "--game-color-active",
      better ? "var(--bronze11)" : "var(--grass12)"
    );

    rootRef.current?.style.setProperty(
      "--game-bg-color",
      better ? "var(--bronze1)" : "var(--grass1)"
    );

    rootRef.current?.style.setProperty(
      "--game-bg-hover-color",
      better ? "var(--bronze3)" : "var(--grass3)"
    );

    rootRef.current?.style.setProperty(
      "--game-bg-active-color",
      better ? "var(--bronze5)" : "var(--grass5)"
    );

    rootRef.current?.style.setProperty(
      "--game-border-color",
      better ? "var(--bronze6)" : "var(--grass6)"
    );

    rootRef.current?.style.setProperty(
      "--game-border-hover-color",
      better ? "var(--bronze8)" : "var(--grass8)"
    );
  }, [better]);

  return { rootRef };
}

export function calculateCosts(rounds: Round[], players: Player[]) {
  const costs: Record<string, number> = players.reduce(
    (acc, el) => ({
      ...acc,
      [el.id]: 0,
    }),
    {}
  );

  for (const r of rounds) {
    costs[r.playerId] += r.cost;
    for (const p of players) {
      if (p.id === r.playerId) continue;
      costs[p.id] += r.cost * -1;
    }
  }

  return costs;
}

export function calculateCostsPerRound(rounds: Round[], players: Player[]) {
  const costs: Record<string, number> = players.reduce(
    (acc, el) => ({
      ...acc,
      [el.id]: 0,
    }),
    {}
  );

  const costsPerRound = [];
  for (const r of rounds) {
    costs[r.playerId] += r.cost;
    for (const p of players) {
      if (p.id === r.playerId) continue;
      costs[p.id] += r.cost * -1;
    }
    costsPerRound.push({ ...costs });
  }

  return costsPerRound;
}

export function getGraphData(rounds: Round[], players: Player[]) {
  const costsPerRound = calculateCostsPerRound(rounds, players);

  const scores = costsPerRound.map((costs) => {
    return players.map((p) => costs[p.id]);
  });

  const byPlayerId = scores.reduce<
    Record<
      string,
      {
        chartType: "line";
        values: number[];
        name: string;
      }
    >
  >((acc, playerScores) => {
    players.forEach((p, iv) => {
      if (acc[p.id]) {
        acc[p.id].values.push(playerScores[iv]);
      } else {
        acc[p.id] = {
          name: p.name,
          values: [playerScores[iv]],
          chartType: "line",
        };
      }
    });
    return acc;
  }, {});

  return players.map((p) => byPlayerId[p.id]);
}
