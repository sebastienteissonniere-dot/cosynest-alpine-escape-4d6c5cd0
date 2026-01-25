import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { blogPosts } from "@/data/journalData";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Journal = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto mb-16 text-center">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-foreground">
                        {t("nav.destination.journal")}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {language === 'fr'
                            ? "Actualités, événements et vie du chalet : restez connectés avec l'univers Cosynest."
                            : "News, events and chalet life: stay connected with the Cosynest universe."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {blogPosts.map((post) => (
                        <Card key={post.id} className="overflow-hidden border-border/50 hover:shadow-luxury transition-slow flex flex-col group cursor-pointer" onClick={() => navigate(`/journal/${post.slug}`)}>
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title[language]}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border border-border/50">
                                    {post.category}
                                </div>
                            </div>
                            <CardHeader className="flex-grow pb-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(post.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                                    {post.title[language]}
                                </h2>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                                    {post.excerpt[language]}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button variant="link" className="p-0 h-auto text-primary font-medium group-hover:translate-x-1 transition-transform">
                                    {t("journal.readMore")} <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Journal;
