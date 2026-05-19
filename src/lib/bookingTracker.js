// Helper to track bookings and persist them to localStorage for Admin visibility.
export function trackBooking({ type, price, currency, details, user }) {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem("jettura_admin_bookings");
    const bookings = saved ? JSON.parse(saved) : [];
    
    const newBooking = {
      id: `TKT-${type.toUpperCase().substring(0, 2)}-${Math.floor(100000 + Math.random() * 900000)}`,
      type, // "flight", "hotel", "esim"
      customerName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Gast",
      customerEmail: user?.email || "gast@jettura.com",
      price: parseFloat(price) || 0,
      currency: currency || "EUR",
      status: "confirmed",
      date: new Date().toLocaleDateString("de-DE"),
      details
    };
    
    bookings.unshift(newBooking);
    localStorage.setItem("jettura_admin_bookings", JSON.stringify(bookings));
    console.log("Booking tracked successfully:", newBooking);
  } catch (e) {
    console.error("Failed to track booking:", e);
  }
}
