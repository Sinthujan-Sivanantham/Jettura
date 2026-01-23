
const fetch = require('node-fetch-commonjs');
require('dotenv').config();

const CLIENT_ID = process.env.VITE_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_AMADEUS_CLIENT_SECRET;
const AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const SEARCH_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";

async function runTest() {
    console.log(`🔑 Using Client ID: ${CLIENT_ID?.substring(0, 6)}...`);
    console.log(`🔑 Using Secret: ${CLIENT_SECRET?.substring(0, 4)}...`);

    // 1. Get Token
    const authBody = new URLSearchParams();
    authBody.append("grant_type", "client_credentials");
    authBody.append("client_id", CLIENT_ID);
    authBody.append("client_secret", CLIENT_SECRET);

    let token;
    try {
        const authRes = await fetch(AUTH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: authBody.toString()
        });
        const authData = await authRes.json();
        if (!authRes.ok) throw new Error(JSON.stringify(authData));
        token = authData.access_token;
        console.log("✅ Token received.");
    } catch (e) {
        console.error("❌ Auth Failed:", e);
        return;
    }

    // Routes to Test (Extensive List)
    const routes = [
        { orig: "BER", dest: "JFK", date: "2026-02-01" },
        { orig: "LHR", dest: "JFK", date: "2026-03-15" },
        { orig: "PAR", dest: "NYC", date: "2026-04-20" },
        { orig: "MAD", dest: "NYC", date: "2026-05-01" },
        { orig: "MUC", dest: "LHR", date: "2026-02-10" },
        { orig: "FRA", dest: "LHR", date: "2026-02-10" },
        { orig: "AMS", dest: "LON", date: "2026-02-15" },
        { orig: "SYD", dest: "BKK", date: "2026-06-01" },
        { orig: "BOM", dest: "DXB", date: "2026-03-01" }
    ];

    for (const r of routes) {
        console.log(`\n✈️ Testing Route: ${r.orig} -> ${r.dest} on ${r.date}...`);
        const params = new URLSearchParams({
            originLocationCode: r.orig,
            destinationLocationCode: r.dest,
            departureDate: r.date,
            adults: "1",
            max: "3",
            currencyCode: "EUR"
        });

        try {
            const start = Date.now();
            const res = await fetch(`${SEARCH_URL}?${params.toString()}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            const duration = Date.now() - start;

            if (!res.ok) {
                console.error(`❌ FAILED (${duration}ms):`, data.errors?.[0]?.title);
                if (data.errors?.[0]?.code) console.error("   Code:", data.errors[0].code);
            } else {
                console.log(`✅ SUCCESS (${duration}ms): Found ${data.data?.length} offers.`);
                if (data.data?.length > 0) {
                    console.log("   Example Airline:", data.data[0].validatingAirlineCodes[0]);
                }
            }
        } catch (e) {
            console.error("Network Error:", e);
        }
    }
}

runTest();
