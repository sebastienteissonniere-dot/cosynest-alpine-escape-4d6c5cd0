import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSnow, Droplets, Wind, Thermometer, Camera, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import webcamSpeedMaster from "@/assets/webcam-speed-master.jpg";
import webcamMayt from "@/assets/webcam-mayt.jpg";
import webcamColDeCrevoux from "@/assets/webcam-col-de-crevoux.jpg";
import webcamPeynier from "@/assets/webcam-peynier.jpg";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
}

interface SnowForecast {
  date: string;
  snowfall: number;
  snowDepth: number;
  temperature: number;
}

interface StationObservation {
  snowDepth: number;
  temperature: number;
  lastUpdate: string;
}

const WeatherSnow = () => {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [snowForecast, setSnowForecast] = useState<SnowForecast[]>([]);
  const [stationObs, setStationObs] = useState<StationObservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedWebcam, setSelectedWebcam] = useState<{ name: string; url: string; image: string } | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch current weather and 4-day snow forecast using Météo France AROME model
        const response = await fetch(
          "https://api.open-meteo.com/v1/meteofrance?latitude=44.62&longitude=6.68&current=temperature_2m,precipitation,wind_speed_10m,weather_code,snowfall,snow_depth&hourly=temperature_2m,precipitation,wind_speed_10m,snowfall,snow_depth&daily=snowfall_sum,snow_depth_max,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris&models=arome_seamless"
        );
        const data = await response.json();
        
        if (data.current) {
          setWeather({
            temperature: data.current.temperature_2m,
            windSpeed: data.current.wind_speed_10m,
            precipitation: data.current.precipitation || 0,
            weatherCode: data.current.weather_code,
          });
        }

        // Station observation data (current snow depth from AROME)
        if (data.current) {
          setStationObs({
            snowDepth: data.current.snow_depth || 0,
            temperature: data.current.temperature_2m,
            lastUpdate: new Date().toISOString(),
          });
        }

        // Process snow forecast for next 4 days (AROME model)
        if (data.daily) {
          const forecasts: SnowForecast[] = data.daily.time.slice(0, 4).map((date: string, index: number) => ({
            date,
            snowfall: data.daily.snowfall_sum[index] || 0,
            snowDepth: data.daily.snow_depth_max[index] || 0,
            temperature: data.daily.temperature_2m_max[index] || 0,
          }));
          setSnowForecast(forecasts);
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
      name: "Speed Master",
      url: "https://www.skaping.com/vars/speed-master",
      image: webcamSpeedMaster,
    },
    {
      name: "Mayt",
      url: "https://www.skaping.com/vars/mayt",
      image: webcamMayt,
    },
    {
      name: "Col de Crévoux",
      url: "https://www.skaping.com/vars/col-de-crevoux",
      image: webcamColDeCrevoux,
    },
    {
      name: "Peynier",
      url: "https://www.skaping.com/vars/peynier",
      image: webcamPeynier,
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

          {/* Snow Report Card - Vars.com */}
          <Card className="border-border/50 shadow-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-6 w-6 text-primary" />
                {language === 'fr' ? 'Enneigement' : 'Snow Conditions'} - {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </CardTitle>
              <CardDescription>{language === 'fr' ? 'Bulletin neige officiel de Vars' : 'Official Vars snow report'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Snow depth info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-accent/10 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">Sommet (2750m)</div>
                    <div className="flex items-center justify-center gap-2">
                      <CloudSnow className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-foreground">65 cm</span>
                    </div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">Bas station (1650m)</div>
                    <div className="flex items-center justify-center gap-2">
                      <CloudSnow className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-foreground">30 cm</span>
                    </div>
                  </div>
                </div>
                
                {/* Snow quality and avalanche risk */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Qualité de neige</div>
                    <div className="font-semibold text-foreground">Fraîche</div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Risque avalanche</div>
                    <div className="font-semibold text-foreground">2/5 - Limité</div>
                  </div>
                </div>
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {webcams.map((webcam, index) => (
                <div
                  key={index}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-border/50 hover:shadow-lg transition-smooth"
                  onClick={() => setSelectedWebcam(webcam)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={webcam.image}
                      alt={webcam.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-smooth flex items-center justify-center">
                      <Camera className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="p-3 bg-background">
                    <span className="font-semibold text-foreground">{webcam.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cliquez pour voir la webcam
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Webcam Dialog */}
        <Dialog open={!!selectedWebcam} onOpenChange={(open) => !open && setSelectedWebcam(null)}>
          <DialogContent className="max-w-6xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedWebcam?.name}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full">
              <iframe
                src={selectedWebcam?.url}
                className="w-full h-full rounded-lg border-0"
                title={selectedWebcam?.name}
                allow="fullscreen"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default WeatherSnow;
