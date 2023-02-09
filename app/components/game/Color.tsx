import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useState } from "react";
import type { Field } from "~/utils/types";
import { Checkbox } from "../checkbox";
import { FormControl } from "../formControl";
import { HeartBox } from "../heartBox";
import { Seven, SevenProvider } from "./seven";
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
        <div className="w-full items-center space-y-4 pt-8">
          <FormControl
            name="gameOfHearts"
            direction="horizontal"
            label="Cerven"
            {...better}
          >
            <HeartBox />
          </FormControl>

          <AnimatePresence mode="wait" initial={false}>
            {called === "color" ? (
              <motion.div
                key="color"
                exit={{ opacity: 0, y: 24 }}
                initial={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.2 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FormControl
                  direction="horizontal"
                  name="flek"
                  label="Flek"
                  {...flek}
                >
                  <Input color="game" step={1} max={10} type="number" />
                </FormControl>
              </motion.div>
            ) : (
              <motion.div
                key="hundred"
                exit={{ opacity: 0, y: 24 }}
                initial={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.2 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-0.5"
              >
                <FormControl name="contra" label="Proti" {...counter100}>
                  <Checkbox />
                </FormControl>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
);

ColorGame.displayName = "ColorGame";

type PlayedProps = {
  legend?: string;
  points: Field<number>;
};
function Player({ legend, points }: PlayedProps) {
  return (
    <Fieldset animated legend={legend}>
      <div className="flex flex-col items-center space-y-4">
        <Seven playedBy="player" />

        <FormControl name="mariage.player" label="Hlasky">
          <Marriage playedBy="player" />
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
};
function Opposition({ legend, points }: OppositionProps) {
  return (
    <Fieldset animated legend={legend}>
      <div className="flex flex-col items-center space-y-4">
        <Seven playedBy="opposition" />

        <FormControl name="mariage.opposition" label="Hlasky">
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
    marriage: number;
    points: number;
  };
  opposition: {
    label: string | undefined;
    marriage: number;
  };
};
export function ColorResult({ player, opposition }: ColorResultProps) {
  const [points, setPoints] = useState<number>(player.points);

  return (
    <MarriageProvider
      initialValues={{
        player: player.marriage,
        opposition: opposition.marriage,
      }}
    >
      <SevenProvider>
        <Player
          legend={player.label!}
          points={{ value: points, onChange: setPoints }}
        />
        <Opposition legend={opposition.label!} points={90 - points} />
      </SevenProvider>
    </MarriageProvider>
  );
}
