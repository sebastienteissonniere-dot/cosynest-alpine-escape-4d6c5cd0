import { Instagram, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Cosynest</h3>
            <p className="text-background/80 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-background/80">
              <li>Chalet CosyNest N°16</li>
              <li>Hameau des rennes, Fontbonne</li>
              <li>05560 Vars, France</li>
              <li>contact@chaletcosynest.fr</li>

            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">{t("footer.followUs")}</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@chaletcosynest.fr"
                className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-smooth"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 text-center text-background/60 text-sm">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p>© {currentYear} Cosynest SARL. {t("footer.rights")}</p>
            <span className="hidden md:inline text-background/40">|</span>
            <a href="/mentions-legales" className="hover:text-background transition-colors">
              {t("legal.title")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
