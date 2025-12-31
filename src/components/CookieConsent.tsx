import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const GA_MEASUREMENT_ID = "G-SZ31WVLHN2";

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (consent === null) {
            setIsVisible(true);
        } else if (consent === "accepted") {
            loadGA();
        }
    }, []);

    const loadGA = () => {
        if ((window as any).gtag) return; // Already loaded

        const script = document.createElement("script");
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        script.async = true;
        document.head.appendChild(script);

        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: any[]) {
            (window as any).dataLayer.push(args);
        }
        (window as any).gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);
    };

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        loadGA();
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-border shadow-lg animate-in slide-in-from-bottom duration-500">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-foreground/80 md:text-base text-center md:text-left">
                    {t("cookie.message")}
                </p>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={handleDecline} className="min-w-[100px]">
                        {t("cookie.decline")}
                    </Button>
                    <Button size="sm" onClick={handleAccept} className="min-w-[100px]">
                        {t("cookie.accept")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
