import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import chaletRender from "@/assets/chalet-render-2027.jpg";
import EarlyAccessForm from "@/components/EarlyAccessForm";

const ComingSoon = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <img
          src={chaletRender}
          alt="Chalet Cosynest - Architecture 2027"
          className="w-full h-full object-cover object-center opacity-85 filter brightness-110 contrast-105 transition-opacity duration-500"
        />
        {/* Subtle Luxury Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/45 to-slate-950/70 backdrop-blur-[1px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto w-full my-auto py-8">
        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          Chalet Cosynest
        </h1>

        {/* Centered Language Switcher */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
            className="inline-flex items-center gap-2 text-white bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 shadow-xl cursor-pointer hover:scale-105"
            aria-label="Change language"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{language === "fr" ? "English" : "Français"}</span>
          </button>
        </div>

        <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto mb-6 rounded-full shadow-amber-500/50 shadow-md" />

        <p className="text-xl sm:text-2xl text-amber-200 font-light tracking-wide mb-6 drop-shadow-md">
          {t("earlyAccess.badge")}
        </p>

        {/* Chalet Description Card */}
        <div className="mb-8 p-6 rounded-2xl bg-slate-900/75 border border-slate-700/70 backdrop-blur-md shadow-2xl text-slate-200 text-sm sm:text-base leading-relaxed font-light text-center">
          <p>{t("earlyAccess.chaletDescription")}</p>
        </div>

        {/* Early Access Subscription Form */}
        <div className="w-full">
          <EarlyAccessForm />
        </div>

        {/* Direct contact email */}
        <div className="mt-8 text-center">
          <a
            href="mailto:contact@chaletcosynest.fr"
            className="inline-flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-colors duration-200 text-sm sm:text-base font-medium drop-shadow-sm"
          >
            <span>contact@chaletcosynest.fr</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
