import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const MentionsLegales = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-12 text-center text-foreground">{t("legal.title")}</h1>

        <div className="prose prose-lg max-w-4xl mx-auto space-y-12">
          <section className="bg-card p-8 rounded-lg border border-border/50 hover:shadow-luxury transition-slow">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-foreground">{t("legal.editor.title")}</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p dangerouslySetInnerHTML={{ __html: t("legal.editor.text") }} />
              <ul className="space-y-2 pt-2">
                <li className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-foreground/80">{t("legal.editor.address")}</span>
                  <span>535, chemin des plaines – 13760 SAINT-CANNAT, France</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-foreground/80">Siren :</span>
                  <span>934063108</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-foreground/80">{t("legal.editor.director")}</span>
                  <span>Mr Sébastien TEISSONNIERE</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-foreground/80">Email :</span>
                  <span>contact@cosynestsarl.fr</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-card p-8 rounded-lg border border-border/50 hover:shadow-luxury transition-slow">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-foreground">{t("legal.hosting.title")}</h2>
            <div className="text-muted-foreground leading-relaxed">
              <p className="mb-2">
                <span dangerouslySetInnerHTML={{ __html: t("legal.hosting.text") }} />
              </p>
              <p>Rue Eugène-Marziano 25, 1227 Genève - Suisse</p>
              <p>+41 22 820 35 44</p>
              <a href="https://www.infomaniak.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-2 inline-block">
                www.infomaniak.com
              </a>
            </div>
          </section>

          <section className="bg-card p-8 rounded-lg border border-border/50 hover:shadow-luxury transition-slow">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-foreground">{t("legal.ip.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("legal.ip.text")}</p>
          </section>

          <section className="bg-card p-8 rounded-lg border border-border/50 hover:shadow-luxury transition-slow">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-foreground">{t("legal.data.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("legal.data.text")}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
