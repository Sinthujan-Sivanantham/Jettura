import { Button } from "@/components/ui/button";
import { translations } from "../../lib/translations";

export default function BlogPostCTA({ onNavigate, lang = "de" }) {
  const t = translations[lang].blog.post;
  return (
    <div className="bg-[var(--brand-color)]/5 dark:bg-[var(--brand-color)]/10 p-10 md:p-14 rounded-[3rem] mt-20 border border-[var(--brand-color)]/10 shadow-inner">
      <h3 className="text-3xl font-black italic uppercase mb-4 tracking-tighter">
        {t.ctaTitle}
      </h3>
      <p className="mb-10 text-zinc-500 text-lg md:text-xl leading-relaxed max-w-2xl">
        {t.ctaDesc}
      </p>
      <Button
        onClick={onNavigate}
        className="h-16 px-10  bg-[var(--brand-color)] hover:opacity-90 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-[var(--brand-color)]/40 transition-all hover:-translate-y-1 border-none"
      >
        {t.ctaButton}
      </Button>
    </div>
  );
}
