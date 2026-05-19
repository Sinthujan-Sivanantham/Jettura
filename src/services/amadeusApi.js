// src/services/amadeusApi.js

const CLIENT_ID = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;
const AUTH_URL = "/api-gds/v1/security/oauth2/token";

let cachedToken = null;
let tokenExpiration = 0;

// WICHTIG: Hier muss "export" stehen!
export async function getAmadeusToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpiration) {
        return cachedToken;
    }

    try {
        const body = new URLSearchParams();
        body.append("grant_type", "client_credentials");
        body.append("client_id", CLIENT_ID);
        body.append("client_secret", CLIENT_SECRET);

        const res = await fetch(AUTH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
        });

        if (!res.ok) throw new Error("Token-Generierung fehlgeschlagen");

        const data = await res.json();
        cachedToken = data.access_token;
        tokenExpiration = now + (data.expires_in * 1000) - 60000;

        return cachedToken;
    } catch (e) {
        console.error("Token Fehler:", e);
        throw e;
    }
}