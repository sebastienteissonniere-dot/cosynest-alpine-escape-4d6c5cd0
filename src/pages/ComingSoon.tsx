import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-chalet.jpg";
import EarlyAccessForm from "@/components/EarlyAccessForm";

const ComingSoon = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src={heroImage}
          alt="Cosynest - Chalet de luxe à Vars"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto w-full my-auto py-8">
        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-4 tracking-tight">
          Chalet Cosynest
        </h1>

        {/* Centered Language Switcher */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-slate-900/60 hover:bg-slate-900/90 border border-slate-700/60 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 shadow-lg cursor-pointer hover:scale-105"
            aria-label="Change language"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{language === "fr" ? "English" : "Français"}</span>
          </button>
        </div>

        <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto mb-6 rounded-full" />

        <p className="text-xl sm:text-2xl text-amber-200/90 font-light tracking-wide mb-8">
          {t("earlyAccess.badge")}
        </p>

        {/* Early Access Subscription Form */}
        <div className="w-full">
          <EarlyAccessForm />
        </div>

        {/* Direct contact email */}
        <div className="mt-8 text-center">
          <a
            href="mailto:contact@chaletcosynest.fr"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors duration-200 text-sm sm:text-base font-light"
          >
            <span>contact@chaletcosynest.fr</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
