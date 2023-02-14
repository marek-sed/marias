import type { PanInfo } from "framer-motion";
import type { ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";

function Header({ children }: { children: ReactNode }) {
  return (
    <header className="flex justify-between bg-gray-4 py-3.5 px-4 text-lg font-medium group-hover:bg-gray-6">
      {children}
    </header>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex w-full justify-end px-4"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <div className="py-1.5 px-4">{children}</div>;
}

export function Drag({
  id,
  onDragEnd,
  children,
}: {
  id: number | string;
  onDragEnd: (id: number | string) => void;
  children: ReactNode;
}) {
  const controls = useAnimationControls();

  async function handleDragEnd(_: MouseEvent, info: PanInfo) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      await controls.start({ x: "-100%", transition: { duration: 0.2 } });
      onDragEnd(id);
    } else {
      controls.start({ x: 0, opacity: 1, transition: { duration: 0.5 } });
    }
  }

  return (
    <motion.div
      whileTap={{ cursor: "grabbing" }}
      layout
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
    >
      <motion.div
        drag="x"
        dragDirectionLock
        onDragEnd={handleDragEnd}
        // onTap={() => navigate(to)}
        animate={controls}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <article className="group relative space-y-2 rounded border-2 border-gray-6 bg-gray-2 pb-2">
      {children}
    </article>
  );
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;
