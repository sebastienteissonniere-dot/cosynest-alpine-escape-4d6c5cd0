import { Button } from "@/components/ui/button";
import { Menu, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button 
              onClick={() => navigate("/")}
              className="text-2xl font-serif font-bold text-primary hover:opacity-80 transition-smooth"
            >
              Cosynest
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("experience")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.experience")}
            </button>
            <button
              onClick={() => navigate("/chalet")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.chalet")}
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.services")}
            </button>
            <button
              onClick={() => navigate("/weather")}
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.weather")}
            </button>
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

          {/* Mobile menu button */}
          <div className="md:hidden">
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
            <button
              onClick={() => scrollToSection("experience")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.experience")}
            </button>
            <button
              onClick={() => {
                navigate("/chalet");
                setIsOpen(false);
              }}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.chalet")}
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.services")}
            </button>
            <button
              onClick={() => {
                navigate("/weather");
                setIsOpen(false);
              }}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.weather")}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t("nav.contact")}
            </button>
            <button
              onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
              className="flex items-center gap-2 w-full text-left py-2 text-foreground hover:text-primary transition-smooth font-medium"
            >
              <Globe className="h-4 w-4" />
              {language === "fr" ? "EN" : "FR"}
            </button>
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
