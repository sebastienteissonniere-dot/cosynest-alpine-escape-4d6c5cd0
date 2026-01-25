import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";

// Import existing assets
import heroImage from "@/assets/hero-chalet.jpg";
import livingImage from "@/assets/living.jpg";
import spaImage from "@/assets/spa.jpg";
import suiteImage from "@/assets/suite.jpg";
// Re-using webcam images as placeholders for now if needed, but sticking to "beautiful" ones first
import snowImage from "@/assets/webcam-speed-master.jpg";

const Gallery = () => {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Mock data - In a real app this might come from a CMS or API
    const images = [
        { src: heroImage, alt: "Chalet Exterior", category: "Exterior" },
        { src: livingImage, alt: "Living Room", category: "Interior" },
        { src: spaImage, alt: "Wellness Area", category: "Wellness" },
        { src: suiteImage, alt: "Luxury Suite", category: "Interior" },
        { src: snowImage, alt: "Winter Landscape", category: "Exterior" },
        // Duplicate some for grid effect
        { src: livingImage, alt: "Fireplace Detail", category: "Interior" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-12 text-center text-foreground">
                    {t("nav.chalet.gallery")}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                        <Dialog key={index}>
                            <DialogTrigger asChild>
                                <div className="group relative overflow-hidden rounded-xl cursor-pointer aspect-video shadow-md hover:shadow-xl transition-all duration-300 border border-border/50">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <ZoomIn className="text-white w-8 h-8 drop-shadow-lg" />
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none text-white overflow-hidden">
                                {/* Close button is handled by DialogContent usually, but we can style our own image container */}
                                <div className="relative w-full h-[80vh] flex items-center justify-center">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-contain rounded-md"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Gallery;
