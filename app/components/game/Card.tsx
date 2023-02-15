import type { PanInfo } from "framer-motion";
import type { ReactNode } from "react";
import { Form } from "@remix-run/react";
import { cx, cva } from "class-variance-authority";
import { motion, useAnimationControls } from "framer-motion";

function Header({ children }: { children: ReactNode }) {
  return (
    <header className="flex justify-between bg-gray-4 py-4 px-4 text-lg font-medium group-hover:bg-gray-6">
      {children}
    </header>
  );
}

const actionClass = cva(
  ["flex items-center border-2 space-x-2 rounded-full p-1.5"],
  {
    variants: {
      variant: {
        delete: "text-red-9 border-red-6 bg-red-1",
        finish: "text-gold-9 border-gold-6 bg-gold-1",
      },
    },
  }
);
function Action({
  id,
  children,
  className = "right-2 top-0.5",
  variant,
}: {
  variant: "delete" | "finish";
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("absolute flex w-full justify-end", className)}>
      <Form
        method="post"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          name="intent"
          value={variant}
          className={actionClass({ variant })}
        >
          {children}
        </button>
      </Form>
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
  BG,
}: {
  id: number | string;
  onDragEnd: (id: number | string) => void;
  children: ReactNode;
  BG: typeof DragBackgroundDelete | typeof DragBackgroundFinish;
}) {
  const controls = useAnimationControls();

  async function handleDragEnd(_: MouseEvent, info: PanInfo) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -150 || velocity < -500) {
      await controls.start({ x: "-100%", transition: { duration: 0.2 } });
      onDragEnd(id);
    } else {
      controls.start({ x: 0, opacity: 1, transition: { duration: 0.5 } });
    }
  }

  return (
    <motion.div
      className="relative"
      whileTap={{ cursor: "grabbing" }}
      layout
      transition={{ type: "spring", stiffness: 1000, damping: 30 }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ right: 0 }}
        dragElastic={{ right: 0 }}
        dragDirectionLock
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        {children}
      </motion.div>

      <BG />
    </motion.div>
  );
}

function DragBackgroundDelete() {
  return (
    <div className="absolute left-0 bottom-0 right-0 top-0 -z-10 rounded bg-red-9">
      <div className="flex h-full w-full items-center justify-end">
        <span className="mr-4 text-xl">Zmazat</span>
      </div>
    </div>
  );
}

function DragBackgroundFinish() {
  return (
    <div className="absolute left-0 bottom-0 right-0 top-0 -z-10 rounded bg-bronze-9">
      <div className="flex h-full w-full items-center justify-end">
        <span className="mr-4 text-xl">Dokoncit</span>
      </div>
    </div>
  );
}

Drag.BgDelete = DragBackgroundDelete;
Drag.BgFinish = DragBackgroundFinish;

export function Card({ children }: { children: ReactNode }) {
  return (
    <article className="group relative space-y-2 rounded border-2 border-gray-6 bg-gray-2 pb-2">
      {children}
    </article>
  );
}

Card.Header = Header;
Card.Body = Body;
Card.Action = Action;
