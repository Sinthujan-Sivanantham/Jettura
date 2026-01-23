import RouteStepItem from "./route/RouteStepItem";
import { useLanguage } from "@/context/LanguageContext";

export default function AIRouteList({ steps, onSelectStep, selectedId, searchId }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-2 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar text-left">
      <h3 className="font-black text-xs dark:text-white uppercase italic mb-3 tracking-tighter flex items-center gap-2 px-2">
        <div className="w-1 h-3 bg-[var(--brand-color)]" /> {t("aiPlanner.results.stations")}
      </h3>

      {steps?.map((step, i) => (
        <RouteStepItem
          key={step.id || i}
          step={step}
          i={i}
          selectedId={selectedId}
          onSelect={onSelectStep}
          searchId={searchId}
        />
      ))}
    </div>
  );
}