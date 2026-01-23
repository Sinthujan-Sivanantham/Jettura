import { useState, useEffect } from "react";
import { searchFlightsAmadeus, transformAmadeusToJettura } from "@/components/flights/api/amadeusFlightApi";

export function useFlightSearchLogic(onSearchSuccess) {
    const [tripType, setTripType] = useState("roundtrip");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [dates, setDates] = useState({ start: "", end: "" });

    const [multiCitySegments, setMultiCitySegments] = useState([
        { id: 1, origin: "", destination: "", date: "" }
    ]);

    const [cabin, setCabin] = useState("ECONOMY");
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [loading, setLoading] = useState(false);

    // View States
    const [isReturnOpen, setIsReturnOpen] = useState(false);
    const [isHinflugOpen, setIsHinflugOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [shakeKey, setShakeKey] = useState(0);

    const [isLoaded, setIsLoaded] = useState(false);

    // --- PERSISTENCE ---
    useEffect(() => {
        const saved = localStorage.getItem("jettura_flight_prefs");
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.origin) setOrigin(data.origin);
                if (data.destination) setDestination(data.destination);
                if (data.dates) setDates(data.dates);
                if (data.tripType) setTripType(data.tripType);
                if (data.passengers) setPassengers(data.passengers);
                if (data.cabin) setCabin(data.cabin);
                if (data.multiCitySegments) setMultiCitySegments(data.multiCitySegments);
            } catch (e) {
                console.error("Load error", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        const prefs = { origin, destination, dates, tripType, passengers, cabin, multiCitySegments };
        localStorage.setItem("jettura_flight_prefs", JSON.stringify(prefs));
    }, [origin, destination, dates, tripType, passengers, cabin, multiCitySegments, isLoaded]);

    const validate = () => {
        let isValid = true;
        const newErrors = {};

        if (tripType !== "multi") {
            if (!origin || origin.length !== 3) { newErrors.origin = true; isValid = false; }
            if (!destination || destination.length !== 3) { newErrors.destination = true; isValid = false; }
            if (!dates.start) { newErrors.start = true; isValid = false; }
            if (tripType === "roundtrip" && !dates.end) { newErrors.end = true; isValid = false; }
        } else {
            newErrors.multiCity = multiCitySegments.map((seg) => ({
                origin: !seg.origin || seg.origin.length !== 3,
                destination: !seg.destination || seg.destination.length !== 3,
                date: !seg.date
            }));
            multiCitySegments.forEach((seg) => {
                if (!seg.origin || seg.origin.length !== 3 || !seg.destination || seg.destination.length !== 3 || !seg.date) isValid = false;
            });
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSearch = async () => {
        if (!validate()) {
            setShakeKey(prev => prev + 1);
            if (navigator.vibrate) navigator.vibrate(200);
            return;
        }
        setLoading(true);
        try {
            let rawResults;
            let offers = [];

            try {
                // PRIMARY: Try Amadeus
                if (tripType === "multi") {
                    rawResults = await searchFlightsAmadeus({
                        multiCity: true,
                        segments: multiCitySegments.map(seg => ({
                            origin: seg.origin,
                            destination: seg.destination,
                            departureDate: seg.date
                        })),
                        adults: passengers.adults,
                        children: passengers.children,
                        infants: passengers.infants,
                        travelClass: cabin
                    });
                } else {
                    rawResults = await searchFlightsAmadeus({
                        origin,
                        destination,
                        departureDate: dates.start,
                        returnDate: tripType === "roundtrip" ? dates.end : undefined,
                        adults: passengers.adults,
                        children: passengers.children,
                        infants: passengers.infants,
                        travelClass: cabin
                    });
                }
                offers = transformAmadeusToJettura(rawResults);

            } catch (amadeusError) {
                console.error("❌ Amadeus API Search Failed:", amadeusError);
                throw amadeusError; // Propagate error so UI can show it
            }

            onSearchSuccess({
                type: 'flights',
                data: offers
            });

        } catch (err) {
            console.error("All Search APIs failed:", err);
            onSearchSuccess([]);
        } finally {
            setLoading(false);
        }
    };
    return {
        tripType, setTripType,
        origin, setOrigin,
        destination, setDestination,
        dates, setDates,
        multiCitySegments, setMultiCitySegments,
        cabin, setCabin,
        passengers, setPassengers,
        loading,
        isReturnOpen, setIsReturnOpen,
        isHinflugOpen, setIsHinflugOpen,
        errors, setErrors,
        shakeKey,
        handleSearch
    };
}
