"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X, Menu, User, ShieldAlert } from "lucide-react";
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

  const isAdmin = user?.email?.endsWith("@jettura.com") || user?.email === "admin@jettura.com" || isDemoAdmin;

  const mobileLinkStyles = "block py-2 sm:py-3 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg font-black uppercase tracking-tight transition-colors duration-200 hover:text-[var(--brand-color)] text-zinc-600 dark:text-zinc-400";
  const activeStyle = "italic text-[var(--brand-color)]";

  return (
    <>
      <div className="flex min-[761px]:hidden items-center gap-3">
        <ThemeToggle />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-zinc-600 dark:text-zinc-300 transition-colors duration-200 hover:text-[var(--brand-color)]"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-14 sm:top-16 left-4 right-auto w-[320px] max-w-[calc(100vw-2rem)] bg-background border border-zinc-200/80 dark:border-zinc-800/80 rounded-[2rem] min-[761px]:hidden shadow-2xl mt-2 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-5">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={isActive ? `${mobileLinkStyles} ${activeStyle}` : mobileLinkStyles}
                  >
                    {t ? t(item.translationKey) : item.name}
                  </Link>
                );
              })}
              
              <hr className="border-zinc-100 dark:border-zinc-800" />
              <LanguageSwitcher variant="menuItem" />
              <hr className="border-zinc-100 dark:border-zinc-800" />

              {user ? (
                <div className="flex flex-col gap-4">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className={pathname === "/profile"
                      ? `flex items-center gap-3 py-3 ${activeStyle}`
                      : "flex items-center gap-3 py-3 text-zinc-600 dark:text-zinc-400"
                    }
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border-2 border-zinc-100 dark:border-zinc-800 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800">
                        <User size={20} strokeWidth={2} />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg font-black uppercase tracking-tight leading-none">{t("nav.profile")}</span>
                      <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{t("nav.profileSubtitle")}</span>
                    </div>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className={pathname === "/admin"
                        ? `flex items-center gap-3 py-2 text-red-500 font-black uppercase italic tracking-widest text-[9px]`
                        : "flex items-center gap-3 py-2 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-[9px]"
                      }
                    >
                      <ShieldAlert size={14} className="text-red-500 animate-pulse" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full rounded-xl font-bold uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs h-10 sm:h-12"
                  >
                    <LogOut size={16} className="mr-2" /> {t("nav.logout")}
                  </Button>
                </div>
              ) : (
                <Link href="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full text-white rounded-xl font-bold text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs uppercase tracking-widest h-10 sm:h-12" style={{ backgroundColor: "var(--brand-color)" }}>
                    {t("nav.login")}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
