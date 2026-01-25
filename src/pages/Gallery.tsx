import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import existing assets
import heroImage from "@/assets/hero-chalet.jpg";
import livingImage from "@/assets/living.jpg";
import spaImage from "@/assets/spa.jpg";
import suiteImage from "@/assets/suite.jpg";
import snowImage from "@/assets/webcam-speed-master.jpg";

const Gallery = () => {
    const { t } = useLanguage();
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [isOpen, setIsOpen] = useState(false);

    // Mock data
    const images = [
        { src: heroImage, alt: "Chalet Exterior", category: "Exterior" },
        { src: livingImage, alt: "Living Room", category: "Interior" },
        { src: spaImage, alt: "Wellness Area", category: "Wellness" },
        { src: suiteImage, alt: "Luxury Suite", category: "Interior" },
        { src: snowImage, alt: "Winter Landscape", category: "Exterior" },
        { src: livingImage, alt: "Fireplace Detail", category: "Interior" },
    ];

    const handlePrevious = useCallback(() => {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }, [images.length]);

    const handleNext = useCallback(() => {
        setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }, [images.length]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!isOpen) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowUp") handlePrevious();
            if (event.key === "ArrowRight" || event.key === "ArrowDown") handleNext();
        },
        [isOpen, handleNext, handlePrevious]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
        setIsOpen(true);
    };

    // Touch handling for swipe
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Min swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset touch end
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrevious();
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-12 text-center text-foreground">
                    {t("nav.chalet.gallery")}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="group relative overflow-hidden rounded-xl cursor-pointer aspect-video shadow-md hover:shadow-xl transition-all duration-300 border border-border/50"
                        >
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
                    ))}
                </div>

                {/* Lightbox Dialog */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent
                        className="max-w-7xl w-full h-[90vh] p-0 bg-black/90 border-none shadow-none text-white overflow-hidden flex flex-col justify-center items-center outline-none"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >

                        {/* Close Button Override */}
                        <DialogClose className="absolute right-4 top-4 z-50 rounded-full p-2 bg-black/50 hover:bg-black/70 text-white transition-colors">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                        </DialogClose>

                        {selectedIndex >= 0 && (
                            <>
                                <div className="relative w-full h-full flex items-center justify-center p-4">

                                    {/* Previous Button - Hidden on mobile, visible on sm+ */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-4 z-50 text-white hover:bg-white/20 hover:text-white rounded-full h-12 w-12 hidden sm:flex"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePrevious();
                                        }}
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                    </Button>

                                    {/* Image */}
                                    <img
                                        src={images[selectedIndex].src}
                                        alt={images[selectedIndex].alt}
                                        className="max-h-full max-w-full object-contain shadow-2xl rounded-sm select-none"
                                        draggable="false"
                                    />

                                    {/* Next Button - Hidden on mobile, visible on sm+ */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-4 z-50 text-white hover:bg-white/20 hover:text-white rounded-full h-12 w-12 hidden sm:flex"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNext();
                                        }}
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                    </Button>
                                </div>

                                {/* Caption / Counter */}
                                <div className="absolute bottom-4 left-0 right-0 text-center text-white/80">
                                    <p className="text-lg font-medium">{images[selectedIndex].alt}</p>
                                    <p className="text-sm text-white/50">
                                        {selectedIndex + 1} / {images.length}
                                    </p>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    );
};

export default Gallery;
