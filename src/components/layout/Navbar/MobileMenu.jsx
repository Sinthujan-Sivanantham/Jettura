"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X, Menu, User, ShieldAlert, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../../shared/ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileMenu({ isOpen, setIsOpen, user, profile, handleLogout, navItems, t }) {
  const pathname = usePathname();
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDemoAdmin(localStorage.getItem("jettura_demo_admin_mode") === "true");
    }
  }, []);

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@jettura.com").split(",").map(e => e.trim());
  const isAdmin = adminEmails.includes(user?.email || "") || user?.email?.endsWith("@jettura.com") || isDemoAdmin;

  return (
    <>
      {/* Hamburger Button – nur auf Mobile sichtbar */}
      <div className="flex min-[761px]:hidden items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menü öffnen"
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 top-14 bg-black/30 backdrop-blur-sm z-[90] min-[761px]:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer – volle Breite */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed left-0 right-0 top-14 z-[95] min-[761px]:hidden"
          >
            <div className="mx-4 mt-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Nav Links */}
              <nav className="px-2 pt-3 pb-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors duration-150 ${
                        isActive
                          ? "text-[var(--brand-color)] bg-[var(--brand-color)]/8 italic"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <span>{t ? t(item.translationKey) : item.name}</span>
                      {isActive && <ChevronRight size={16} className="text-[var(--brand-color)]" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="mx-4 border-t border-zinc-100 dark:border-zinc-800 my-1" />

              {/* Language Switcher */}
              <div className="px-2 py-1">
                <LanguageSwitcher variant="menuItem" onClick={() => setIsOpen(false)} />
              </div>

              <div className="mx-4 border-t border-zinc-100 dark:border-zinc-800 my-1" />

              {/* User Section */}
              <div className="px-2 py-2">
                {user ? (
                  <div className="flex flex-col gap-1">
                    {/* Profile Link */}
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 ${
                        pathname === "/profile"
                          ? "bg-[var(--brand-color)]/8 text-[var(--brand-color)]"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                          <User size={18} strokeWidth={2} />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-black uppercase tracking-widest leading-none">
                          {t("nav.profile")}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-0.5 truncate">
                          {t("nav.profileSubtitle")}
                        </span>
                      </div>
                      <ChevronRight size={16} className="ml-auto flex-shrink-0 text-zinc-400" />
                    </Link>

                    {/* Admin Link */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-150 ${
                          pathname === "/admin"
                            ? "bg-red-50 dark:bg-red-950/30 text-red-500"
                            : "hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <ShieldAlert size={16} className="text-red-500 animate-pulse flex-shrink-0" />
                        <span className="text-xs font-black uppercase tracking-widest text-red-500">Admin Panel</span>
                      </Link>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 mx-0 mt-1 mb-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold uppercase tracking-widest text-xs transition-colors duration-150"
                    >
                      <LogOut size={15} />
                      <span>{t("nav.logout")}</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-2 pb-2">
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold uppercase tracking-widest text-xs transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "var(--brand-color)" }}
                      >
                        <User size={15} />
                        <span>{t("nav.login")}</span>
                      </button>
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
