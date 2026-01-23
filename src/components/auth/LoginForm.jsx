import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/context/LanguageContext";
import SocialAuthButtons from "./shared/SocialAuthButtons";
import AuthDivider from "./shared/AuthDivider";
import LoginFields from "./login/LoginFields";

import { loginSchema } from "@/schemas/auth";

export default function LoginForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword(data);
    if (authError) {
      setError(t("auth.errors.loginFailed") + ": " + authError.message);
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (authError) {
        setError(`${provider} Login fehlgeschlagen: ` + authError.message);
        setSocialLoading(null);
      }
    } catch (e) {
      setSocialLoading(null);
      setError(`Unexpected error: ${e.message}`);
    }
  };

  return (
    <div className="pt-2 text-left">
      <SocialAuthButtons
        onSocialLogin={handleSocialLogin}
        loading={loading}
        socialLoading={socialLoading}
      />

      <AuthDivider />

      {error && (
        <Alert variant="destructive" className="mb-4 rounded-lg bg-red-50 text-red-600 border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!showEmailForm ? (
        <Button
          onClick={() => setShowEmailForm(true)}
          className="w-full h-12 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-200 font-bold text-base rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Mail className="w-5 h-5" />
          Anmelden mit E-Mail
        </Button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <LoginFields register={register} errors={errors} />

          <Button
            type="submit"
            className="w-full h-12 bg-[#ff7b1c] hover:bg-[#e66a15] text-white font-bold text-base rounded-lg shadow-sm transition-all"
            disabled={loading || !!socialLoading}
          >
            {loading ? <Loader2 className="animate-spin" /> : t("auth.loginButton")}
          </Button>
        </form>
      )}
    </div>
  );
}