import { motion } from "framer-motion";
import { forwardRef, useState } from "react";
import type { Field, IndeterminateBool, MarriageType } from "~/utils/types";
import { Checkbox } from "../checkbox";
import { FormControl } from "../formControl";
import { HeartBox } from "../heartBox";
import { SevenBox, SevenProvider } from "./seven";
import { Input } from "../input";
import { Fieldset } from "../fieldset";
import { Marriage, MarriageProvider } from "../marriage";

type Props = {
  called: string;
  counter100: Field<boolean>;
  better: Field<boolean>;
  flek: Field<number>;
};
export const ColorGame = forwardRef<HTMLDivElement, Props>(
  ({ called, counter100, better, flek }: Props, ref) => {
    return (
      <motion.div
        ref={ref}
        key="gamehundred"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          bounce: 0,
        }}
      >
        {called === "hundred" && (
          <FormControl name="players" label="Proti" {...counter100}>
            <Checkbox />
          </FormControl>
        )}

        <div className="w-full items-center space-y-4 pt-8">
          <FormControl
            direction="horizontal"
            label="Cerven"
            name="better"
            {...better}
          >
            <HeartBox />
          </FormControl>

          <FormControl
            direction="horizontal"
            name="flek"
            label="Flek"
            {...flek}
          >
            <Input color="game" step={1} max={10} type="number" />
          </FormControl>
        </div>
      </motion.div>
    );
  }
);

ColorGame.displayName = "ColorGame";

type PlayedProps = {
  legend?: string;
  seven: Field<IndeterminateBool> | undefined;
  points: Field<number>;
  marriage: Field<MarriageType[]>;
};
function Player({ legend, marriage, seven, points }: PlayedProps) {
  return (
    <Fieldset animated legend={legend}>
      <div className="flex flex-col items-center space-y-4">
        <FormControl name="actorSeven" label="Sedma" {...seven}>
          <SevenBox playedBy="actor" />
        </FormControl>

        <FormControl name="mariage" label="Hlasky" {...marriage}>
          <Marriage playedBy="actor" />
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
  seven: Field<IndeterminateBool> | undefined;
  married: MarriageType[];
  points: number;
};
function Opposition({ legend, seven, points }: OppositionProps) {
  const [marriage, setMarriage] = useState<MarriageType[]>([]);

  return (
    <Fieldset animated legend={legend}>
      <div className="flex flex-col items-center space-y-4">
        <FormControl name="oppositionSeven" label="Sedma" {...seven}>
          <SevenBox playedBy="opposition" />
        </FormControl>

        <FormControl
          name="mariage"
          label="Hlasky"
          value={marriage}
          onChange={setMarriage}
        >
          <Marriage playedBy="opposition" />
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

type ColorResultProps = {
  player: {
    label: string | undefined;
  };
  opposition: {
    label: string | undefined;
  };
};
export function ColorResult({ player, opposition }: ColorResultProps) {
  const [seven, setSeven] = useState<IndeterminateBool>("indeterminate");
  const [oppositionSeven, setOppositionSeven] =
    useState<IndeterminateBool>("indeterminate");
  const [points, setPoints] = useState<number>(50);
  const [marriage, setMarriage] = useState<MarriageType[]>([]);

  return (
    <MarriageProvider>
      <SevenProvider>
        <Player
          legend={player.label!}
          points={{ value: points, onChange: setPoints }}
          seven={{ value: seven, onChange: setSeven }}
          marriage={{ value: marriage, onChange: setMarriage }}
        />
        <Opposition
          legend={opposition.label!}
          points={90 - points}
          married={marriage}
          seven={{
            value: oppositionSeven,
            onChange: setOppositionSeven,
          }}
        />
      </SevenProvider>
    </MarriageProvider>
  );
}
