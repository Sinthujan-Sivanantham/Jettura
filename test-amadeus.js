// Test script to verify Amadeus API credentials
// Run this in browser console or as a separate test

async function testAmadeusAuth() {
    const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

    console.log("Testing Amadeus API credentials...");
    console.log("Client ID:", clientId ? `${clientId.substring(0, 8)}...` : "MISSING");
    console.log("Client Secret:", clientSecret ? "Present" : "MISSING");

    try {
        const res = await fetch("/api-gds/v1/security/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        });

        const data = await res.json();

        if (res.ok) {
            console.log("✅ Authentication successful!");
            console.log("Token expires in:", data.expires_in, "seconds");
            console.log("Token:", data.access_token.substring(0, 20) + "...");

            // Test location search
            const searchRes = await fetch(`/api-gds/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=BERLIN&view=LIGHT`, {
                headers: { Authorization: `Bearer ${data.access_token}` }
            });

            const searchData = await searchRes.json();

            if (searchRes.ok) {
                console.log("✅ Location search successful!");
                console.log("Found", searchData.data.length, "results");
                console.log("First result:", searchData.data[0]);
            } else {
                console.error("❌ Location search failed:", searchData);
            }
        } else {
            console.error("❌ Authentication failed:", data);
        }
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    testAmadeusAuth();
}
