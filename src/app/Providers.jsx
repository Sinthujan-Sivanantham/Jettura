"use client";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "@/styles/index.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import CookieBanner from "@/components/common/CookieBanner";

function MainContent({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [maintenance, setMaintenance] = useState(false);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMaintenance(localStorage.getItem("jettura_maintenance_mode") === "true");
      setIsDemoAdmin(localStorage.getItem("jettura_demo_admin_mode") === "true");
    }
  }, []);

  const isAdmin = user?.email?.endsWith("@jettura.com") || user?.email === "admin@jettura.com" || isDemoAdmin;
  const isExcludedRoute = pathname === "/admin" || pathname === "/auth";

  if (maintenance && !isAdmin && !isExcludedRoute) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20 min-h-[70vh] space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center animate-pulse">
          <Wrench size={40} />
        </div>
        <div className="space-y-3 max-w-lg">
          <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white">
            Wartungsarbeiten
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Wir führen aktuell geplante Wartungsarbeiten durch, um Jettura noch besser zu machen. Wir sind in Kürze wieder für dich da!
          </p>
        </div>
        <a href="/admin" className="text-xs font-black uppercase tracking-widest text-[var(--brand-color)] hover:underline italic">
          Als Admin anmelden &rarr;
        </a>
      </div>
    );
  }

  return children;
}

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
              <Navbar />
              <main className="flex-grow">
                <MainContent>{children}</MainContent>
              </main>
              <Footer />
              <CookieBanner />
            </div>
          </LanguageProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
