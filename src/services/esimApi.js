/**
 * eSIM Service 
 * This service handles interactions with eSIM providers (e.g., Airalo, SimLocal).
 * In a real-world scenario, you would use API keys and fetch real data.
 */

const MOCK_PACKAGES = [
    { id: "usa-1", country: "USA", price: 15, data: "10GB", duration: "30 Days", type: "Local" },
    { id: "jp-1", country: "Japan", price: 22, data: "Unlimited", duration: "15 Days", type: "Local" },
    { id: "tr-1", country: "Turkey", price: 8, data: "5GB", duration: "7 Days", type: "Local" },
    { id: "th-1", country: "Thailand", price: 12, data: "15GB", duration: "30 Days", type: "Local" },
    { id: "eu-1", country: "Europe", price: 25, data: "20GB", duration: "30 Days", type: "Regional" },
    { id: "glob-1", country: "Global", price: 45, data: "10GB", duration: "365 Days", type: "Global" },
];

export const esimApi = {
    /**
     * Search for eSIM packages by country or region
     */
    searchPackages: async (query = "") => {
        // Simulating API Latency
        await new Promise(resolve => setTimeout(resolve, 800));

        if (!query) return MOCK_PACKAGES;

        return MOCK_PACKAGES.filter(pkg =>
            pkg.country.toLowerCase().includes(query.toLowerCase()) ||
            pkg.type.toLowerCase().includes(query.toLowerCase())
        );
    },

    /**
     * Get popular destinations
     */
    getPopular: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_PACKAGES.slice(0, 4);
    },

    /**
     * Create an order (Mock)
     */
    createOrder: async (packageId, userId) => {
        console.log(`Creating order for ${packageId} for user ${userId}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            success: true,
            orderId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ESIM-ACTIVATION-DATA"
        };
    }
};
