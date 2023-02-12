import type { Round, Player } from "@prisma/client";
import { useEffect, useRef } from "react";
import { getGraphData } from "~/utils/game";

const { Chart } = require("frappe-charts/dist/frappe-charts.min.cjs");

type Props = {
  rounds: Round[];
  players: Player[];
};

export function GameChart({ rounds, players }: Props) {
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      const labels = rounds
        .concat(rounds)
        .concat(rounds)
        .map((r, i) => `${i + 1}`);
      const graphData = getGraphData(
        rounds.concat(rounds).concat(rounds),
        players
      );

      const c1 = getComputedStyle(document.documentElement).getPropertyValue(
        "--indigo11"
      );

      const c2 = getComputedStyle(document.documentElement).getPropertyValue(
        "--tomato11"
      );

      const c3 = getComputedStyle(document.documentElement).getPropertyValue(
        "--teal11"
      );

      const c4 = getComputedStyle(document.documentElement).getPropertyValue(
        "--amber11"
      );

      const chart = new Chart("#chart", {
        title: "",
        height: 320,
        axisOptions: {
          xAxisMode: "tick",
          yAxisMode: "tick",
          xIsSeries: true,
        },
        lineOptions: {
          hideDots: true,
        },
        tooltipOptions: {
          valuesOverPoints: 1,
          formatTooltipX: (d: unknown) => ("Kolo " + d).toUpperCase(),
          formatTooltipY: (d: unknown) => d + " pts",
        },
        data: {
          datasets: graphData,
          labels,
        },
        type: "line",
        colors: [c1, c2, c3, c4],
      });
    }

    return () => {
      mounted.current = true;
    };
  }, [rounds, players]);

  return (
    <div className="frappe-chart rounded border-2 border-gray-6 bg-gray-2">
      <div id="chart" style={{ opacity: "1", zIndex: "9999" }} />
    </div>
  );
}
