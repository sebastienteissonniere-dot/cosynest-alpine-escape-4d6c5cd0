import { useEffect } from 'react';

interface Beds24WidgetProps {
    propId?: string;
}

const Beds24Widget = ({ propId = '306743' }: Beds24WidgetProps) => { // Default to provided ID
    useEffect(() => {
        // This script is required for Beds24 widgets if using the JS method, 
        // but for a simple iFrame, we just need the iframe.
        // If we want the auto-resizing widget, we need the script.
        const script = document.createElement('script');
        script.src = "https://media.beds24.com/booking/js/bookingv2.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const widgetUrl = `https://www.beds24.com/booking2.php?propid=${propId}&hideheader=yes&hidefooter=yes&referer=iframe`;

    return (
        <div className="w-full min-h-[600px] bg-white rounded-lg shadow-xl p-4 flex justify-center">
            <iframe
                src={widgetUrl}
                width="800"
                height="2000"
                style={{ maxWidth: "100%", border: "none", overflow: "auto" }}
                title="Beds24 Booking Engine"
            >
                <p>
                    <a href={widgetUrl} title="Book Now">Book Now</a>
                </p>
            </iframe>
        </div>
    );
};

export default Beds24Widget;
