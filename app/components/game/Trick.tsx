import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { Field, Option } from "~/utils/types";
import { Checkbox } from "../checkbox";
import { Fieldset } from "../fieldset";
import { FormControl } from "../formControl";
import { Select } from "../select";

type Props = {
  playedBy: Field<string>;
  playerOptions: Option[];
  open: boolean;
};
export const TrickGame = forwardRef<HTMLDivElement, Props>(
  ({ playedBy, open, playerOptions }, ref) => {
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
        <FormControl name="playedBy" label="Hru zahlasil" {...playedBy}>
          <Select options={playerOptions} />
        </FormControl>
        <FormControl name="open" label="Vylozeny" defaultValue={open}>
          <Checkbox />
        </FormControl>
      </motion.div>
    );
  }
);

TrickGame.displayName = "TrickGame";

export function TrickResult({
  playedBy,
  won,
}: {
  playedBy?: string;
  won: boolean;
}) {
  return (
    <Fieldset animated legend={playedBy}>
      <FormControl name="won" label="Vyhral" defaultValue={won}>
        <Checkbox />
      </FormControl>
    </Fieldset>
  );
}
