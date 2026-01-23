
const fetch = require('node-fetch-commonjs');
require('dotenv').config();

const TOKEN = process.env.VITE_DUFFEL_API_KEY;
const URL = "https://api.duffel.com/air/offer_requests";

async function runTest() {
    console.log(`🔑 Duffel Key: ${TOKEN?.substring(0, 10)}...`);

    const body = {
        data: {
            slices: [
                {
                    origin: "BER",
                    destination: "JFK",
                    departure_date: "2026-02-01"
                }
            ],
            passengers: [{ type: "adult" }],
            cabin_class: "economy"
        }
    };

    try {
        const start = Date.now();
        console.log("✈️ requesting Duffel (BER -> JFK)...");
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Duffel-Version": "beta",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const json = await res.json();
        console.log(`⏱️ Duration: ${Date.now() - start}ms`);

        if (!res.ok) {
            console.error("❌ Duffel Failed:", JSON.stringify(json, null, 2));
        } else {
            console.log("✅ Duffel Success!");
            console.log(`📦 Offers Found: ${json.data.offers?.length}`);
            if (json.data.offers?.length > 0) {
                console.log("   Example Owner:", json.data.offers[0].owner.name);
                console.log("   Price:", json.data.offers[0].total_amount, json.data.offers[0].total_currency);
            }
        }

    } catch (e) {
        console.error("Network Error:", e);
    }
}

runTest();
