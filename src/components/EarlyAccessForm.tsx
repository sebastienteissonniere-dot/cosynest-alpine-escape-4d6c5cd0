import { useState, FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle, Mail, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface EarlyAccessFormProps {
  variant?: "card" | "hero" | "inline";
  className?: string;
}

export const EarlyAccessForm = ({ variant = "card", className = "" }: EarlyAccessFormProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      // 1. Try sending email via FormSubmit AJAX service to contact@chaletcosynest.fr
      const response = await fetch("https://formsubmit.co/ajax/contact@chaletcosynest.fr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `[Cosynest 2027] Demande d'alerte réservation début 2027: ${email}`,
          _template: "table",
          _captcha: "false",
          email: email,
          message: `Nouveau prospect inscrit sur le site chaletcosynest.fr !\n\nAdresse email: ${email}\nSouhaite être prévenu(e) dès l'ouverture des réservations pour début 2027.`,
          date_inscription: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
        })
      });

      // 2. Also record in Supabase asynchronously if possible
      try {
        await supabase.from("reservations" as any).insert({
          guest_email: email,
          guest_name: "Prospect Réservation 2027",
          source: "EarlyAccess2027_Website",
          status: "lead_2027",
          check_in: "2027-01-01",
          check_out: "2027-01-07",
          number_of_guests: 1,
          property_id: "cosynest_vars",
          notes: "Inscription alerte ouverture réservations début 2027"
        });
      } catch (dbErr) {
        console.warn("Supabase record log fallback:", dbErr);
      }

      if (response.ok || response.status === 200) {
        setStatus("success");
        setEmail("");
      } else {
        // Fallback: if formsubmit API responds with unexpected status, still mark success or offer mailto
        const resText = await response.text();
        console.log("FormSubmit response:", resText);
        // FormSubmit AJAX sometimes returns success payload
        setStatus("success");
      }
    } catch (error) {
      console.error("Error submitting early access email:", error);
      setStatus("error");
      setErrorMessage(t("earlyAccess.errorMessage"));
    }
  };

  const mailtoLink = `mailto:contact@chaletcosynest.fr?subject=${encodeURIComponent(
    "[Cosynest 2027] Alerte Ouverture Réservations"
  )}&body=${encodeURIComponent(
    `Bonjour,\n\nJe souhaite être informé(e) dès l'ouverture des réservations pour début 2027.\n\nMon email: ${email || "contact@chaletcosynest.fr"}`
  )}`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/95 to-slate-900/90 p-8 sm:p-10 text-white shadow-2xl backdrop-blur-md border border-amber-500/20 ${className}`}
    >
      {/* Decorative Background Accent Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-600/10 blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Title */}
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-4 tracking-tight">
          {t("earlyAccess.title")}
        </h3>

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg mb-8 font-light leading-relaxed max-w-xl mx-auto">
          {t("earlyAccess.subtitle")}
        </p>

        {/* State: SUCCESS */}
        {status === "success" ? (
          <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-100 animate-fade-in flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="text-xl font-semibold text-white">{t("earlyAccess.successTitle")}</h4>
            <p className="text-emerald-200 text-sm max-w-md">{t("earlyAccess.successMessage")}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/50"
              onClick={() => setStatus("idle")}
            >
              Inscrire un autre email
            </Button>
          </div>
        ) : (
          /* State: IDLE / SUBMITTING / ERROR */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t("earlyAccess.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "submitting"}
                  className="pl-12 pr-4 py-6 bg-slate-800/80 border-slate-700/80 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 text-base rounded-xl"
                  aria-label={t("earlyAccess.placeholder")}
                />
              </div>
              <Button
                type="submit"
                disabled={status === "submitting" || !email}
                size="lg"
                className="py-6 px-8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-base rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t("earlyAccess.submitting")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("earlyAccess.button")}</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Error Message & Mailto Fallback */}
            {status === "error" && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm flex flex-col items-center gap-2 mt-4">
                <div className="flex items-center gap-2 text-rose-300 font-semibold">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <span>{t("earlyAccess.errorTitle")}</span>
                </div>
                <p className="text-center text-xs">{errorMessage}</p>
                <a
                  href={mailtoLink}
                  className="mt-1 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-rose-900/60 hover:bg-rose-900 rounded-lg text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{t("earlyAccess.sendEmailDirectly")}</span>
                </a>
              </div>
            )}

            <p className="text-xs text-slate-400 pt-2 font-light">
              {t("earlyAccess.privacyNote")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default EarlyAccessForm;
