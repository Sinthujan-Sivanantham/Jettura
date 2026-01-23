
const fetch = require('node-fetch-commonjs');
require('dotenv').config();

const CLIENT_ID = process.env.VITE_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_AMADEUS_CLIENT_SECRET;
const TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const BASE_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";

async function getToken() {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    const res = await fetch(TOKEN_URL, { method: "POST", body: params });
    const data = await res.json();
    return data.access_token;
}

async function searchFlights() {
    console.log("🔍 Testing Amadeus Flight Search Endpoint...");

    try {
        const token = await getToken();
        console.log("✅ Token retrieved.");

        // Construct URL
        const url = new URL(BASE_URL);
        url.searchParams.append("originLocationCode", "BER");
        url.searchParams.append("destinationLocationCode", "JFK");
        url.searchParams.append("departureDate", "2026-03-01");
        url.searchParams.append("adults", "1");
        url.searchParams.append("max", "1");

        console.log(`✈️ Sending request to: ${url.toString()}`);

        const start = Date.now();
        const res = await fetch(url.toString(), {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const duration = Date.now() - start;
        console.log(`⏱️ Duration: ${duration}ms`);

        if (!res.ok) {
            const text = await res.text();
            console.error(`❌ Search Failed: ${res.status} ${res.statusText}`);
            console.error(`   Body: ${text}`);
            if (res.status === 500 || res.status === 429) {
                console.log("⚠️ This confirms the API is unstable (500/429).");
            }
        } else {
            const data = await res.json();
            console.log(`✅ Success! Found ${data.data?.length} flights.`);
        }

    } catch (e) {
        console.error("❌ Network/Script Error:", e.name, e.message);
        if (e.name === 'FetchError' && e.message.includes('timeout')) {
            console.log("⚠️ Connection Timed Out!");
        }
    }
}

searchFlights();
