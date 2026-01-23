import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";
import { translations } from "../../lib/translations";

export default function BlogEmptyState({ lang }) {
  const t = translations[lang].blog;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden py-32 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col items-center justify-center text-center px-6"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#001aff]/10 blur-[100px] rounded-full -z-10" />
      <div className="bg-[#001aff]/10 p-6 rounded-3xl mb-6">
        <MessageSquarePlus size={48} className="text-[#001aff]" />
      </div>
      <h3 className="text-3xl font-black uppercase italic text-zinc-400 dark:text-zinc-500 tracking-tighter mb-2">
        {t.empty}
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
        {t.startStory}
      </p>
    </motion.div>
  );
}