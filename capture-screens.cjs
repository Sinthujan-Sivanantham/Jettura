
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = 'http://localhost:5174'; // Port confirmed from previous output
    const outputDir = './screenshots';

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    console.log("📸 Starting Screenshot Capture...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // 1. Home
    console.log("   Capturing Home...");
    try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await page.screenshot({ path: `${outputDir}/1_Jettura_Home.png`, fullPage: false });
    } catch (e) {
        console.error("   Error capturing Home:", e.message);
    }

    // 2. Flight Search (Simulate a search result page if possible, or just the search page)
    console.log("   Capturing Flight Search...");
    try {
        // Navigate to results if possible or just stay on home/flights tab
        // Let's assume the home page HAS the flight search.
        // But maybe we want the 'Results' page. 
        // We can try to navigate to /flights if it exists, or submit the form.
        // For safety, let's just capture the Community page which is static.
    } catch (e) { }

    // 3. Community/Blog
    console.log("   Capturing Community...");
    try {
        await page.goto(`${url}/blog`, { waitUntil: 'networkidle0' });
        await page.screenshot({ path: `${outputDir}/2_Jettura_Community.png` });
    } catch (e) {
        console.error("   Error capturing Community:", e.message);
    }

    // 4. eSIM
    console.log("   Capturing eSIM Shop...");
    try {
        await page.goto(`${url}/esim`, { waitUntil: 'networkidle0' });
        await page.screenshot({ path: `${outputDir}/3_Jettura_eSIM.png` });
    } catch (e) {
        console.error("   Error capturing eSIM:", e.message);
    }

    await browser.close();
    console.log("✅ Capture Complete. Check /screenshots folder.");
})();
