import Navigation from "@/components/Navigation";
import Experience from "@/components/Experience";
import ChaletInfo from "@/components/ChaletInfo";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Chalet = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <Experience />
        <ChaletInfo />
        <Services />
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default Chalet;
