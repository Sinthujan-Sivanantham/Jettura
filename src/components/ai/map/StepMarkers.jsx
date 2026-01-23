import React from "react";
import { Marker } from "react-map-gl/mapbox";
import { MapPin } from "lucide-react";

export default function StepMarkers({ steps, selectedStep, startRoute }) {
    return (
        <>
            {/* Startpunkt Pin */}
            {startRoute && (
                <Marker latitude={startRoute.lat} longitude={startRoute.lng}>
                    <div className="bg-zinc-800 p-2 rounded-full border-2 border-white shadow-lg">
                        <span className="text-white text-[10px] font-bold">START</span>
                    </div>
                </Marker>
            )}

            {/* Ziel-Pins */}
            {steps?.map((s, i) => (
                <Marker key={i} latitude={s.lat} longitude={s.lng}>
                    <div className={`p-2 rounded-full border-2 border-white shadow-xl transition-all ${selectedStep?.id === i ? "bg-[#3b60ff] scale-125 z-10" : "bg-white text-zinc-400 scale-100"
                        }`}>
                        <MapPin size={selectedStep?.id === i ? 20 : 14} fill={selectedStep?.id === i ? "white" : "currentColor"} />
                    </div>
                </Marker>
            ))}
        </>
    );
}
