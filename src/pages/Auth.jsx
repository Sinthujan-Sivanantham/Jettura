import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import AuthHeader from "../components/auth/AuthHeader";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function Auth() {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Wenn User bereits eingeloggt, ab zur Startseite
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px]"
      >
        <Card className="relative shadow-2xl border-none bg-white dark:bg-zinc-900 rounded-[1.5rem] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={24} />
          </button>

          <CardContent className="pt-12 px-8 pb-8">
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

          <CardFooter className="flex flex-col justify-center border-t border-slate-100 dark:border-zinc-800 py-6 bg-slate-50 dark:bg-zinc-900/50">
            <div className="text-center space-y-4">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-600 dark:text-slate-400 font-medium hover:text-[#ff7b1c] transition-colors"
              >
                {isLogin ? t("auth.noAccount") : t("auth.haveAccount")}
              </Button>

              <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed text-center">
                Durch Hinzufügen deiner E-Mail-Adresse akzeptierst du unsere <a href="#" className="underline">Nutzungsbedingungen</a> und unsere <a href="#" className="underline">Datenschutzrichtlinie</a>.
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}