import React from "react";
import { Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";

const AIAddressInput = dynamic(() => import("./AIAddressInput"), { ssr: false });

export default function LocationFields({ control, errors, rowStyle }) {
    const { t } = useLanguage();
    return (
        <div className={`grid grid-cols-1 min-[760px]:grid-cols-2 gap-x-6 gap-y-4 ${rowStyle}`}>
            <Controller
                name="origin"
                control={control}
                render={({ field }) => (
                    <AIAddressInput
                        label={t("aiPlanner.form.origin")}
                        placeholder={t("aiPlanner.form.originPlaceholder")}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        error={!!errors.origin}
                        name="origin-input"
                    />
                )}
            />
            <Controller
                name="destination"
                control={control}
                render={({ field }) => (
                    <AIAddressInput
                        label={t("aiPlanner.form.destination")}
                        placeholder={t("aiPlanner.form.destinationPlaceholder")}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        error={!!errors.destination}
                        name="destination-input"
                    />
                )}
            />
        </div>
    );
}
