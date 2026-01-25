import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const MentionsLegales = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold mb-8">{t("legal.title")}</h1>

        <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">{t("legal.editor.title")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("legal.editor.text") }} />
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>{t("legal.editor.address")}</strong> 535, chemin des plaines – 13760 SAINT-CANNAT, France</li>
              <li><strong>Siren :</strong> 934063108</li>
              <li><strong>{t("legal.editor.director")}</strong> Mr Sébastien TEISSONNIERE</li>
              <li><strong>Email :</strong> contact@cosynestsarl.fr</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">{t("legal.hosting.title")}</h2>
            <p>
              <span dangerouslySetInnerHTML={{ __html: t("legal.hosting.text") }} /><br />
              Rue Eugène-Marziano 25, 1227 Genève - Suisse<br />
              +41 22 820 35 44<br />
              <a href="https://www.infomaniak.com" target="_blank" rel="noopener noreferrer" className="hover:underline">www.infomaniak.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">{t("legal.ip.title")}</h2>
            <p>{t("legal.ip.text")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">{t("legal.data.title")}</h2>
            <p>{t("legal.data.text")}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
