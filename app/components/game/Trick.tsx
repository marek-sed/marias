import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { Field, Option } from "~/utils/types";
import { Checkbox } from "../checkbox";
import { FormControl } from "../formControl";
import { Select } from "../select";

type Props = {
  playedBy: Field<string>;
  playerOptions: Option[];
};
export const TrickGame = forwardRef<HTMLDivElement, Props>(
  ({ playedBy, playerOptions }, ref) => {
    return (
      <motion.div
        ref={ref}
        key="betldurch"
        className="space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          bounce: 0,
        }}
      >
        <FormControl name="player" label="Hru zahlasil" {...playedBy}>
          <Select placeholder="Kto hral sam?" options={playerOptions} />
        </FormControl>
        <FormControl label="Vylozeny" name="openTrickGame" defaultValue={false}>
          <Checkbox />
        </FormControl>
      </motion.div>
    );
  }
);

TrickGame.displayName = "TrickGame";
