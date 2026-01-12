interface Beds24WidgetProps {
    propId?: string;
}

const Beds24Widget = ({ propId = '306743' }: Beds24WidgetProps) => { // Default to provided ID
    const widgetUrl = `https://www.beds24.com/booking2.php?propid=${propId}&hideheader=yes&hidefooter=yes&referer=iframe`;

    return (
        <div className="w-full min-h-[600px] bg-white rounded-lg shadow-xl overflow-hidden">
            <iframe
                src={widgetUrl}
                className="w-full h-[600px] md:h-[800px] border-0"
                title="Beds24 Booking Engine"
                loading="lazy"
            >
                <p>
                    <a href={widgetUrl} title="Book Now">Book Now</a>
                </p>
            </iframe>
        </div>
    );
};

export default Beds24Widget;
