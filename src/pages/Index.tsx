import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ChaletInfo from "@/components/ChaletInfo";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import EarlyAccessForm from "@/components/EarlyAccessForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Experience />
      <ChaletInfo />
      <Services />
      
      {/* Section Alerte Ouverture Réservations Début 2027 */}
      <section id="early-access" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <EarlyAccessForm />
      </section>

      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
