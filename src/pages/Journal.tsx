import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Journal = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-8 text-center text-foreground">{t("nav.destination.journal")}</h1>
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-xl">Coming Soon...</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Journal;
