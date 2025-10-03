import Navigation from "@/components/Navigation";
import WeatherSnow from "@/components/WeatherSnow";
import Footer from "@/components/Footer";

const Weather = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <WeatherSnow />
      </div>
      <Footer />
    </div>
  );
};

export default Weather;
