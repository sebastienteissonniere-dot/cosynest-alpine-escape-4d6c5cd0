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

interface SnowForecast {
  date: string;
  snowfall: number;
  snowDepth: number;
  temperature: number;
}

const WeatherSnow = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [snowForecast, setSnowForecast] = useState<SnowForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch current weather and 4-day snow forecast using Météo France AROME model
        const response = await fetch(
          "https://api.open-meteo.com/v1/meteofrance?latitude=44.62&longitude=6.68&current=temperature_2m,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation,wind_speed_10m&daily=snowfall_sum,snow_depth_max,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris&models=arome_seamless"
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
