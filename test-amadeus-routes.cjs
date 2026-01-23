
const fetch = require('node-fetch-commonjs');

const CLIENT_ID = "8hyYePMs7VzfZlbTKyjAESM3KgfFuMT2";
const CLIENT_SECRET = "vCu7Ixcot2wTi2VB";
const AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const SEARCH_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers";

async function runTest() {
    // 1. Get Token
    console.log("🔑 Getting Token...");
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

    // 2. Search Flight (BER -> JFK)
    console.log("✈️ Searching BER -> JFK...");
    const params = new URLSearchParams({
        originLocationCode: "BER",
        destinationLocationCode: "JFK",
        departureDate: "2026-02-01", // ~10 days from "now" (assuming 2026)
        adults: "1",
        nonStop: "false",
        max: "5",
        currencyCode: "EUR"
    });

    try {
        const searchRes = await fetch(`${SEARCH_URL}?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const searchData = await searchRes.json();

        if (!searchRes.ok) {
            console.error("❌ Search Failed:", JSON.stringify(searchData, null, 2));
        } else {
            console.log(`✅ Search Success! Found ${searchData.data?.length} offers.`);
        }
    } catch (e) {
        console.error("Network Error:", e);
    }

    // 3. Search Flight (LHR -> CDG) - Valid Baseline
    console.log("\n✈️ Searching LHR -> CDG (Baseline)...");
    const params2 = new URLSearchParams({
        originLocationCode: "LHR",
        destinationLocationCode: "CDG",
        departureDate: "2026-03-01",
        adults: "1",
        max: "5"
    });

    try {
        const searchRes2 = await fetch(`${SEARCH_URL}?${params2.toString()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const searchData2 = await searchRes2.json();
        if (!searchRes2.ok) {
            console.error("❌ Baseline Search Failed:", JSON.stringify(searchData2, null, 2));
        } else {
            console.log(`✅ Baseline Success! Found ${searchData2.data?.length} offers.`);
        }
    } catch (e) {
        console.error("Network Error:", e);
    }
}

runTest();
