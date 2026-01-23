import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { LanguageProvider } from "./context/LanguageContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AIPlanner from "./pages/AIPlanner";
import ESIMStore from "./pages/ESIMStore";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import SavedFlightPage from "./pages/SavedFlightPage";
import SavedHotelPage from "./pages/SavedHotelPage";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <LanguageProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/ai-planner" element={<AIPlanner />} />
                    <Route path="/esim" element={<ESIMStore />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/saved-flight/:id" element={<SavedFlightPage />} />
                    <Route path="/profile/saved-hotel/:id" element={<SavedHotelPage />} />

                    {/* Legal Pages */}
                    <Route path="/impressum" element={<Impressum />} />
                    <Route path="/datenschutz" element={<Datenschutz />} />
                    <Route path="/agb" element={<AGB />} />

                    <Route path="*" element={<Home />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </LanguageProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}