import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Navigation } from "lucide-react";

export default function ResultHeader({ route }) {
    return (
        <CardHeader className="text-white p-10" style={{ backgroundColor: "var(--brand-color)" }}>
            <div className="flex justify-between items-start">
                <div className="space-y-2 text-left">
                    <CardTitle className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl sm:text-3xl md:text-4xl font-black uppercase italic flex items-center gap-3">
                        <Navigation size={32} className="rotate-45" /> {route.destination}
                    </CardTitle>
                    <div className="flex gap-6 text-white/80 font-bold text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm italic">
                        <span className="flex items-center gap-2"><Calendar size={16} /> {route.date}</span>
                        <span className="flex items-center gap-2"><Users size={16} /> {route.passengers} Pers.</span>
                    </div>
                </div>
                <Badge className="bg-white font-black py-2 px-6 rounded-full border-none shadow-xl text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm italic" style={{ color: "var(--brand-color)" }}>
                    {route.class}
                </Badge>
            </div>
        </CardHeader>
    );
}
