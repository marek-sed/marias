import type { Field } from "~/utils/types";
import type { MarriageSymbol, Seven as SevenType } from "~/models/round.server";
import { useState } from "react";
import { FormControl } from "../formControl";
import { Seven, SevenProvider } from "./seven";
import { Input } from "../input";
import { Fieldset } from "../fieldset";
import { MarriageSymbols, MarriageSymbolsProvider } from "../marriageSymbols";

type PlayedProps = {
  legend?: string;
  points: Field<number>;
  seven?: SevenType;
};
function Player({ legend, points }: PlayedProps) {
  return (
    <Fieldset animated legend={legend}>
      <div className="flex flex-col items-center space-y-4">
        <Seven playedBy="player" />

        <FormControl name="mariage.player" label="Hlasky">
          <MarriageSymbols playedBy="player" />
        </FormControl>

        <FormControl name="points" label="Body" {...points}>
          <Input type="number" min={0} max={90} step={10} />
        </FormControl>
      </div>
    </Fieldset>
  );
}

type OppositionProps = {
  legend: string;
  points: number;
  seven?: SevenType;
};
function Opposition({ legend, points }: OppositionProps) {
  return (
    <Fieldset animated legend={legend}>
      <div className="flex flex-col items-center space-y-4">
        <Seven playedBy="opposition" />

        <FormControl name="mariage.opposition" label="Hlasky">
          <MarriageSymbols playedBy="opposition" />
        </FormControl>

        <FormControl name="points" label="Body">
          <div className="flex h-11 w-11 cursor-not-allowed items-center justify-center border-2 border-gray-4 bg-gray-2 text-gray-11">
            {points}
          </div>
        </FormControl>
      </div>
    </Fieldset>
  );
}

type HundredResultProps = {
  player: {
    label: string | undefined;
    seven?: SevenType;
    marriage: MarriageSymbol[];
    points: number;
  };
  opposition: {
    label: string | undefined;
    seven?: SevenType;
    marriage: MarriageSymbol[];
  };
};
export function HundredResult({ player, opposition }: HundredResultProps) {
  const [points, setPoints] = useState<number>(player.points);

  console.log("init", player, opposition);

  return (
    <MarriageSymbolsProvider
      initialValues={{
        player: player.marriage,
        opposition: opposition.marriage,
      }}
    >
      <SevenProvider
        initialValues={{
          player: player.seven?.role === "player" ? player.seven : undefined,
          opposition:
            opposition.seven?.role === "opposition"
              ? opposition.seven
              : undefined,
        }}
      >
        <Player
          legend={player.label!}
          points={{ value: points, onChange: setPoints }}
          seven={player.seven}
        />
        <Opposition
          legend={opposition.label!}
          points={90 - points}
          seven={player.seven}
        />
      </SevenProvider>
    </MarriageSymbolsProvider>
  );
}
