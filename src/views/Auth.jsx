"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import AuthHeader from "../components/auth/AuthHeader";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function Auth() {
  const { t, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Wenn User bereits eingeloggt, ab zur Startseite
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 py-16 sm:p-6">
        <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[85%] max-w-[320px] sm:w-full sm:max-w-[360px]"
      >
        <Card className="relative shadow-2xl border-none bg-white dark:bg-zinc-900 rounded-[1.5rem] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => router.replace("/")}
            className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={24} />
          </button>

          <CardContent className="pt-10 px-5 sm:px-6 pb-6">
            <AuthHeader isLogin={isLogin} />

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isLogin ? <LoginForm /> : <RegisterForm />}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex flex-col justify-center border-t border-slate-100 dark:border-zinc-800 py-4 bg-slate-50 dark:bg-zinc-900/50">
            <div className="text-center space-y-4">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#ff7b1c] transition-colors"
              >
                {isLogin ? t("auth.noAccount") : t("auth.haveAccount")}
              </Button>

              <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed text-center">
                {language === "en" ? (
                  <>By providing your email address, you agree to our <Link href="/agb" className="underline hover:text-[var(--brand-color)]">Terms of Service</Link> and our <Link href="/datenschutz" className="underline hover:text-[var(--brand-color)]">Privacy Policy</Link>.</>
                ) : (
                  <>Durch Hinzufügen deiner E-Mail-Adresse akzeptierst du unsere <Link href="/agb" className="underline hover:text-[var(--brand-color)]">Nutzungsbedingungen</Link> und unsere <Link href="/datenschutz" className="underline hover:text-[var(--brand-color)]">Datenschutzrichtlinie</Link>.</>
                )}
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}