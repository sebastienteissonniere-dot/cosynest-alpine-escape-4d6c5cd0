import { useEffect } from 'react';

interface Beds24WidgetProps {
    propId?: string;
}

const Beds24Widget = ({ propId = 'PG157390' }: Beds24WidgetProps) => { // Default to provided ID
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

    const widgetUrl = `https://www.beds24.com/booking.php?propid=${propId}&sku=1&window=1`;

    return (
        <div className="w-full min-h-[600px] bg-white rounded-lg shadow-xl p-4">
            <iframe
                src={widgetUrl}
                width="100%"
                height="1200"
                style={{ border: "none", overflow: "hidden" }}
                title="Beds24 Booking Engine"
            >
                <p>Your browser does not support iframes.</p>
            </iframe>
        </div>
    );
};

export default Beds24Widget;
