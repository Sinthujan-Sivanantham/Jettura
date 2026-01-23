import { motion, AnimatePresence } from "framer-motion";
import TransitImage from "./transit/TransitImage";
import TransitInfo from "./transit/TransitInfo";

export default function AITransitPanel({ selectedStep, originStep, searchId }) {
  if (!selectedStep) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedStep.id + searchId}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[32px] overflow-hidden border border-white/40 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Linke Seite: Bild-Sektor */}
          <TransitImage step={selectedStep} searchId={searchId} />

          {/* Rechte Seite: Info-Sektor */}
          <TransitInfo step={selectedStep} originStep={originStep} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}