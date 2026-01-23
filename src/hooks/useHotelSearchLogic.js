import { useState, useEffect } from "react";

import { useLanguage } from "@/context/LanguageContext";

export function useHotelSearchLogic(onSearchSuccess) {
    const { t } = useLanguage();
    const [dates, setDates] = useState({ start: "", end: "" });
    const [destination, setDestination] = useState("");
    const [passengers, setPassengers] = useState({ adults: 2, children: 0, infants: 0 });
    const [loading, setLoading] = useState(false);

    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const [errors, setErrors] = useState({ destination: false, start: false, end: false });
    const [shakeKey, setShakeKey] = useState(0);

    const [isLoaded, setIsLoaded] = useState(false);

    // Persistence Logic
    useEffect(() => {
        const saved = localStorage.getItem("jettura_hotel_prefs");
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.destination) setDestination(data.destination);
                if (data.dates) setDates(data.dates);
                if (data.passengers) setPassengers(data.passengers);
            } catch (e) { console.error("Load error", e); }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("jettura_hotel_prefs", JSON.stringify({ destination, dates, passengers }));
    }, [destination, dates, passengers, isLoaded]);

    const handleSearch = async () => {
        const newErrors = {
            destination: !destination,
            start: !dates.start,
            end: !dates.end
        };

        // Always update errors to clear previous ones if valid
        setErrors(newErrors);

        if (newErrors.destination || newErrors.start || newErrors.end) {
            setShakeKey(prev => prev + 1);
            return;
        }

        setLoading(true);
        try {
            // Import Amadeus Hotel API with explicit relative path
            const { searchHotelsByCity, getHotelOffers, transformAmadeusHotelsToJettura } = await import("../components/hotels/api/amadeusHotelApi.js");

            // Step 1: Search hotels by city code
            const hotelsData = await searchHotelsByCity({
                cityCode: destination, // Should be IATA code like "BER", "NYC"
                radius: 50
            });

            if (!hotelsData.data || hotelsData.data.length === 0) {
                throw new Error(t("search.hotel.errors.noHotels") || "No hotels found");
            }

            // Step 2: Try to get offers for first 50 hotels (optional)
            let offersData = null;
            try {
                const hotelIds = hotelsData.data.slice(0, 50).map(h => h.hotelId);

                offersData = await getHotelOffers({
                    hotelIds,
                    checkInDate: dates.start,
                    checkOutDate: dates.end,
                    adults: passengers.adults,
                    roomQuantity: 1,
                    currency: "EUR"
                });
            } catch (offerError) {
                console.warn("Could not fetch hotel offers, showing hotels without prices:", offerError);
            }

            // Step 3: Transform to Jettura format (works with or without offers)
            const hotels = transformAmadeusHotelsToJettura(hotelsData, offersData);

            if (onSearchSuccess) {
                onSearchSuccess({
                    type: 'hotels',
                    hotels,
                    searchParams: {
                        destination,
                        checkIn: dates.start,
                        checkOut: dates.end,
                        guests: passengers.adults
                    }
                });
            }
        } catch (err) {
            console.error("Hotel Search Error:", err);
            alert(err.message || t("search.hotel.errors.searchError"));
        } finally {
            setLoading(false);
        }
    };

    return {
        dates, setDates,
        destination, setDestination,
        passengers, setPassengers,
        loading,
        isStartOpen, setIsStartOpen,
        isEndOpen, setIsEndOpen,
        errors, setErrors,
        shakeKey,
        handleSearch
    };
}
