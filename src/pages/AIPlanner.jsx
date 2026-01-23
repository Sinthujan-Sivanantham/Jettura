import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import AIInputForm from "@/components/ai/AIInputForm";
import AIRouteList from "@/components/ai/AIRouteList";
import MapContainer from "@/components/ai/MapContainer";
import AITransitPanel from "@/components/ai/AITransitPanel";
import Hero from "@/components/home/hero/Hero";
import AuthGate from "@/components/common/AuthGate";
import { useAuth } from "@/context/AuthContext";
import { useAIPlannerLogic } from "@/hooks/useAIPlannerLogic";
import { useLanguage } from "@/context/LanguageContext";

import AIAdvisorPanel from "@/components/ai/AIAdvisorPanel";

export default function AIPlanner() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const {
    plannedRoute,
    selectedStep,
    setSelectedStep,
    isGenerating,
    error,
    searchId,
    handleGenerate,
    origin, setOrigin,
    destination, setDestination,
    date, setDate,
    days, setDays,
    passengers, setPassengers,
    travelClass, setTravelClass
  } = useAIPlannerLogic();

  const steps = plannedRoute?.steps || [];
  const selectedIndex = steps.findIndex(s => s.id === selectedStep?.id);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <AuthGate
          title={t("aiPlanner.auth.title")}
          description={t("aiPlanner.auth.description")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pb-20">
      <Hero>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full"
        >
          <AIInputForm
            onGenerate={handleGenerate}
            isLoading={isGenerating}
            origin={origin} setOrigin={setOrigin}
            destination={destination} setDestination={setDestination}
            date={date} setDate={setDate}
            days={days} setDays={setDays}
            passengers={passengers} setPassengers={setPassengers}
            travelClass={travelClass} setTravelClass={setTravelClass}
          />
        </motion.div>
      </Hero>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-12">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-2 border border-red-500/20 uppercase mb-8">
            <AlertTriangle size={14} /> {error}
          </motion.div>
        )}

        {/* Results Section */}
        {(isGenerating || steps.length > 0 || plannedRoute) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-10 gap-2 border border-dashed rounded-3xl border-zinc-200 dark:border-zinc-800 h-full min-h-[300px]">
                  <Loader2 className="animate-spin" size={24} style={{ color: "var(--brand-color)" }} />
                  <p className="text-[9px] font-black uppercase text-zinc-400">{t("aiPlanner.form.generating")}</p>
                </div>
              ) : steps.length > 0 ? (
                <AIRouteList steps={steps} onSelectStep={setSelectedStep} selectedId={selectedStep?.id} searchId={searchId} />
              ) : null}
            </div>

            <div className="lg:col-span-9 space-y-8">
              {/* AI Advisor Panel */}
              {!isGenerating && plannedRoute && (
                <AIAdvisorPanel plannedRoute={plannedRoute} />
              )}

              <MapContainer
                route={plannedRoute}
                selectedStep={selectedStep}
                originStep={selectedIndex > 0 ? steps[selectedIndex - 1] : null}
              />

              <AnimatePresence mode="wait">
                {selectedStep && (
                  <AITransitPanel
                    key={selectedStep.id}
                    selectedStep={selectedStep}
                    searchId={searchId}
                    originStep={selectedIndex > 0 ? steps[selectedIndex - 1] : {
                      activity: plannedRoute?.origin || t("aiPlanner.form.startPoint"),
                      lat: plannedRoute?.lat,
                      lng: plannedRoute?.lng
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}