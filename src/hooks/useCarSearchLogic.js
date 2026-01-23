import { useState, useEffect } from "react";


export function useCarSearchLogic(onSearchSuccess) {
    const [dates, setDates] = useState({ start: "", end: "" });
    const [times, setTimes] = useState({ pickup: "10:00", return: "10:00" });
    const [location, setLocation] = useState(null);
    const [returnLocation, setReturnLocation] = useState(null);
    const [differentReturn, setDifferentReturn] = useState(false);
    const [searching, setSearching] = useState(false);

    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const [errors, setErrors] = useState({ location: false, returnLocation: false, start: false, end: false });
    const [shakeKey, setShakeKey] = useState(0);

    const [isLoaded, setIsLoaded] = useState(false);

    // PERSISTENCE
    useEffect(() => {
        const saved = localStorage.getItem("jettura_car_prefs");
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.location) setLocation(data.location);
                if (data.returnLocation) setReturnLocation(data.returnLocation);
                if (data.differentReturn !== undefined) setDifferentReturn(data.differentReturn);
                if (data.dates) setDates(data.dates);
                if (data.times) setTimes(data.times);
            } catch (e) { console.error(e); }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("jettura_car_prefs", JSON.stringify({ location, returnLocation, differentReturn, dates, times }));
    }, [location, returnLocation, differentReturn, dates, times, isLoaded]);

    const handleSearch = async () => {
        const newErrors = {
            location: !location,
            returnLocation: differentReturn && !returnLocation,
            start: !dates.start,
            end: !dates.end
        };

        // Always update errors to clear previous ones if valid
        setErrors(newErrors);

        if (newErrors.location || newErrors.returnLocation || newErrors.start || newErrors.end) {
            setShakeKey(prev => prev + 1);
            if (navigator.vibrate) navigator.vibrate(200);
            return;
        }

        setSearching(true);
        try {
            // Validation: Use object ID if available, otherwise fallback to the string itself
            const pickupId = location.id || (typeof location === 'string' ? location : location.fullName);

            if (!pickupId) throw new Error("Please select a valid pickup location.");

            // let dropoffId = pickupId; // This is no longer needed for the new API
            // if (differentReturn && returnLocation) {
            //     dropoffId = returnLocation.id || (typeof returnLocation === 'string' ? returnLocation : returnLocation.fullName);
            // }

            // Simulate API Call (API connections removed per user request)
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result = { data: [] }; // Mock empty response for now

            console.log("🚘 Car Search (Mock):", result);

            onSearchSuccess?.({
                type: 'cars',
                data: {
                    location: location.fullName || location.displayname,
                    returnLocation: differentReturn ? (returnLocation.fullName || returnLocation.displayname) : (location.fullName || location.displayname),
                    dates,
                    times,
                    offers: [
                        {
                            id: "offer-1",
                            provider: { companyName: "Sixt" },
                            car: {
                                category: "LUXURY SUV",
                                description: "BMW X5",
                                transmissionType: "AUTOMATIC"
                            },
                            price: { total: 450, currency: "EUR" },
                            imageUrl: "https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=800&q=80"
                        },
                        {
                            id: "offer-2",
                            provider: { companyName: "Hertz" },
                            car: {
                                category: "COMPACT",
                                description: "VW Golf 8",
                                transmissionType: "MANUAL"
                            },
                            price: { total: 125, currency: "EUR" },
                            imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                        },
                        {
                            id: "offer-3",
                            provider: { companyName: "Avis" },
                            car: {
                                category: "CONVERTIBLE",
                                description: "Mustang GT",
                                transmissionType: "AUTOMATIC"
                            },
                            price: { total: 380, currency: "EUR" },
                            imageUrl: "https://images.unsplash.com/photo-1584345604325-f5091269a0d1?auto=format&fit=crop&w=800&q=80"
                        }
                    ],
                    source: "mock"
                }
            });
        } catch (e) {
            console.error(e);
            alert(e.message || "Error searching for cars.");
        } finally {
            setSearching(false);
        }
    };

    return {
        dates, setDates,
        times, setTimes,
        location, setLocation,
        returnLocation, setReturnLocation,
        differentReturn, setDifferentReturn,
        searching,
        isStartOpen, setIsStartOpen,
        isEndOpen, setIsEndOpen,
        errors, setErrors,
        shakeKey,
        handleSearch
    };
}
