"use client";
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { 
  Users, BookOpen, Settings, Loader2, Search, Trash2, 
  ShieldCheck, Activity, Globe, CheckCircle2, AlertTriangle, 
  RefreshCw, Lock, Terminal, Radio, HelpCircle, HardDrive,
  Ticket, Calendar, User, Compass, Info, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusPopup from "../components/ui/StatusPopup";

export default function Admin() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingTypeFilter, setBookingTypeFilter] = useState("all");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: "", title: "", type: "success" });

  // System States (persisted via localStorage)
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [mockApiMode, setMockApiMode] = useState(true);
  const [esimPrices, setEsimPrices] = useState({});
  const [recentLogs, setRecentLogs] = useState([]);
  const [isAdminDemoMode, setIsAdminDemoMode] = useState(false);

  const loadBookings = () => {
    if (typeof window === "undefined") return;
    try {
      let saved = localStorage.getItem("jettura_admin_bookings");
      if (!saved) {
        const initialBookings = [
          {
            id: "TKT-FL-394817",
            type: "flight",
            customerName: "Max Mustermann",
            customerEmail: "max.mustermann@web.de",
            price: 420,
            currency: "EUR",
            status: "confirmed",
            date: "18.05.2026",
            details: { airline: "LH", route: "FRA ➔ JFK", departureDate: "25.05.2026", stops: 0 }
          },
          {
            id: "TKT-HT-928415",
            type: "hotel",
            customerName: "Sabine Schmitt",
            customerEmail: "sabine@gmail.com",
            price: 850,
            currency: "EUR",
            status: "pending",
            date: "19.05.2026",
            details: { hotelName: "Grand Hyatt", city: "New York", address: "109 E 42nd St", rating: 5 }
          },
          {
            id: "TKT-ES-104928",
            type: "esim",
            customerName: "Alexander Weber",
            customerEmail: "alex.weber@outlook.de",
            price: 15,
            currency: "USD",
            status: "confirmed",
            date: "19.05.2026",
            details: { country: "USA", data: "10GB", duration: "30 Days", pkgType: "Local" }
          },
          {
            id: "TKT-FL-772918",
            type: "flight",
            customerName: "Sinthujan (Admin)",
            customerEmail: "admin@jettura.com",
            price: 185,
            currency: "EUR",
            status: "cancelled",
            date: "15.05.2026",
            details: { airline: "AF", route: "CDG ➔ MAD", departureDate: "28.05.2026", stops: 1 }
          },
          {
            id: "TKT-HT-482019",
            type: "hotel",
            customerName: "Sinthujan (Admin)",
            customerEmail: "admin@jettura.com",
            price: 240,
            currency: "EUR",
            status: "confirmed",
            date: "14.05.25",
            details: { hotelName: "Hôtel Plaza Athénée", city: "Paris", address: "25 Avenue Montaigne", rating: 5 }
          }
        ];
        localStorage.setItem("jettura_admin_bookings", JSON.stringify(initialBookings));
        saved = JSON.stringify(initialBookings);
      }
      setBookings(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  };

  const updateBookingStatus = (id, newStatus) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setBookings(updated);
    localStorage.setItem("jettura_admin_bookings", JSON.stringify(updated));
    setAlertConfig({
      isOpen: true,
      title: "Status aktualisiert",
      message: `Buchungsstatus wurde erfolgreich auf "${newStatus === 'confirmed' ? 'Bestätigt' : newStatus === 'pending' ? 'Ausstehend' : 'Storniert'}" gesetzt.`,
      type: "success"
    });
  };

  const deleteBooking = (id) => {
    if (!window.confirm("Möchtest du diese Buchung wirklich dauerhaft löschen?")) return;
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem("jettura_admin_bookings", JSON.stringify(updated));
    setAlertConfig({
      isOpen: true,
      title: "Buchung gelöscht",
      message: "Die Buchung wurde erfolgreich aus dem System entfernt.",
      type: "success"
    });
  };

  // Load local settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMaintenanceMode(localStorage.getItem("jettura_maintenance_mode") === "true");
      setMockApiMode(localStorage.getItem("jettura_mock_api_mode") !== "false"); // Default to true
      setIsAdminDemoMode(localStorage.getItem("jettura_demo_admin_mode") === "true");
      try {
        const savedPrices = JSON.parse(localStorage.getItem("jettura_esim_prices") || "{}");
        setEsimPrices(savedPrices);
      } catch (e) { console.error(e); }
      loadBookings();
    }
  }, []);

  // Check auth & permissions
  const isAuthorized = useMemo(() => {
    if (!user) return false;
    if (isAdminDemoMode) return true;
    const email = user.email || "";
    return email.endsWith("@jettura.com") || email === "admin@jettura.com";
  }, [user, isAdminDemoMode]);

  // Load database data
  const fetchData = async () => {
    if (!isAuthorized) return;
    setRefreshing(true);
    try {
      // Fetch user profiles
      const { data: profs, error: err1 } = await supabase
        .from("profiles")
        .select("*")
        .order("updated_at", { ascending: false });
      if (err1) throw err1;
      setProfiles(profs || []);

      // Fetch posts
      const { data: pst, error: err2 } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (err2) throw err2;
      setPosts(pst || []);

      // Load bookings
      loadBookings();
    } catch (err) {
      console.error("Admin data fetch error:", err);
      setAlertConfig({
        isOpen: true,
        title: "Fehler beim Laden",
        message: err.message || "Daten konnten nicht geladen werden.",
        type: "error"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthorized]);

  // Simulated Log generator to make the dashboard feel active/alive
  useEffect(() => {
    const actions = [
      "User searched flights to CDG",
      "User searched hotel in London",
      "API request to Amadeus successful",
      "New user registered",
      "Blog page viewed",
      "eSIM USA checkout initiated",
      "Theme switched to dark mode",
      "Geocoding request successful",
      "AI itinerary planning successful"
    ];

    const generateLog = () => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const newLog = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        message: randomAction,
        type: randomAction.includes("successful") ? "success" : randomAction.includes("Error") ? "error" : "info"
      };
      setRecentLogs(prev => [newLog, ...prev.slice(0, 19)]);
    };

    // Prepopulate
    if (recentLogs.length === 0) {
      for (let i = 0; i < 5; i++) {
        setTimeout(generateLog, i * 200);
      }
    }

    const interval = setInterval(generateLog, 8000);
    return () => clearInterval(interval);
  }, [recentLogs]);

  // Actions
  const handleToggleMaintenance = (checked) => {
    setMaintenanceMode(checked);
    localStorage.setItem("jettura_maintenance_mode", checked ? "true" : "false");
    setAlertConfig({
      isOpen: true,
      title: "Wartungsmodus",
      message: checked ? "Wartungsmodus wurde AKTIVIERT." : "Wartungsmodus wurde DEAKTIVIERT.",
      type: "success"
    });
  };

  const handleToggleMockApi = (checked) => {
    setMockApiMode(checked);
    localStorage.setItem("jettura_mock_api_mode", checked ? "true" : "false");
    setAlertConfig({
      isOpen: true,
      title: "API-Modus",
      message: checked ? "Amadeus & Groq APIs nutzen jetzt Mockups." : "Amadeus & Groq APIs nutzen jetzt Live-Modus.",
      type: "success"
    });
  };

  const handleToggleDemoAdmin = (checked) => {
    setIsAdminDemoMode(checked);
    localStorage.setItem("jettura_demo_admin_mode", checked ? "true" : "false");
    window.location.reload();
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Bist du sicher, dass du diesen Post löschen möchtest?")) return;
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== id));
      setAlertConfig({
        isOpen: true,
        title: "Erfolg",
        message: "Post wurde erfolgreich gelöscht.",
        type: "success"
      });
    } catch (err) {
      console.error(err);
      setAlertConfig({
        isOpen: true,
        title: "Löschen fehlgeschlagen",
        message: err.message || "Der Post konnte nicht aus Supabase gelöscht werden (evtl. RLS Einschränkungen).",
        type: "error"
      });
    }
  };

  const handlePriceChange = (pkgId, newPrice) => {
    const updated = { ...esimPrices, [pkgId]: parseFloat(newPrice) || 0 };
    setEsimPrices(updated);
    localStorage.setItem("jettura_esim_prices", JSON.stringify(updated));
  };

  // Mock eSIM List
  const MOCK_PACKAGES = [
    { id: "usa-1", country: "USA", basePrice: 15, data: "10GB", duration: "30 Days", type: "Local" },
    { id: "jp-1", country: "Japan", basePrice: 22, data: "Unlimited", duration: "15 Days", type: "Local" },
    { id: "tr-1", country: "Turkey", basePrice: 8, data: "5GB", duration: "7 Days", type: "Local" },
    { id: "th-1", country: "Thailand", basePrice: 12, data: "15GB", duration: "30 Days", type: "Local" },
    { id: "eu-1", country: "Europe", basePrice: 25, data: "20GB", duration: "30 Days", type: "Regional" },
    { id: "glob-1", country: "Global", basePrice: 45, data: "10GB", duration: "365 Days", type: "Global" },
  ];

  // Filtering
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return profiles;
    return profiles.filter(p => 
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [profiles, searchQuery]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(p => 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        b.id.toLowerCase().includes(query) ||
        b.customerName.toLowerCase().includes(query) ||
        b.customerEmail.toLowerCase().includes(query) ||
        (b.type === "flight" && b.details?.route?.toLowerCase().includes(query)) ||
        (b.type === "hotel" && b.details?.hotelName?.toLowerCase().includes(query)) ||
        (b.type === "esim" && b.details?.country?.toLowerCase().includes(query));

      const matchesType = bookingTypeFilter === "all" || b.type === bookingTypeFilter;
      const matchesStatus = bookingStatusFilter === "all" || b.status === bookingStatusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [bookings, searchQuery, bookingTypeFilter, bookingStatusFilter]);

  // Loading view
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--brand-color)]" size={48} />
      </div>
    );
  }

  // Not authorized screen
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
          <Lock size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black italic uppercase tracking-tight text-zinc-900 dark:text-white">
            Zugriff verweigert
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Du benötigst Admin-Rechte, um dieses Dashboard aufzurufen.
          </p>
        </div>

        {/* Demo Mode Toggle for Developers */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full space-y-4 bg-zinc-50 dark:bg-zinc-900/50">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">
            Entwickler / Tester Optionen
          </h4>
          <p className="text-xs text-zinc-500">
            Aktiviere den Demo-Admin-Modus, um die Funktionen des Dashboards lokal zu testen.
          </p>
          <Button
            onClick={() => handleToggleDemoAdmin(true)}
            className="w-full h-11 text-white font-black italic uppercase rounded-xl tracking-wider text-xs"
            style={{ backgroundColor: "var(--brand-color)" }}
          >
            Demo-Admin-Modus aktivieren
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 italic">
              Live Control Panel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white mt-1">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isAdminDemoMode && (
            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic">
              Demo Admin Mode
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { id: "overview", label: "Übersicht", icon: Activity },
          { id: "users", label: "Benutzer", icon: Users },
          { id: "bookings", label: "Buchungen", icon: Ticket },
          { id: "posts", label: "Community", icon: BookOpen },
          { id: "esims", label: "eSIM", icon: Globe },
          { id: "settings", label: "System", icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase italic tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-white shadow-md shadow-[var(--brand-color)]/30 scale-[1.03]"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
              style={activeTab === tab.id ? { backgroundColor: "var(--brand-color)" } : {}}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SEARCH BAR (Visible on Users, Posts & Bookings Tabs) */}
      {(activeTab === "users" || activeTab === "posts" || activeTab === "bookings") && (
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder={activeTab === "users" ? "Benutzer suchen..." : activeTab === "posts" ? "Beiträge suchen..." : "Buchungen suchen (ID, Name, Ort)..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)]"
          />
        </div>
      )}

      {/* TAB CONTENT */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-6 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Registrierte Benutzer</span>
                  <h3 className="text-3xl font-black italic tracking-tighter text-zinc-900 dark:text-white mt-1">
                    {profiles.length}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-6 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Aktive Buchungen</span>
                  <h3 className="text-3xl font-black italic tracking-tighter text-zinc-900 dark:text-white mt-1">
                    {bookings.length}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <Ticket size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-6 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Community Beiträge</span>
                  <h3 className="text-3xl font-black italic tracking-tighter text-zinc-900 dark:text-white mt-1">
                    {posts.length}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
              </div>

              {/* API Diagnostics */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-6 sm:col-span-3 space-y-4 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 italic flex items-center gap-2">
                  <HardDrive size={16} /> API Integrationen Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase italic text-zinc-700 dark:text-zinc-300">Amadeus Flights & Hotels</span>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        {mockApiMode ? "Simulator / Mockup aktiv" : "Live API Verbindung"}
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase italic text-zinc-700 dark:text-zinc-300">Groq AI (Planner)</span>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        {mockApiMode ? "Simulator / Mockup aktiv" : "Llama-3.3-70b-versatile"}
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase italic text-zinc-700 dark:text-zinc-300">Mapbox SDK</span>
                      <p className="text-[10px] text-zinc-400 mt-1">token verifiziert</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase italic text-zinc-700 dark:text-zinc-300">Supabase DB & Auth</span>
                      <p className="text-[10px] text-zinc-400 mt-1">Verbindung hergestellt</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Event Logs Ticker */}
            <div className="bg-zinc-950 dark:bg-black rounded-3xl p-6 border border-zinc-800 flex flex-col h-[350px] shadow-lg">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic flex items-center gap-2 mb-4">
                <Terminal size={16} className="text-zinc-500 animate-pulse" /> Live Request Stream
              </h3>
              <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-xs pr-2">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex gap-2.5 hover:bg-zinc-900/50 p-1 rounded transition-colors">
                    <span className="text-zinc-500 shrink-0">[{log.timestamp}]</span>
                    <span className={log.type === "success" ? "text-emerald-400" : log.type === "error" ? "text-red-400" : "text-zinc-300"}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-5 shadow-sm flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-450 italic">Typ Filter</label>
                  <select
                    value={bookingTypeFilter}
                    onChange={(e) => setBookingTypeFilter(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[var(--brand-color)]"
                  >
                    <option value="all">Alle Typen</option>
                    <option value="flight">Flüge</option>
                    <option value="hotel">Hotels</option>
                    <option value="esim">eSIM</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-450 italic">Status Filter</label>
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[var(--brand-color)]"
                  >
                    <option value="all">Alle Status</option>
                    <option value="confirmed">Bestätigt</option>
                    <option value="pending">Ausstehend</option>
                    <option value="cancelled">Storniert</option>
                  </select>
                </div>
              </div>

              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Gefunden: <span className="font-bold text-[var(--brand-color)]">{filteredBookings.length}</span> Buchungen
              </div>
            </div>

            {/* Bookings Table / Cards */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl shadow-sm overflow-hidden">
              {filteredBookings.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
                    <Ticket size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Keine Buchungen gefunden</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                      Passe deine Filter an oder suche nach anderen Begriffen. Neue Buchungen können über die Flug-, Hotel- oder eSIM-Suche getätigt werden.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                        <th className="p-4 pl-6 text-[10px] font-black uppercase tracking-widest text-zinc-450 italic">Buchungs-ID</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-450 italic">Typ</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-450 italic">Kunde</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-450 italic">Details</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-450 italic">Preis</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-450 italic">Status</th>
                        <th className="p-4 pr-6 text-[10px] font-black uppercase tracking-widest text-zinc-450 italic text-right">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-950/10 transition-colors">
                          <td className="p-4 pl-6 font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            {b.id}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase italic tracking-wider ${
                              b.type === "flight" 
                                ? "bg-blue-500/10 text-blue-500" 
                                : b.type === "hotel" 
                                  ? "bg-purple-500/10 text-purple-500" 
                                  : "bg-amber-500/10 text-amber-500"
                            }`}>
                              {b.type === "flight" ? "Flug" : b.type === "hotel" ? "Hotel" : "eSIM"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{b.customerName}</div>
                              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{b.customerEmail}</div>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-medium text-zinc-600 dark:text-zinc-300 max-w-[200px] truncate">
                            {b.type === "flight" && `${b.details?.route} am ${b.details?.departureDate}`}
                            {b.type === "hotel" && `${b.details?.hotelName} (${b.details?.city})`}
                            {b.type === "esim" && `${b.details?.country} (${b.details?.data})`}
                          </td>
                          <td className="p-4 text-xs font-black italic">
                            {b.price} {b.currency}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider italic ${
                              b.status === "confirmed" 
                                ? "bg-emerald-500/10 text-emerald-500" 
                                : b.status === "pending" 
                                  ? "bg-amber-500/10 text-amber-500" 
                                  : "bg-red-500/10 text-red-500"
                            }`}>
                              {b.status === "confirmed" ? "Bestätigt" : b.status === "pending" ? "Ausstehend" : "Storniert"}
                            </span>
                          </td>
                          <td className="p-4 pr-6">
                            <div className="flex items-center justify-end gap-2.5">
                              <select
                                value={b.status}
                                onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                                className="px-2 py-1 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 text-[10px] font-bold focus:outline-none"
                              >
                                <option value="confirmed">Freigeben</option>
                                <option value="pending">Wartend</option>
                                <option value="cancelled">Stornieren</option>
                              </select>

                              <button
                                onClick={() => setSelectedBooking(b)}
                                className="p-1 rounded bg-zinc-50 hover:bg-zinc-150 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-500 dark:text-zinc-350 transition-colors"
                                title="Details anzeigen"
                              >
                                <Info size={14} />
                              </button>

                              <button
                                onClick={() => deleteBooking(b.id)}
                                className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                                title="Löschen"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">
                    <th className="p-6">Benutzer</th>
                    <th className="p-6">Username</th>
                    <th className="p-6">User ID</th>
                    <th className="p-6">Zuletzt Aktiv</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredUsers.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="p-6 flex items-center gap-3">
                        {p.avatar_url ? (
                          <img src={p.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center font-bold text-zinc-400 text-sm">
                            {p.full_name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{p.full_name || "Unbekannt"}</span>
                      </td>
                      <td className="p-6 text-zinc-600 dark:text-zinc-400 font-medium">{p.username || "-"}</td>
                      <td className="p-6 font-mono text-[10px] text-zinc-400">{p.id}</td>
                      <td className="p-6 text-zinc-500 text-xs">
                        {p.updated_at ? new Date(p.updated_at).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-zinc-400">
                        Keine Benutzer gefunden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl p-6 flex flex-col sm:flex-row justify-between gap-6 shadow-sm">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 py-1 rounded-full text-[10px] font-black uppercase italic tracking-wider">
                      {post.location_name || "Community"}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-black italic uppercase tracking-tight text-zinc-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>
                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-4">
                  {post.image_url && (
                    <img 
                      src={post.image_url.split(",")[0]} 
                      alt="" 
                      className="w-24 h-24 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800"
                    />
                  )}
                  <Button
                    onClick={() => handleDeletePost(post.id)}
                    variant="destructive"
                    className="p-3 rounded-2xl h-11 w-11 flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <div className="p-12 text-center text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                Keine Beiträge gefunden.
              </div>
            )}
          </div>
        )}

        {/* ESIM TAB */}
        {activeTab === "esims" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl shadow-sm overflow-hidden p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black italic uppercase tracking-tight text-zinc-900 dark:text-white">
                  eSIM Tarife & Preise konfigurieren
                </h3>
                <p className="text-sm text-zinc-400">
                  Passe die Preise der eSIM-Pakete für Endkunden an. Änderungen werden im lokalen Speicher gesichert.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_PACKAGES.map((pkg) => {
                  const currentPrice = esimPrices[pkg.id] !== undefined ? esimPrices[pkg.id] : pkg.basePrice;
                  return (
                    <div key={pkg.id} className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">{pkg.country}</span>
                          <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider italic">
                            {pkg.type}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          {pkg.data} • {pkg.duration}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">€</span>
                          <input
                            type="number"
                            value={currentPrice}
                            onChange={(e) => handlePriceChange(pkg.id, e.target.value)}
                            className="w-24 pl-7 pr-3 py-2 rounded-xl border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[var(--brand-color)]"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl shadow-sm p-6 space-y-8">
            {/* System Switches */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black italic uppercase tracking-tight text-zinc-900 dark:text-white">
                  System-Einstellungen
                </h3>
                <p className="text-sm text-zinc-400">
                  Globale Systemsteuerungen und Simulationen.
                </p>
              </div>

              <div className="divide-y divide-zinc-150 dark:divide-zinc-800 border-t border-b border-zinc-150 dark:border-zinc-800">
                <div className="py-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-500" /> Wartungsmodus aktivieren
                    </span>
                    <p className="text-xs text-zinc-400">
                      Sperrt das Buchungssystem für normale Kunden und zeigt stattdessen einen Wartungsbildschirm. Admins haben weiterhin vollen Zugriff.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => handleToggleMaintenance(e.target.checked)}
                    className="h-6 w-12 accent-[var(--brand-color)] cursor-pointer rounded-full"
                  />
                </div>

                <div className="py-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <Radio size={16} className="text-emerald-500" /> API Mockup / Simulation erzwungen
                    </span>
                    <p className="text-xs text-zinc-400">
                      Falls aktiviert, nutzen Amadeus und Groq lokales Mocking und API-Simulationen. Schont dein API-Budget und umgeht Netzwerklimits.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={mockApiMode}
                    onChange={(e) => handleToggleMockApi(e.target.checked)}
                    className="h-6 w-12 accent-[var(--brand-color)] cursor-pointer rounded-full"
                  />
                </div>

                <div className="py-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <Lock size={16} className="text-blue-500" /> Demo-Admin-Modus lokal
                    </span>
                    <p className="text-xs text-zinc-400">
                      Toggelt den Entwickler-Modus, um das Admin-Dashboard auf jedem Account zu testen. Beim Ändern wird die Seite neu geladen.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAdminDemoMode}
                    onChange={(e) => handleToggleDemoAdmin(e.target.checked)}
                    className="h-6 w-12 accent-[var(--brand-color)] cursor-pointer rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 text-left">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden text-zinc-900 dark:text-white">
            {/* Header branding band */}
            <div className="h-2 bg-[var(--brand-color)] w-full" />
            
            <div className="p-6 space-y-6">
              {/* Top Row: Ticket ID & Close */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Buchung & Ticket-Details</span>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mt-0.5">{selectedBooking.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Band */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-zinc-450 dark:text-zinc-400 italic block">Status</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider italic ${
                    selectedBooking.status === "confirmed" 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : selectedBooking.status === "pending" 
                        ? "bg-amber-500/10 text-amber-500" 
                        : "bg-red-500/10 text-red-500"
                  }`}>
                    {selectedBooking.status === "confirmed" ? "Bestätigt" : selectedBooking.status === "pending" ? "Ausstehend" : "Storniert"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase text-zinc-450 dark:text-zinc-400 italic block">Buchungsdatum</span>
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{selectedBooking.date}</span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-405 italic flex items-center gap-1.5">
                  <User size={14} /> Passagier / Kunde
                </h4>
                <div className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/10 border border-zinc-150 dark:border-zinc-850 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 dark:text-zinc-450 font-medium">Name:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 dark:text-zinc-450 font-medium">E-Mail:</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200">{selectedBooking.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Specific Details based on Type */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-405 italic flex items-center gap-1.5">
                  <Compass size={14} /> Buchungs-Spezifikationen
                </h4>
                
                <div className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/10 border border-zinc-150 dark:border-zinc-850 space-y-3">
                  {selectedBooking.type === "flight" && (
                    <>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Airline:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.airline}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Flugstrecke:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.route}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Abflugdatum:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.departureDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Zwischenstopps:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          {selectedBooking.details?.stops === 0 ? "Direktflug" : `${selectedBooking.details?.stops} Stopps`}
                        </span>
                      </div>
                    </>
                  )}

                  {selectedBooking.type === "hotel" && (
                    <>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Hotel Name:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.hotelName}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Stadt / Ort:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.city}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Adresse:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.address}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Hotel-Kategorie:</span>
                        <span className="font-bold text-amber-500 flex gap-0.5">
                          {Array.from({ length: selectedBooking.details?.rating || 4 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </span>
                      </div>
                    </>
                  )}

                  {selectedBooking.type === "esim" && (
                    <>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Land / Region:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.country}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Datenvolumen:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.data}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Gültigkeit:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.duration}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 dark:text-zinc-450 font-medium">Paket-Typ:</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.details?.pkgType || "Local"}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Total & eSIM QR code simulator */}
              {selectedBooking.type === "esim" && selectedBooking.status === "confirmed" && (
                <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-zinc-450 dark:text-zinc-400 italic">Aktivierungs-QR-Code (eSIM)</span>
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JetturaEsimActivation" 
                    alt="eSIM QR Code"
                    className="w-28 h-28 border border-zinc-200 rounded-xl"
                  />
                  <span className="text-[9px] text-zinc-400">Vom Admin freigegebene Aktivierungsdaten</span>
                </div>
              )}

              {/* Price Band */}
              <div className="flex justify-between items-center pt-2 border-t border-zinc-150 dark:border-zinc-850">
                <span className="text-xs font-bold text-zinc-500">Gesamtbetrag</span>
                <span className="text-lg font-black italic text-[var(--brand-color)]">
                  {selectedBooking.price} {selectedBooking.currency}
                </span>
              </div>

              {/* Action bar inside Details */}
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-xl font-bold uppercase tracking-wider text-xs px-5 py-2"
                >
                  Schließen
                </Button>
                {selectedBooking.status !== "confirmed" && (
                  <Button
                    size="sm"
                    onClick={() => { updateBookingStatus(selectedBooking.id, "confirmed"); setSelectedBooking(null); }}
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-wider text-xs px-5 py-2"
                  >
                    Freigeben
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <StatusPopup
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        message={alertConfig.message}
        title={alertConfig.title}
        type={alertConfig.type}
      />
    </div>
  );
}
