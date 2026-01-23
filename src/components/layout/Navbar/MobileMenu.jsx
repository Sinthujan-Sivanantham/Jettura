import { NavLink, Link } from "react-router-dom";
import { LogOut, X, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../../shared/ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileMenu({ isOpen, setIsOpen, user, profile, handleLogout, navItems, t }) {

    // Define styles locally for Mobile Menu to ensure they work correctly with Hover/Active states
    const mobileLinkStyles = "block py-3 text-lg font-black uppercase tracking-tight transition-colors duration-200 hover:text-[var(--brand-color)] text-zinc-600 dark:text-zinc-400";
    const activeStyle = "italic text-[var(--brand-color)]";

    return (
        <>
            <div className="flex min-[761px]:hidden items-center gap-3">
                <LanguageSwitcher />
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
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-16 left-0 w-full bg-background border-b border-zinc-200 dark:border-zinc-800 min-[761px]:hidden shadow-2xl"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        isActive
                                            ? `${mobileLinkStyles} ${activeStyle}`
                                            : mobileLinkStyles
                                    }
                                >
                                    {t ? t(item.translationKey) : item.name}
                                </NavLink>
                            ))}
                            <hr className="border-zinc-100 dark:border-zinc-800" />
                            {user ? (
                                <div className="flex flex-col gap-4">
                                    <NavLink
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) =>
                                            isActive
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
                                            <span className="text-lg font-black uppercase tracking-tight leading-none">{t("nav.profile")}</span>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{t("nav.profileSubtitle")}</span>
                                        </div>
                                    </NavLink>
                                    <Button
                                        onClick={handleLogout}
                                        variant="destructive"
                                        className="w-full rounded-xl font-bold uppercase text-xs h-12"
                                    >
                                        <LogOut size={16} className="mr-2" /> {t("nav.logout")}
                                    </Button>
                                </div>
                            ) : (
                                <Link to="/auth" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full text-white rounded-xl font-bold h-12" style={{ backgroundColor: "var(--brand-color)" }}>
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
