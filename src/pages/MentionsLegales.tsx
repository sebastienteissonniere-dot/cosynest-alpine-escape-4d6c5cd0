import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const MentionsLegales = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold mb-8">Mentions Légales</h1>

        <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Éditeur du site</h2>
            <p>
              Le site <strong>chaletcosynest.fr</strong> est édité par la société <strong>CosyNest SARL</strong>, société au capital de 1000 €.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Siège social :</strong> 535, chemin des plaines – 13760 SAINT-CANNAT, France</li>
              <li><strong>Siren :</strong> 934063108</li>
              <li><strong>Directeur de la publication :</strong> Mr Sébastien TEISSONNIERE</li>
              <li><strong>Email :</strong> contact@cosynestsarl.fr</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Hébergement</h2>
            <p>
              Le site est hébergé par <strong>Infomaniak Network SA</strong>.<br />
              Rue Eugène-Marziano 25, 1227 Genève - Suisse<br />
              +41 22 820 35 44<br />
              <a href="https://www.infomaniak.com" target="_blank" rel="noopener noreferrer" className="hover:underline">www.infomaniak.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Données personnelles</h2>
            <p>
              Les informations recueillies via le formulaire de contact ou de réservation sont destinées exclusivement à CosyNest SARL pour la gestion de votre demande. Conformément à la loi « Informatique et Libertés », vous disposez d'un droit d'accès, de modification et de suppression des données vous concernant.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
