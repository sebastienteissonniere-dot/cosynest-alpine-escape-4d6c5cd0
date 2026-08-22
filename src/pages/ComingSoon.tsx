import { Globe, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-chalet.jpg";
import EarlyAccessForm from "@/components/EarlyAccessForm";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

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

      {/* Top Header: Language Switcher */}
      <header className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <span className="text-white/90 font-serif font-bold text-xl tracking-wide">
          Chalet Cosynest
        </span>

        <button
          onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
          className="flex items-center gap-2 text-white/90 hover:text-white bg-slate-900/60 hover:bg-slate-900/90 border border-slate-700/60 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 shadow-lg cursor-pointer"
          aria-label="Change language"
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span>{language === "fr" ? "English" : "Français"}</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto w-full my-auto pt-16 pb-8">
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-4 tracking-tight">
          Chalet Cosynest
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto mb-6 rounded-full" />
        <p className="text-xl sm:text-2xl text-amber-200/90 font-light tracking-wide mb-8">
          {t("earlyAccess.badge")}
        </p>
        
        {/* Early Access Subscription Form */}
        <div className="w-full">
          <EarlyAccessForm />
        </div>

        {/* Footer info & Direct email & Preview link */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-slate-300/90 font-light">
          <a 
            href="mailto:contact@chaletcosynest.fr"
            className="hover:text-amber-300 transition-colors duration-200"
          >
            contact@chaletcosynest.fr
          </a>
          <span className="hidden sm:inline text-slate-600">•</span>
          <button
            onClick={() => navigate("/dev")}
            className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors duration-200 font-medium cursor-pointer"
          >
            <span>{language === "fr" ? "Aperçu du chalet" : "Chalet Preview"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
