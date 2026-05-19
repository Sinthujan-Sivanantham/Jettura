import { Camera, User, Mail, Loader2, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfileHeader({ profile, user, uploading, onUpload }) {
    const { t } = useLanguage();

    return (
        <section className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white text-center md:text-left">
            {/* Avatar mit Upload */}
            <div className="relative group">
                <div
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl overflow-hidden border-4 border-white dark:border-zinc-900 relative"
                    style={{ backgroundColor: "var(--brand-color)" }}
                >
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            className="w-full h-full object-cover"
                            alt={t("profile.avatar")}
                        />
                    ) : (
                        <User size={40} className="opacity-30" />
                    )}
                </div>

                <label className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-[2rem] sm:rounded-[2.5rem] cursor-pointer transition-all duration-300">
                    {uploading ? (
                        <Loader2 className="animate-spin text-white" />
                    ) : (
                        <Camera className="text-white" size={20} />
                    )}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={onUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Profil-Informationen */}
            <div className="flex-1 space-y-2">
                <p
                    className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] italic"
                    style={{ color: "var(--brand-color)" }}
                >
                    {t("profile.verifiedMember")}
                </p>

                <h1 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none">
                    {profile?.full_name || t("profile.explorer")}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mt-2">
                    <p className="flex items-center gap-2 text-zinc-400 font-bold text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs uppercase tracking-widest italic leading-none">
                        <Mail size={12} style={{ color: "var(--brand-color)" }} />
                        {user?.email}
                    </p>
                    <p className="flex items-center gap-2 text-zinc-400 font-bold text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs uppercase tracking-widest italic leading-none">
                        <MapPin size={12} style={{ color: "var(--brand-color)" }} />
                        {t("profile.memberSince")} {new Date(user?.created_at).getFullYear()}
                    </p>
                </div>
            </div>
        </section>
    );
}