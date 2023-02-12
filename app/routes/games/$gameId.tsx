import { PlusIcon } from "@radix-ui/react-icons";
import { useLocation, useOutlet, useParams } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { FAB } from "~/components/fab";

export default function GameIdIndex() {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const { round } = useParams();

  return (
    <div className="relative mx-auto flex max-w-screen-sm flex-col">
      {outlet}
      <AnimatePresence initial={false} mode="wait">
        {!round && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.3,
                duration: 0.2,
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0.1,
                duration: 0.2,
              },
            }}
          >
            <FAB key={pathname}>
              <PlusIcon className="h-8 w-8" />
            </FAB>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
