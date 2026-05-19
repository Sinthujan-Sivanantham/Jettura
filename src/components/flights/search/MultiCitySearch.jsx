import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import MultiCitySegment from "./MultiCitySegment";

export default function MultiCitySearch({ segments, setSegments, errors = [], shakeKey }) {
    const { t } = useLanguage();

    const addSegment = () => {
        if (segments.length < 6) {
            const lastDest = segments[segments.length - 1].destination;
            setSegments([...segments, { id: Date.now(), origin: lastDest, destination: "", date: "" }]);
        }
    };

    const updateSegment = (index, field, value) => {
        const newSegments = [...segments];
        newSegments[index][field] = value;
        if (field === "destination" && newSegments[index + 1]) {
            newSegments[index + 1].origin = value;
        }
        setSegments(newSegments);
    };

    const removeSegment = (id) => {
        setSegments(segments.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-4">
            {segments.map((seg, i) => (
                <MultiCitySegment
                    key={seg.id}
                    seg={seg}
                    index={i}
                    totalSegments={segments.length}
                    onUpdate={updateSegment}
                    onRemove={() => removeSegment(seg.id)}
                    errors={errors[i] || {}}
                    shakeKey={shakeKey}
                />
            ))}

            <Button
                onClick={addSegment}
                className="w-full h-11 lg:h-14 border border-white/10 bg-white/5 dark:bg-zinc-900/5 backdrop-blur-md rounded-xl lg:rounded-[2rem] search-input-text font-black uppercase italic tracking-[0.2em] text-[var(--brand-color)] hover:bg-white/10 dark:hover:bg-zinc-900/10 transition-all shadow-sm"
            >
                + {t("search.flight.addLeg")}
            </Button>
        </div>
    );
}
