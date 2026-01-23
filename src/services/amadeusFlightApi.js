// src/services/amadeusFlightApi.js
import { getAmadeusToken } from "./amadeusApi"; // Importiert aus der anderen Datei

export async function searchFlightsAmadeus(params) {
    try {
        const token = await getAmadeusToken();
        const searchParams = new URLSearchParams({
            originLocationCode: params.originLocationCode,
            destinationLocationCode: params.destinationLocationCode,
            departureDate: params.departureDate,
            adults: params.adults || "1",
            currencyCode: "EUR"
        });

        if (params.returnDate) searchParams.append("returnDate", params.returnDate);

        const res = await fetch(`/api-gds/v2/shopping/flight-offers?${searchParams.toString()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error("Amadeus Fehler:", errorBody);
            throw new Error(`Suche fehlgeschlagen: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Fehler in der Flugsuche:", error);
        throw error;
    }
}

export async function searchAirportsAmadeus(keyword) {
    if (!keyword || keyword.length < 2) return [];

    try {
        const token = await getAmadeusToken();
        const res = await fetch(`/api-gds/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${keyword}&page[limit]=10`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            throw new Error("Fehler beim Abrufen der Flughäfen");
        }

        const data = await res.json();

        // Transformiere die Daten in das Format, das die Autocomplete-Komponente erwartet
        return (data.data || []).map(item => ({
            iataCode: item.iataCode,
            name: item.name,
            cityName: item.address?.cityName || item.name,
            countryName: item.address?.countryName || "",
            type: item.subType === "CITY" ? "city" : "airport"
        }));

    } catch (error) {
        console.error("Flughafen-Suche fehlgeschlagen:", error);
        return [];
    }
}