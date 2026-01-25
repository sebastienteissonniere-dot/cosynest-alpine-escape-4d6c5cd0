import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { blogPosts } from "@/data/journalData";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const post = blogPosts.find((p) => p.slug === slug);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!post) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-24 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
                        <Button onClick={() => navigate("/journal")}>
                            {t("journal.backToJournal")}
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navigation />

            {/* Hero Header */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title[language]}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container px-4 text-center max-w-4xl">
                        <div className="inline-block bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                            {post.category}
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                            {post.title[language]}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-white/90 font-medium">
                            <Calendar className="w-5 h-5" />
                            <span>{t("journal.publishedOn")} {new Date(post.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-grow container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Button
                        variant="ghost"
                        className="mb-8 -ml-4 text-muted-foreground hover:text-primary"
                        onClick={() => navigate("/journal")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t("journal.backToJournal")}
                    </Button>

                    <article className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                prose-headings:font-serif prose-headings:text-foreground 
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold">
                        {/* 
                   Security Note: In a real app with user-generated content, 
                   we would need to sanitize this. Since it comes from our static file data, it's safe. 
                */}
                        <div dangerouslySetInnerHTML={{ __html: post.content[language] }} />
                    </article>

                    <div className="mt-16 pt-8 border-t border-border/50">
                        <Button onClick={() => navigate("/journal")} variant="outline" size="lg" className="w-full sm:w-auto">
                            {t("journal.backToJournal")}
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPost;
