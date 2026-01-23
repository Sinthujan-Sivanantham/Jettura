import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useLanguage } from "../../context/LanguageContext";

export default function ESIMSearchBar({ value, onChange }) {
  const { t } = useLanguage();
  return (
    <div className="relative max-w-xl mx-auto">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        size={20}
      />
      <Input
        className="pl-12 h-14 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white text-lg shadow-sm focus:ring-2"
        style={{ "--tw-ring-color": "var(--brand-color)" }}
        placeholder={t("esimShop.search.placeholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
