"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function useAIPlannerLogic() {
    const { t, language } = useLanguage();
    const searchParams = useSearchParams();
    const [plannedRoute, setPlannedRoute] = useState(null);
    const [selectedStep, setSelectedStep] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [searchId, setSearchId] = useState(Date.now());

    // Form Persistence
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [days, setDays] = useState(3);
    const [passengers, setPassengers] = useState(1);
    const [travelClass, setTravelClass] = useState("Economy");

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("jettura_ai_planner_prefs");
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.origin) setOrigin(data.origin);
                if (data.destination) setDestination(data.destination);
                if (data.date) setDate(data.date);
                if (data.days) setDays(data.days);
                if (data.passengers) setPassengers(data.passengers);
                if (data.travelClass) setTravelClass(data.travelClass);
            } catch (e) { console.error(e); }
        }

        // Override destination if passed via URL query param (e.g. ?destination=Paris from Blog)
        const destParam = searchParams.get("destination");
        if (destParam) {
            setDestination(destParam);
        }
    }, [searchParams]);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("jettura_ai_planner_prefs", JSON.stringify({
            origin, destination, date, days, passengers, travelClass
        }));
    }, [origin, destination, date, days, passengers, travelClass]);

    const handleGenerate = async (formData) => {
        setIsGenerating(true);
        setError(null);
        setPlannedRoute(null);
        setSelectedStep(null);
        setSearchId(Date.now());

        const isDe = language === "de";
        const prompt = isDe
            ? `Erstelle einen REALISTISCHEN, PRÄZISEN Reiseplan von ${formData.origin} nach ${formData.destination} für ${formData.days} Tage. 
               Antworte NUR im JSON-Format.
               
               REGELN:
               1. Benutze ECHTE, existierende Orte mit EXAKTEN Koordinaten (lat/lng). Keine Halluzinationen!
               2. 'img_query' muss eine englische, bildhafte Beschreibung für einen Foto-Generator sein (z.B. "Eiffel Tower at sunset realistic 8k").
               3. ALLE Texte (Zusammenfassung, Beratung, Aktivitäten, Adressen, Tipps) müssen auf DEUTSCH sein.
               4. 'duration' (Dauer) und 'distance_km' müssen realistisch geschätzt sein.
               5. FÜGE EINE "summary" (Zusammenfassung der Reise) UND "general_advice" (allgemeine Tipps für dieses Ziel) HINZU.
               
               Struktur: { 
                 "destination": "${formData.destination}", 
                 "lat": 0.0, 
                 "lng": 0.0, 
                 "summary": "Ein toller Trip nach...",
                 "general_advice": "Beste Reisezeit ist...",
                 "steps": [{ "id": 0, "day": 1, "activity": "Schloss Neuschwanstein", "address": "Neuschwansteinstraße 20, 87645 Schwangau", "lat": 47.5690, "lng": 10.7498, "distance_km": "1.5", "duration": "30 Min", "tip": "Tickets online reservieren.", "img_query": "Neuschwanstein castle bavaria winter realistic" }] 
               }`
            : `Create a REALISTIC, PRECISE travel itinerary from ${formData.origin} to ${formData.destination} for ${formData.days} days. 
               Respond ONLY in JSON format.
               
               RULES:
               1. Use REAL, existing places with EXACT coordinates (lat/lng). Do not hallucinate!
               2. 'img_query' must be a vivid ENGLISH description for a photo generator (e.g., "Eiffel Tower at sunset realistic 8k").
               3. ALL text (summary, general_advice, activity, address, tip, duration) must be in ENGLISH.
               4. 'duration' and 'distance_km' must be realistic estimates.
               5. ADD A "summary" (trip overview) AND "general_advice" (general tips for this destination).

               Struktur: { 
                 "destination": "${formData.destination}", 
                 "lat": 0.0, 
                 "lng": 0.0, 
                 "summary": "An amazing trip to...",
                 "general_advice": "Best time to visit is...",
                 "steps": [{ "id": 0, "day": 1, "activity": "Eiffel Tower", "address": "Champ de Mars, 5 Av. Anatole France, 75007 Paris", "lat": 48.8584, "lng": 2.2945, "distance_km": "2.0", "duration": "20 min", "tip": "Go early to avoid crowds.", "img_query": "Eiffel Tower Paris bright sunny day realistic" }] 
               }`;

        const systemContent = isDe
            ? "Du bist ein erfahrener Reise-Guide. Du kennst echte Orte, Adressen und Koordinaten weltweit. Antworte nur mit validem JSON. Keine Einleitung, kein Markdown. Gib hilfreiche 'Beratung' in den summary und general_advice Feldern."
            : "You are an expert travel guide. You know real places, addresses, and coordinates worldwide. Respond only with valid JSON. No intro, no markdown. Provide helpful 'advice' in the summary and general_advice fields.";

        try {
            const response = await fetch("/api/ai-planner", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ systemContent, prompt })
            });

            const parsed = await response.json();

            if (!response.ok) {
                console.error("API Error:", parsed);
                throw new Error(parsed.error || t("search.error"));
            }

            if (!parsed.steps || !Array.isArray(parsed.steps)) throw new Error("Ungültige Datenstruktur");

            setPlannedRoute(parsed);
            setSelectedStep(parsed.steps[0]);
        } catch (err) {
            console.error("Fehler:", err);
            setError(t("search.error"));
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        plannedRoute,
        selectedStep,
        setSelectedStep,
        isGenerating,
        error,
        searchId,
        handleGenerate,
        // States for Persistence
        origin, setOrigin,
        destination, setDestination,
        date, setDate,
        days, setDays,
        passengers, setPassengers,
        travelClass, setTravelClass
    };
}
