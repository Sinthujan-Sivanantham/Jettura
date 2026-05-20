import { NextResponse } from 'next/server';

const AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
// Note: In production you might want to use the live URL instead of test.api.amadeus.com
// const AUTH_URL = "https://api.amadeus.com/v1/security/oauth2/token";

let cachedToken = null;
let tokenExpiration = 0;

export async function GET() {
    try {
        const now = Date.now();
        if (cachedToken && now < tokenExpiration) {
            return NextResponse.json({ access_token: cachedToken });
        }

        const CLIENT_ID = process.env.NEXT_PUBLIC_AMADEUS_CLIENT_ID; // Client ID can stay public or be moved to private.
        const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET || process.env.NEXT_PUBLIC_AMADEUS_CLIENT_SECRET;

        if (!CLIENT_ID || !CLIENT_SECRET) {
            console.error("Amadeus API Credentials missing.");
            return NextResponse.json({ error: "Missing API credentials" }, { status: 500 });
        }

        const body = new URLSearchParams();
        body.append("grant_type", "client_credentials");
        body.append("client_id", CLIENT_ID);
        body.append("client_secret", CLIENT_SECRET);

        const res = await fetch(AUTH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
        });

        if (!res.ok) {
            throw new Error("Token-Generierung fehlgeschlagen");
        }

        const data = await res.json();
        cachedToken = data.access_token;
        tokenExpiration = now + (data.expires_in * 1000) - 60000;

        return NextResponse.json({ access_token: cachedToken });
    } catch (e) {
        console.error("Token Fehler:", e);
        return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
    }
}
