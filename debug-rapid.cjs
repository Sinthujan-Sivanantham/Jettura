
const fetch = require('node-fetch-commonjs');
require('dotenv').config();

const KEY = process.env.VITE_RAPIDAPI_KEY;
const HOST = "google-flights-search.p.rapidapi.com";
const URL = `https://${HOST}/search`;

async function runTest() {
    console.log(`🔑 RapidAPI Key: ${KEY?.substring(0, 6)}...`);

    const params = new URLSearchParams({
        origin: "BER",
        destination: "JFK",
        date: "2026-02-01",
        adults: "1",
        currency: "EUR"
    });

    try {
        console.log("✈️ requesting SkyScanner/Google via RapidAPI...");
        const res = await fetch(`${URL}?${params.toString()}`, {
            headers: {
                "x-rapidapi-key": KEY,
                "x-rapidapi-host": HOST
            }
        });

        const json = await res.json();

        if (!res.ok) {
            console.error("❌ RapidAPI Failed:", JSON.stringify(json, null, 2));
        } else {
            console.log("✅ RapidAPI Success!");
            // Adjust based on actual response structure (often 'data' or 'flights')
            const count = json.data?.length || json.ids?.length || 0;
            console.log(`📦 Items Found: ${count}`);
            console.log("Response Preview:", JSON.stringify(json).substring(0, 200));
        }

    } catch (e) {
        console.error("Network Error:", e);
    }
}

runTest();
