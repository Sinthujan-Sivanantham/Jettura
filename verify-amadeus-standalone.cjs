
const fetch = require('node-fetch-commonjs');

const CLIENT_ID = "8hyYePMs7VzfZlbTKyjAESM3KgfFuMT2";
const CLIENT_SECRET = "vCu7Ixcot2wTi2VB";
const URL = "https://test.api.amadeus.com/v1/security/oauth2/token";

async function testToken() {
    console.log("🔍 Testing Amadeus Token...");
    console.log(`ID: ${CLIENT_ID}`);
    // console.log(`Secret: ${CLIENT_SECRET}`);

    const body = new URLSearchParams();
    body.append("grant_type", "client_credentials");
    body.append("client_id", CLIENT_ID);
    body.append("client_secret", CLIENT_SECRET);

    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("❌ Token Error:", data);
        } else {
            console.log("✅ Token Success!", data.access_token ? "Has Token" : "No Token?");
        }

    } catch (e) {
        console.error("Network Error:", e);
    }
}

testToken();
