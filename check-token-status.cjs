
const fetch = require('node-fetch-commonjs');
require('dotenv').config();

const CLIENT_ID = process.env.VITE_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_AMADEUS_CLIENT_SECRET;
const TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";

async function checkToken() {
    console.log(`🔍 Checking Amadeus Token...`);
    console.log(`   Client ID: ${CLIENT_ID?.substring(0, 6)}...`);
    console.log(`   URL: ${TOKEN_URL}`);

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);

    try {
        const start = Date.now();
        const res = await fetch(TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });
        const duration = Date.now() - start;

        console.log(`⏱️ Duration: ${duration}ms`);

        if (!res.ok) {
            const text = await res.text();
            console.error(`❌ Token Failed: ${res.status} ${res.statusText}`);
            console.error(`   Body: ${text}`);
        } else {
            const data = await res.json();
            console.log("✅ Token Generated Successfully!");
            console.log(`   Access Token: ${data.access_token.substring(0, 10)}...`);
            console.log(`   Expires in: ${data.expires_in}s`);
            console.log(`   State: ${data.state}`);
        }

    } catch (e) {
        console.error("❌ Network Error:", e.message);
    }
}

checkToken();
