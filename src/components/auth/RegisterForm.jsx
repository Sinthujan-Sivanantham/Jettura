import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "../../lib/supabase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/context/LanguageContext";
import SocialAuthButtons from "./shared/SocialAuthButtons";
import AuthDivider from "./shared/AuthDivider";
import RegisterFields from "./register/RegisterFields";
import RegisterSuccess from "./register/RegisterSuccess";

import { registerSchema } from "@/schemas/auth";

export default function RegisterForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    console.log("Starting Registration...", data); // DEBUG
    setLoading(true);
    setError("");

    try {
      // REGISTRIERUNG BEI SUPABASE
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: data.fullName,
            username: data.username,
          }
        }
      });

      if (signUpError) {
        console.error("Sign Up Error from Supabase:", signUpError); // DEBUG
        setError(signUpError.message);
        setLoading(false);
      } else {
        console.log("Registration Successful!"); // DEBUG
        setSuccess(true);
        setLoading(false);
      }
    } catch (e) {
      console.error("Unexpected Manual Register Error:", e);
      setError(e.message);
      setLoading(false);
    }
  };

  const handleSocialAction = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Social Login Error:", error);
      setError(error.message);
    }
  };

  if (success) {
    return <RegisterSuccess />;
  }

  return (
    <div className="space-y-8 pt-4 text-left">
      {/* SOCIAL OPTIONS */}
      <SocialAuthButtons
        onSocialLogin={handleSocialAction}
        loading={loading}
        socialLoading={null} // Register logic doesn't explicitly track social "loading" state separately in original code
      />

      <AuthDivider />

      {error && (
        <Alert variant="destructive" className="rounded-2xl border-none bg-red-500/10 text-red-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-[10px] font-bold uppercase italic">
            {error.includes("Database error")
              ? t("auth.errors.usernameTaken") || "USERNAME ALREADY TAKEN OR DATABASE ERROR"
              : error}
          </AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, (e) => console.error("Form Validation Errors:", e))}
        className="space-y-5"
      >

        <RegisterFields register={register} errors={errors} />

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 md:h-16 text-white font-black italic uppercase rounded-[1.5rem] md:rounded-[2rem] shadow-2xl transition-all active:scale-95 group relative overflow-hidden md:text-base"
          style={{ backgroundColor: "var(--brand-color)", boxShadow: "0 25px 50px -12px color-mix(in srgb, var(--brand-color) 20%, transparent)" }}
        >
          <span className="relative z-10">{loading ? <Loader2 className="animate-spin" /> : t("auth.completeRegistration")}</span>
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </form>
    </div>
  );
}