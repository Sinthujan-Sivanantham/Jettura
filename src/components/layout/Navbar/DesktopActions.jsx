"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ThemeToggle from "../../shared/ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function DesktopActions({ user, profile, handleLogout, setColor, navLinkStyles, t }) {
  const pathname = usePathname();
  const colors = [
    "#3b60ff", "#8b5cf6", "#ec4899", "#ef4444",
    "#f97316", "#eab308", "#10b981", "#06b6d4"
  ];
  const isProfileActive = pathname === "/profile";

  const [isDemoAdmin, setIsDemoAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDemoAdmin(localStorage.getItem("jettura_demo_admin_mode") === "true");
    }
  }, []);

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@jettura.com").split(",").map(e => e.trim());
  const isAdmin = adminEmails.includes(user?.email || "") || user?.email?.endsWith("@jettura.com") || isDemoAdmin;

  return (
    <div className="hidden min-[761px]:flex items-center gap-6">
      <div className="flex items-center gap-6">
        <LanguageSwitcher />
        <ThemeToggle />
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-[var(--brand-color)] hover:opacity-90 flex items-center justify-center transition-all shadow-lg shadow-[var(--brand-color)]/30 border-2 border-white dark:border-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800">
              <div className="w-2.5 h-2.5 bg-white/40 rounded-full" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-zinc-100 dark:border-zinc-800 shadow-xl mr-4">
            <div className="grid grid-cols-4 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full border border-zinc-100 dark:border-zinc-800 transition-all hover:scale-110 active:scale-95 shadow-sm"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {user ? (
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="text-zinc-500 hover:text-red-500 mr-2 flex items-center justify-center p-2 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                title="Admin Dashboard"
              >
                <ShieldAlert size={18} className="text-red-500" />
              </Link>
            )}
            <Link
              href="/profile"
              className={navLinkStyles({ isActive: isProfileActive }).className}
              style={navLinkStyles({ isActive: isProfileActive }).style}
            >
              <div className="hover:opacity-80 transition-opacity">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-zinc-100 dark:border-zinc-800 shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800">
                    <User size={20} strokeWidth={2} />
                  </div>
                )}
              </div>
            </Link>
            <button onClick={handleLogout} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 ml-1">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link href="/auth">
            <div className="text-zinc-900 dark:text-white flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <span className="font-[900] italic uppercase tracking-tighter text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm leading-none">{t("nav.login")}</span>
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
