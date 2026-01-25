import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Snowflake, Sun, Mountain, Trees, Waves, Bike, Ticket, Map } from "lucide-react";

// Placeholder images - using existing assets for now, or placeholders
import heroImage from "@/assets/hero-chalet.jpg"; // Fallback
import snowImage from "@/assets/webcam-speed-master.jpg"; // Winter vibe
import summerImage from "@/assets/living.jpg"; // Summer vibe (greenery/view)

const Around = () => {
    const { t } = useLanguage();
    const [season, setSeason] = useState<"winter" | "summer">("winter");

    const winterActivities = [
        {
            icon: Mountain,
            title: t("around.activities.ski.title"),
            description: t("around.activities.ski.description"),
            image: snowImage,
        },
        {
            icon: Ticket,
            title: t("around.activities.luge.title"),
            description: t("around.activities.luge.description"),
            image: snowImage, // Ideally a luge image
        },
        {
            icon: Snowflake,
            title: t("around.activities.insolite.title"),
            description: t("around.activities.insolite.description"),
            image: snowImage, // Ideally an ice cave image
        },
        {
            icon: Trees,
            title: t("around.activities.hiking_winter.title"),
            description: t("around.activities.hiking_winter.description"),
            image: snowImage, // Ideally snowshoeing image
        },
    ];

    const summerActivities = [
        {
            icon: Trees,
            title: t("around.activities.hiking_summer.title"),
            description: t("around.activities.hiking_summer.description"),
            image: summerImage,
        },
        {
            icon: Bike,
            title: t("around.activities.mtb.title"),
            description: t("around.activities.mtb.description"),
            image: summerImage, // Ideally MTB image
        },
        {
            icon: Map,
            title: t("around.activities.adventure.title"),
            description: t("around.activities.adventure.description"),
            image: summerImage, // Ideally adventure park image
        },
        {
            icon: Waves,
            title: t("around.activities.water.title"),
            description: t("around.activities.water.description"),
            image: summerImage, // Ideally rafting image
        },
    ];

    const currentActivities = season === "winter" ? winterActivities : summerActivities;

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Vars"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white mb-6 animate-fade-in">
                        {t("around.title")}
                    </h1>
                    <p className="text-xl sm:text-2xl text-white/90 font-light tracking-wide animate-fade-in delay-200">
                        {t("around.subtitle")}
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">

                {/* Season Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="bg-secondary/50 p-1.5 rounded-full inline-flex relative">
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-background rounded-full shadow-sm transition-all duration-300 ease-in-out ${season === "summer" ? "translate-x-full left-1.5" : "left-1.5"
                                }`}
                        />
                        <button
                            onClick={() => setSeason("winter")}
                            className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-full text-lg font-medium transition-colors duration-300 ${season === "winter" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Snowflake className="w-5 h-5" />
                            {t("around.winter")}
                        </button>
                        <button
                            onClick={() => setSeason("summer")}
                            className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-full text-lg font-medium transition-colors duration-300 ${season === "summer" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Sun className="w-5 h-5" />
                            {t("around.summer")}
                        </button>
                    </div>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {currentActivities.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                            <div
                                key={index}
                                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-luxury border border-border/50"
                            >
                                <div className="absolute inset-0">
                                    <img
                                        src={activity.image}
                                        alt={activity.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="flex items-center gap-3 mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-white">
                                            {activity.title}
                                        </h3>
                                    </div>
                                    <p className="text-white/80 leading-relaxed max-w-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                        {activity.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Around;
