import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FlightSearch from "../flights/FlightSearch";
import HotelSearch from "../hotels/HotelSearch";
import CarSearch from "../cars/CarSearch";
import EsimSearch from "../esim/EsimSearch";
import AuthGate from "../common/AuthGate";
import IntelligenceBadge from "./IntelligenceBadge";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function SearchBox({ onSearchSuccess }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState(() => {
    return localStorage.getItem("jettura_active_search_tab") || "flights";
  });

  React.useEffect(() => {
    localStorage.setItem("jettura_active_search_tab", activeTab);
  }, [activeTab]);

  return (
    <Card className="border-transparent bg-white/50 dark:bg-slate-950/40 backdrop-blur-2xl rounded-none relative z-20 overflow-visible transition-all duration-500 shadow-none border-none">
      <CardContent className="px-[var(--space-sm)] py-[var(--space-md)] sm:px-[var(--space-md)] sm:py-[var(--space-md)] overflow-visible">
        {!user ? (
          <AuthGate />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full overflow-visible">
            {/* Header: Tabs & Intelligence Status */}
            <div className="flex flex-col min-[760px]:flex-row justify-between items-center gap-4 mb-6 overflow-visible relative">
              <TabsList className="flex justify-center min-[760px]:justify-start min-[760px]:ml-4 bg-transparent p-0 gap-[var(--space-sm)]">
                <TabsTrigger value="flights" className="search-tab-trigger">
                  {t("search.tabs.flights")}
                </TabsTrigger>
                <TabsTrigger value="hotels" className="search-tab-trigger">
                  {t("search.tabs.hotels")}
                </TabsTrigger>
                <TabsTrigger value="cars" className="search-tab-trigger">
                  {t("search.tabs.cars")}
                </TabsTrigger>
                <TabsTrigger value="esim" className="search-tab-trigger">
                  {t("search.tabs.esim")}
                </TabsTrigger>
              </TabsList>

              <style>{`
                .search-tab-trigger {
                  padding: 0;
                  border: none;
                  background: transparent;
                  font-size: var(--font-size-sm);
                  font-weight: 900;
                  text-transform: uppercase;
                  font-style: italic;
                  letter-spacing: 0.05em;
                  transition: all 0.3s;
                }
                
                .search-tab-trigger[data-state=active] {
                  color: var(--brand-color) !important;
                  background: transparent !important;
                  box-shadow: none !important;
                  transform: scale(1.05);
                }
                .search-tab-trigger:not([data-state=active]) {
                  color: rgba(39, 39, 42, 0.4);
                }
                .dark .search-tab-trigger:not([data-state=active]) {
                  color: rgba(161, 161, 170, 0.6);
                }
              `}</style>

              <IntelligenceBadge />
            </div>

            <TabsContent value="flights" className="search-tab-content">
              <FlightSearch onSearchSuccess={onSearchSuccess} />
            </TabsContent>

            <TabsContent value="hotels" className="search-tab-content">
              <HotelSearch onSearchSuccess={onSearchSuccess} />
            </TabsContent>

            <TabsContent value="cars" className="search-tab-content">
              <CarSearch onSearchSuccess={onSearchSuccess} />
            </TabsContent>

            <TabsContent value="esim" className="search-tab-content">
              <EsimSearch onSearchSuccess={onSearchSuccess} />
            </TabsContent>

            <style>{`
              .search-tab-content {
                outline: none;
                overflow: visible;
                margin-top: 0;
                border: none;
                box-shadow: none;
                background: transparent;
                padding: 0;
              }
            `}</style>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}