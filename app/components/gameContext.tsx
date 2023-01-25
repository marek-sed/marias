import { createContext, useContext } from "react";

type ContextType = {
  type: "default" | "better";
};
const Context = createContext<ContextType>({ type: "default" });

export function useGameContext() {
  return useContext(Context);
}

export const GameContext = Context.Provider;
