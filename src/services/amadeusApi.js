// src/services/amadeusApi.js

let cachedToken = null;
let tokenExpiration = 0;

// WICHTIG: Hier muss "export" stehen!
export async function getAmadeusToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpiration) {
        return cachedToken;
    }

    try {
        const res = await fetch("/api/amadeus/auth");

        if (!res.ok) throw new Error("Token-Generierung fehlgeschlagen");

        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        
        cachedToken = data.access_token;
        // The backend should handle expiration, but we can also cache it briefly on the client
        tokenExpiration = now + (30 * 60 * 1000); // 30 minutes cache locally, or backend's logic

        return cachedToken;
    } catch (e) {
        console.error("Token Fehler:", e);
        throw e;
    }
}