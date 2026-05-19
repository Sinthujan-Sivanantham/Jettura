import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { translations } from "../../lib/translations";

export default function BlogPostHeader({ title, date, onBack, lang = "de" }) {
  const t = translations[lang].blog.post;
  return (
    <div className="space-y-6 sm:space-y-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="gap-2 font-bold uppercase tracking-widest text-zinc-500 hover:text-[var(--brand-color)] hover:bg-[var(--brand-color)]/5 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs"
      >
        <ArrowLeft size={16} /> {t.back}
      </Button>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl min-[360px]:text-3xl sm:text-4xl font-black tracking-tighter italic uppercase leading-[0.95] sm:leading-[0.9]" style={{ color: "var(--brand-color)" }}>
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-zinc-500 font-bold uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] tracking-[0.2em] border-y border-zinc-100 dark:border-zinc-800 py-4 sm:py-6">
          <div className="flex items-center gap-2">
            <Calendar size={12} style={{ color: "var(--brand-color)" }} />
            {new Date(date).toLocaleDateString(
              lang === "de" ? "de-DE" : "en-US",
            )}
          </div>
          <div className="flex items-center gap-2">
            <User size={12} style={{ color: "var(--brand-color)" }} /> {t.traveler}
          </div>
        </div>
      </div>
    </div>
  );
}
