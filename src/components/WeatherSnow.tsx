import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSnow, Droplets, Wind, Thermometer, Camera, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
}

const WeatherSnow = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=44.62&longitude=6.68&current_weather=true&hourly=temperature_2m,precipitation,wind_speed_10m"
        );
        const data = await response.json();
        
        if (data.current_weather) {
          setWeather({
            temperature: data.current_weather.temperature,
            windSpeed: data.current_weather.windspeed,
            precipitation: data.hourly.precipitation[0] || 0,
            weatherCode: data.current_weather.weathercode,
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const webcams = [
    {
      name: "Vars Office du Tourisme",
      url: "https://www.vars.com/hiver/webcams.html",
    },
    {
      name: "Bergfex Vars",
      url: "https://www.bergfex.fr/vars/webcams/",
    },
    {
      name: "OnTheSnow Vars",
      url: "https://www.onthesnow.fr/vars/webcams",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-subtle">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            {t("weather.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("weather.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current Weather Card */}
          <Card className="border-border/50 shadow-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudSnow className="h-6 w-6 text-primary" />
                {t("weather.current")}
              </CardTitle>
              <CardDescription>{t("weather.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="text-center py-8 text-muted-foreground">
                  {t("weather.loading")}
                </div>
              )}
              
              {error && (
                <div className="text-center py-8 text-destructive">
                  {t("weather.error")}
                </div>
              )}

              {weather && !loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center p-4 bg-accent/10 rounded-lg">
                    <Thermometer className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground mb-1">
                      {t("weather.temperature")}
                    </span>
                    <span className="text-3xl font-bold text-foreground">
                      {weather.temperature}°C
                    </span>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-accent/10 rounded-lg">
                    <Wind className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground mb-1">
                      {t("weather.wind")}
                    </span>
                    <span className="text-3xl font-bold text-foreground">
                      {weather.windSpeed} km/h
                    </span>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-accent/10 rounded-lg">
                    <Droplets className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground mb-1">
                      {t("weather.precipitation")}
                    </span>
                    <span className="text-3xl font-bold text-foreground">
                      {weather.precipitation} mm
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Snow Report Card */}
          <Card className="border-border/50 shadow-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-6 w-6 text-primary" />
                {t("weather.snowReport")}
              </CardTitle>
              <CardDescription>Snow-Forecast Vars</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full h-auto py-6 flex-col items-center hover:shadow-md transition-smooth"
                asChild
              >
                <a
                  href="https://www.snow-forecast.com/resorts/Vars/6day/mid"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mountain className="h-8 w-8 mb-3 text-primary" />
                  <span className="font-semibold text-lg mb-2">
                    {t("weather.viewSnowForecast")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Prévisions détaillées sur 6 jours
                  </span>
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Webcams Section */}
        <Card className="border-border/50 shadow-luxury">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              {t("weather.webcams")}
            </CardTitle>
            <CardDescription>Vue en direct depuis Vars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {webcams.map((webcam, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto py-4 flex-col items-start hover:shadow-md transition-smooth"
                  asChild
                >
                  <a
                    href={webcam.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Camera className="h-5 w-5 mb-2" />
                    <span className="font-semibold">{webcam.name}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {t("weather.viewWebcam")}
                    </span>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WeatherSnow;
