
const fetch = require('node-fetch-commonjs');
require('dotenv').config();

const TOKEN = process.env.VITE_TRAVELPAYOUTS_TOKEN;
const URL = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";

async function runTest() {
    console.log(`🔑 TP Token: ${TOKEN?.substring(0, 6)}...`);

    const params = new URLSearchParams({
        origin: "BER",
        destination: "JFK",
        departure_at: "2026-02-01",
        currency: "eur",
        token: TOKEN,
        limit: "5"
    });

    try {
        console.log("✈️ requesting Travelpayouts (Real Data)...");
        const res = await fetch(`${URL}?${params.toString()}`);
        const json = await res.json();

        if (!res.ok) {
            console.error("❌ TP Failed:", JSON.stringify(json, null, 2));
        } else {
            console.log("✅ TP Success!");
            console.log(`📦 Objects Found: ${json.data?.length}`);
            if (json.data?.length > 0) {
                console.log("   Price:", json.data[0].price);
                console.log("   Airline:", json.data[0].airline);
            } else {
                console.log("   (No flights found in cache for this route/date)");
            }
        }

    } catch (e) {
        console.error("Network Error:", e);
    }
}

runTest();
