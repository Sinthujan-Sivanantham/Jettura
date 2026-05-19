import React from "react";
import { Marker } from "react-map-gl/mapbox";
import { MapPin } from "lucide-react";

export default function StepMarkers({ steps, selectedStep, startRoute }) {
    return (
        <>
            {/* Startpunkt Pin */}
            {startRoute && !isNaN(parseFloat(startRoute.lat)) && !isNaN(parseFloat(startRoute.lng)) && (
                <Marker latitude={parseFloat(startRoute.lat)} longitude={parseFloat(startRoute.lng)}>
                    <div className="bg-zinc-800 p-2 rounded-full border-2 border-white shadow-lg">
                        <span className="text-white text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-bold">START</span>
                    </div>
                </Marker>
            )}

            {/* Ziel-Pins */}
            {steps?.map((s, i) => {
                const lat = parseFloat(s.lat);
                const lng = parseFloat(s.lng);
                if (isNaN(lat) || isNaN(lng)) return null;
                return (
                    <Marker key={i} latitude={lat} longitude={lng}>
                        <div className={`p-2 rounded-full border-2 border-white shadow-xl transition-all ${selectedStep?.id === s.id ? "bg-[#3b60ff] scale-125 z-10" : "bg-white text-zinc-400 scale-100"
                            }`}>
                            <MapPin size={selectedStep?.id === s.id ? 20 : 14} fill={selectedStep?.id === s.id ? "white" : "currentColor"} />
                        </div>
                    </Marker>
                );
            })}
        </>
    );
}
