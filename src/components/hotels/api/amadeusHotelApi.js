
import { getAmadeusToken } from "../../../services/amadeusApi.js";

const BASE_URL_V1 = "/api-gds/v1";
const BASE_URL_V3 = "/api-gds/v3";

/**
 * Step 1: Hotel List API - Search hotels by city/geocode
 * https://developers.amadeus.com/self-service/category/hotels/api-doc/hotel-list
 */
export async function searchHotelsByCity(params) {
    const token = await getAmadeusToken();

    try {
        const url = new URL(`${BASE_URL_V1}/reference-data/locations/hotels/by-city`, window.location.origin);

        url.searchParams.append("cityCode", params.cityCode.toUpperCase());
        url.searchParams.append("radius", params.radius || 50);
        url.searchParams.append("radiusUnit", "KM");
        url.searchParams.append("hotelSource", "ALL");

        const res = await fetch(url.toString(), {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(`Hotel List API Error: ${err.errors?.[0]?.detail || res.status}`);
        }

        const json = await res.json();
        return json;

    } catch (e) {
        console.error("❌ Step 1 Failed:", e);
        throw e;
    }
}

/**
 * Step 2: Hotel Search API - Get offers with pricing
 * https://developers.amadeus.com/self-service/category/hotels/api-doc/hotel-search
 */
export async function getHotelOffers(params) {
    const token = await getAmadeusToken();

    try {
        const url = new URL(`${BASE_URL_V3}/shopping/hotel-offers`, window.location.origin);

        url.searchParams.append("hotelIds", params.hotelIds.join(","));
        url.searchParams.append("adults", params.adults || 2);
        url.searchParams.append("checkInDate", params.checkInDate);
        url.searchParams.append("checkOutDate", params.checkOutDate);

        if (params.roomQuantity) {
            url.searchParams.append("roomQuantity", params.roomQuantity);
        }

        url.searchParams.append("currency", params.currency || "EUR");
        url.searchParams.append("paymentPolicy", "NONE");
        url.searchParams.append("bestRateOnly", "true");

        const res = await fetch(url.toString(), {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(`Hotel Search API Error: ${err.errors?.[0]?.detail || res.status}`);
        }

        const json = await res.json();
        return json;

    } catch (e) {
        console.error("❌ Step 2 Failed:", e);
        throw e;
    }
}

/**
 * Transform Amadeus Hotel data to Jettura format
 * Combines Hotel List + Hotel Search results
 */
export function transformAmadeusHotelsToJettura(hotelsData, offersData) {
    if (!hotelsData?.data) return [];

    const hotels = hotelsData.data;
    const offers = offersData?.data || [];

    // Create map of offers by hotel ID
    const offersByHotel = {};
    offers.forEach(offer => {
        const hotelId = offer.hotel?.hotelId;
        if (hotelId) {
            if (!offersByHotel[hotelId]) {
                offersByHotel[hotelId] = [];
            }
            offersByHotel[hotelId].push(offer);
        }
    });

    // Transform to Jettura format
    return hotels.map(hotel => {
        const hotelOffers = offersByHotel[hotel.hotelId] || [];
        const bestOffer = hotelOffers[0];

        // Extract offer details
        const offer = bestOffer?.offers?.[0];
        const room = offer?.room;
        const price = offer?.price;

        return {
            // Hotel Info (from Hotel List API)
            id: hotel.hotelId,
            name: hotel.name,
            chainCode: hotel.chainCode,
            iataCode: hotel.iataCode,

            // Location
            address: {
                city: hotel.address?.cityName || "",
                country: hotel.address?.countryCode || "",
                postalCode: hotel.address?.postalCode || "",
                lines: hotel.address?.lines || []
            },
            location: {
                latitude: hotel.geoCode?.latitude,
                longitude: hotel.geoCode?.longitude
            },
            distance: hotel.distance,

            // Rating & Amenities (from Hotel Search API)
            rating: bestOffer?.hotel?.rating || 0,
            amenities: bestOffer?.hotel?.amenities || [],

            // Room Info
            room: room ? {
                type: room.type,
                typeEstimated: room.typeEstimated,
                description: room.description?.text || "",
                beds: room.beds,
                bedType: room.bedType
            } : null,

            // Pricing (from Hotel Search API)
            price: price ? {
                total: parseFloat(price.total),
                base: parseFloat(price.base),
                currency: price.currency,
                taxes: price.taxes?.map(tax => ({
                    amount: parseFloat(tax.amount),
                    currency: tax.currency,
                    code: tax.code,
                    included: tax.included
                })) || [],
                variations: price.variations
            } : null,

            // Policies
            policies: bestOffer?.policies || {},

            // Availability
            available: !!bestOffer,
            self: bestOffer?.self || null,

            // Source
            source: "amadeus",
            lastUpdate: hotel.lastUpdate
        };
    });
}
