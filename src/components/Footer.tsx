import { Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Cosynest</h3>
            <p className="text-background/80 leading-relaxed">
              Votre chalet de luxe à Vars pour des vacances inoubliables dans les Alpes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <ul className="space-y-2 text-background/80">
              <li>Vars 05560, Hautes-Alpes</li>
              <li>contact@cosynest.com</li>
              <li>+33 (0)X XX XX XX XX</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Suivez-nous</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-smooth"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@cosynest.com"
                className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-smooth"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 text-center text-background/60 text-sm">
          <p>© {currentYear} Cosynest SARL. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
