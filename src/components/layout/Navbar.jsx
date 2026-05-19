"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

import Logo from "./Navbar/Logo";
import DesktopNav from "./Navbar/DesktopNav";
import DesktopActions from "./Navbar/DesktopActions";
import MobileMenu from "./Navbar/MobileMenu";

export default function Navbar() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const themeContext = useTheme();
  const setColor = themeContext?.setColor || (() => { });
  const { t } = useLanguage();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) { setProfile(null); return; }
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data);
    }
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
    router.push("/auth");
  };

  const navLinkStyles = ({ isActive }) => ({
    className: `transition-colors duration-200 font-black uppercase tracking-tight text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs lg:text-sm ${isActive ? "italic" : "text-zinc-600 dark:text-zinc-400 hover:text-[var(--brand-color)]"}`,
    style: isActive ? { color: "var(--brand-color)" } : undefined
  });

  const navItems = [
    { name: "Start", path: "/", translationKey: "nav.home" },
    { name: "KI Planner", path: "/ai-planner", translationKey: "nav.planner" },
    { name: "Blog", path: "/blog", translationKey: "nav.blog" },
    { name: "eSIM", path: "/esim", translationKey: "nav.esim" },
  ];

  return (
    <nav className="border-b sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800">
      <div className="max-w-[1440px] mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        <Logo />
        <DesktopNav navItems={navItems} navLinkStyles={navLinkStyles} t={t} />
        <DesktopActions
          user={user}
          profile={profile}
          handleLogout={handleLogout}
          setColor={setColor}
          navLinkStyles={navLinkStyles}
          t={t}
        />
        <MobileMenu
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          user={user}
          profile={profile}
          handleLogout={handleLogout}
          navItems={navItems}
          navLinkStyles={navLinkStyles}
          t={t}
        />
      </div>
    </nav>
  );
}