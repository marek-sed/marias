import { useEffect, useRef } from "react";

export function useGameTheme(better: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rootRef.current?.style.setProperty(
      "--game-color",
      better ? "var(--bronze11)" : "var(--grass9)"
    );

    rootRef.current?.style.setProperty(
      "--game-color-hover",
      better ? "var(--bronze10)" : "var(--grass10)"
    );

    rootRef.current?.style.setProperty(
      "--game-color-active",
      better ? "var(--bronze11)" : "var(--grass10)"
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
