import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSnow, Droplets, Wind, Thermometer, Camera, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [snowForecast, setSnowForecast] = useState<SnowForecast[]>([]);
  const [stationObs, setStationObs] = useState<StationObservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedWebcam, setSelectedWebcam] = useState<{ name: string; url: string } | null>(null);

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
    },
    {
      name: "Mayt",
      url: "https://www.skaping.com/vars/mayt",
    },
    {
      name: "Col de Crévoux",
      url: "https://www.skaping.com/vars/col-de-crevoux",
    },
    {
      name: "Peynier",
      url: "https://www.skaping.com/vars/peynier",
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

        {/* Station Observation Card */}
        {stationObs && (
          <Card className="border-border/50 shadow-luxury mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-6 w-6 text-primary" />
                {t("weather.stationObservation") || "Observations Station Vars (07929)"}
              </CardTitle>
              <CardDescription>
                Données en temps réel - Dernière mise à jour: {new Date(stationObs.lastUpdate).toLocaleTimeString('fr-FR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col items-center p-6 bg-primary/10 rounded-lg border-2 border-primary/20">
                  <CloudSnow className="h-10 w-10 text-primary mb-3" />
                  <span className="text-sm text-muted-foreground mb-2">
                    {t("weather.currentSnowDepth") || "Hauteur de neige actuelle"}
                  </span>
                  <span className="text-4xl font-bold text-primary">
                    {stationObs.snowDepth > 0 ? `${Math.round(stationObs.snowDepth)} cm` : '-'}
                  </span>
                </div>

                <div className="flex flex-col items-center p-6 bg-accent/10 rounded-lg">
                  <Thermometer className="h-10 w-10 text-primary mb-3" />
                  <span className="text-sm text-muted-foreground mb-2">
                    {t("weather.temperature")}
                  </span>
                  <span className="text-4xl font-bold text-foreground">
                    {stationObs.temperature}°C
                  </span>
                </div>
              </div>

              {/* Comparison with forecast */}
              {snowForecast.length > 0 && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-primary" />
                    {t("weather.comparison") || "Comparaison avec les prévisions"}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Hauteur actuelle:</span>
                      <span className="font-semibold">{stationObs.snowDepth > 0 ? `${Math.round(stationObs.snowDepth)} cm` : '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Prévision maximum (4 jours):</span>
                      <span className="font-semibold">
                        {Math.max(...snowForecast.map(f => f.snowDepth))} cm
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Chutes prévues (4 jours):</span>
                      <span className="font-semibold text-primary">
                        {snowForecast.reduce((sum, f) => sum + f.snowfall, 0).toFixed(0)} cm
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
              <CardDescription>{t("weather.snowForecastSubtitle")} - Modèle AROME (Météo France)</CardDescription>
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

              {snowForecast.length > 0 && !loading && !error && (
                <div className="space-y-3">
                  {snowForecast.map((forecast, index) => {
                    const date = new Date(forecast.date);
                    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                    const dayMonth = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                    
                    return (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-accent/10 rounded-lg hover:bg-accent/20 transition-smooth"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-left min-w-[80px]">
                            <div className="font-semibold text-foreground capitalize">{dayName}</div>
                            <div className="text-sm text-muted-foreground">{dayMonth}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CloudSnow className="h-5 w-5 text-primary" />
                            <span className="font-bold text-lg text-primary">
                              {forecast.snowfall > 0 ? `${forecast.snowfall} cm` : '-'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{t("weather.snowDepth")}</div>
                            <div className="font-semibold text-foreground">
                              {forecast.snowDepth > 0 ? `${forecast.snowDepth} cm` : '-'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{t("weather.temp")}</div>
                            <div className="font-semibold text-foreground">{forecast.temperature}°C</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto py-4 flex-col items-start hover:shadow-md transition-smooth"
                  onClick={() => setSelectedWebcam(webcam)}
                >
                  <Camera className="h-5 w-5 mb-2" />
                  <span className="font-semibold">{webcam.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Voir la webcam
                  </span>
                </Button>
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
