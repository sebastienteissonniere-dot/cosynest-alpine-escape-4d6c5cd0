import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSnow, Droplets, Wind, Thermometer, Camera, Mountain } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import webcamSpeedMaster from "@/assets/webcam-speed-master.jpg";
import webcamMayt from "@/assets/webcam-mayt.jpg";
import webcamColDeCrevoux from "@/assets/webcam-col-de-crevoux.jpg";
import webcamPeynier from "@/assets/webcam-peynier.jpg";
import mqtt from "mqtt";

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

interface SnowReport {
  summitDepth: number;
  resortDepth: number;
  freshSnow: number;
  lastUpdate: string;
  snowQuality: string;
  avalancheRisk: string;
}

const WeatherSnow = () => {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [snowForecast, setSnowForecast] = useState<SnowForecast[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stationObs, setStationObs] = useState<StationObservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedWebcam, setSelectedWebcam] = useState<{ name: string; url: string; image: string } | null>(null);

  const [snowReport, setSnowReport] = useState<SnowReport>({
    summitDepth: 0,
    resortDepth: 0,
    freshSnow: 0,
    lastUpdate: new Date().toISOString(),
    snowQuality: "Fresh",
    avalancheRisk: "--/5"
  });

  useEffect(() => {
    // MQTT Connection for Live Snow Data
    const client = mqtt.connect("wss://wss.mqtt.digibox.app:443/mqtt", {
      username: "digiPoulpe",
      password: "WyumfcItTe2ZJ1HhOovJ",
      clean: true,
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    });

    client.on("connect", () => {
      console.log("Connected to Digisnow MQTT");
      client.subscribe("poulpe/DigiSnow/vars/snow/latest");
      client.subscribe("poulpe/DigiSnow/vars/forecastReport/latest/avalancheRisk");
    });

    client.on("message", (topic, message) => {
      if (topic === "poulpe/DigiSnow/vars/snow/latest") {
        try {
          const payload = JSON.parse(message.toString());
          // Payload is an array of objects. We need to find "Haut station" and "Bas station"
          // Based on research:
          // Haut station (Summit) -> zoneId 2, total_depth 85, fresh_depth 27 (example)
          // Bas station (Resort) -> zoneId 1, total_depth 70, fresh_depth 15 (example)

          const summit = payload.find((p: any) => p.where === "Haut station");
          const resort = payload.find((p: any) => p.where === "Bas station");

          if (summit && resort) {
            setSnowReport(prev => ({
              ...prev,
              summitDepth: summit.total_depth || 0,
              resortDepth: resort.total_depth || 0,
              freshSnow: summit.fresh_depth || 0,
              lastUpdate: new Date().toISOString(),
              // Assuming quality is in the payload too, typically "fresh" -> mapped to string
              snowQuality: summit.quality || "Fresh",
            }));
          }
        } catch (e) {
          console.error("Error parsing MQTT snow message", e);
        }
      } else if (topic === "poulpe/DigiSnow/vars/forecastReport/latest/avalancheRisk") {
        try {
          const payload = JSON.parse(message.toString());
          if (payload.level) {
            setSnowReport(prev => ({
              ...prev,
              avalancheRisk: `${payload.level}/5`
            }));
          }
        } catch (e) {
          console.error("Error parsing MQTT avalanche message", e);
        }
      }
    });

    return () => {
      if (client.connected) {
        client.end();
      }
    };
  }, []);

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
                    <div className="text-sm text-muted-foreground mb-1">{language === 'fr' ? 'Sommet (2750m)' : 'Summit (2750m)'}</div>
                    <div className="flex items-center justify-center gap-2">
                      <CloudSnow className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-foreground">{snowReport.summitDepth === 0 ? '--' : snowReport.summitDepth} cm</span>
                    </div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg text-center">
                    <div className="text-sm text-muted-foreground mb-1">{language === 'fr' ? 'Bas station (1650m)' : 'Base (1650m)'}</div>
                    <div className="flex items-center justify-center gap-2">
                      <CloudSnow className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-foreground">{snowReport.resortDepth === 0 ? '--' : snowReport.resortDepth} cm</span>
                    </div>
                  </div>
                </div>

                {/* Snow quality and avalanche risk */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">{language === 'fr' ? 'Qualité de neige' : 'Snow quality'}</div>
                    <div className="font-semibold text-foreground">
                      {language === 'fr' ? (snowReport.snowQuality === 'fresh' ? 'Fraîche' : snowReport.snowQuality) : snowReport.snowQuality}
                    </div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">{language === 'fr' ? 'Risque avalanche' : 'Avalanche risk'}</div>
                    <div className="font-semibold text-foreground">{snowReport.avalancheRisk}</div>
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
          <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-6">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl">{selectedWebcam?.name}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full flex-1 min-h-0 mt-2">
              <iframe
                src={selectedWebcam?.url}
                className="w-full h-full rounded-lg border-0 bg-muted"
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
