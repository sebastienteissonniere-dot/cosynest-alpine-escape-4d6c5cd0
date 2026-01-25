import { Button } from "@/components/ui/button";
import { Menu, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    // If not on home page, navigate there first
    if (location.pathname !== "/dev") {
      navigate("/dev");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname === "/dev") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/dev");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="text-2xl font-serif font-bold text-primary hover:opacity-80 transition-smooth"
            >
              Chalet Cosynest
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Le Chalet Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-smooth font-medium outline-none">
                {t("nav.chalet.title")} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/chalet")}>
                  {t("nav.chalet.presentation")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/gallery")}>
                  {t("nav.chalet.gallery")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/plans")}>
                  {t("nav.chalet.plans")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => scrollToSection("experience")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.experience")}
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.services")}
            </button>

            {/* Destination Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-smooth font-medium outline-none">
                {t("nav.destination.title")} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate("/around")}>
                  {t("nav.destination.around")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/journal")}>
                  {t("nav.destination.journal")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/weather")}>
                  {t("nav.destination.weather")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.contact")}
            </button>
            <button
              onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth font-medium"
              aria-label="Change language"
            >
              <Globe className="h-4 w-4" />
              {language === "fr" ? "EN" : "FR"}
            </button>
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate("/reservation")}
            >
              {t("nav.book")}
            </Button>
          </div>

          {/* Mobile menu button and language switcher */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth font-medium px-3 py-2"
              aria-label="Change language"
            >
              <Globe className="h-4 w-4" />
              {language === "fr" ? "EN" : "FR"}
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 space-y-4">

            <div className="space-y-2">
              <span className="block px-2 text-sm font-semibold text-muted-foreground">{t("nav.chalet.title")}</span>
              <button onClick={() => { navigate("/chalet"); setIsOpen(false); }} className="block w-full text-left pl-4 py-2 text-foreground hover:text-primary transition-smooth">{t("nav.chalet.presentation")}</button>
              <button onClick={() => { navigate("/gallery"); setIsOpen(false); }} className="block w-full text-left pl-4 py-2 text-foreground hover:text-primary transition-smooth">{t("nav.chalet.gallery")}</button>
              <button onClick={() => { navigate("/plans"); setIsOpen(false); }} className="block w-full text-left pl-4 py-2 text-foreground hover:text-primary transition-smooth">{t("nav.chalet.plans")}</button>
            </div>

            <button onClick={() => scrollToSection("experience")} className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium">{t("nav.experience")}</button>
            <button onClick={() => scrollToSection("services")} className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium">{t("nav.services")}</button>

            <div className="space-y-2">
              <span className="block px-2 text-sm font-semibold text-muted-foreground">{t("nav.destination.title")}</span>
              <button onClick={() => { navigate("/around"); setIsOpen(false); }} className="block w-full text-left pl-4 py-2 text-foreground hover:text-primary transition-smooth">{t("nav.destination.around")}</button>
              <button onClick={() => { navigate("/journal"); setIsOpen(false); }} className="block w-full text-left pl-4 py-2 text-foreground hover:text-primary transition-smooth">{t("nav.destination.journal")}</button>
              <button onClick={() => { navigate("/weather"); setIsOpen(false); }} className="block w-full text-left pl-4 py-2 text-foreground hover:text-primary transition-smooth">{t("nav.destination.weather")}</button>
            </div>

            <button onClick={() => scrollToSection("contact")} className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium">{t("nav.contact")}</button>

            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => {
                navigate("/reservation");
                setIsOpen(false);
              }}
            >
              {t("nav.book")}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
