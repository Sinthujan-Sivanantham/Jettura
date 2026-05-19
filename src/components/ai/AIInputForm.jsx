import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import LocationFields from "./form/LocationFields";
import DetailFields from "./form/DetailFields";
import SubmitButton from "./form/SubmitButton";

import { plannerSchema } from "@/schemas/aiPlanner";

const today = new Date().toISOString().split('T')[0];

export default function AIInputForm({
  onGenerate, isLoading,
  origin, setOrigin,
  destination, setDestination,
  date, setDate,
  days, setDays,
  passengers, setPassengers,
  travelClass, setTravelClass
}) {
  const { t } = useLanguage();
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      origin: origin || "",
      destination: destination || "",
      date: date || today,
      days: days || 3,
      passengers: passengers || 1,
      travelClass: travelClass || "Economy"
    }
  });

  // Sync props to form state (e.g. when destination is set from navigation state)
  useEffect(() => {
    if (destination) setValue("destination", destination);
    if (origin) setValue("origin", origin);
  }, [destination, origin, setValue]);

  const watchedValues = watch();

  useEffect(() => {
    if (watchedValues.origin !== undefined) setOrigin(watchedValues.origin);
    if (watchedValues.destination !== undefined) setDestination(watchedValues.destination);
    if (watchedValues.date !== undefined) setDate(watchedValues.date);
    if (watchedValues.days !== undefined) setDays(watchedValues.days);
    if (watchedValues.passengers !== undefined) setPassengers(watchedValues.passengers);
    if (watchedValues.travelClass !== undefined) setTravelClass(watchedValues.travelClass);
  }, [watchedValues, setOrigin, setDestination, setDate, setDays, setPassengers, setTravelClass]);

  const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300";
  const inputStyle = "h-11 lg:h-14 search-input-text font-black italic uppercase rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md shadow-inner outline-none focus:ring-0 focus:border-[var(--brand-color)] transition-all flex items-center px-4 w-full [&>span]:pr-1.5";

  return (
    <Card className="border-transparent bg-white/30 dark:bg-slate-950/20 backdrop-blur-2xl rounded-none relative z-20 overflow-visible transition-all duration-500 shadow-none border-none px-6 py-8 sm:px-12 sm:py-10 pb-8">
      <form onSubmit={handleSubmit(onGenerate)} className="flex flex-col gap-6 md:gap-8">

        {/* Row 1: Locations */}
        <LocationFields control={control} errors={errors} rowStyle={rowStyle} />

        {/* Row 2: Details */}
        <DetailFields control={control} errors={errors} rowStyle={rowStyle} inputStyle={inputStyle} />

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} />

      </form>
    </Card>
  );
}