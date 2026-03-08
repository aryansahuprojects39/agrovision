import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Droplets, Wind, Thermometer, Search, Loader2, Sun, Cloud, CloudRain, Snowflake, Eye, Gauge } from "lucide-react";
import { toast } from "sonner";

interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  visibility: number;
  pressure: number;
  daily: DayForecast[];
}

interface DayForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

const weatherCodeToInfo = (code: number): { label: string; Icon: typeof Sun } => {
  if (code <= 1) return { label: "Clear", Icon: Sun };
  if (code <= 3) return { label: "Cloudy", Icon: Cloud };
  if (code <= 67) return { label: "Rain", Icon: CloudRain };
  if (code <= 77) return { label: "Snow", Icon: Snowflake };
  return { label: "Stormy", Icon: CloudRain };
};

const WeatherPage = () => {
  const { trackActivity } = useActivityTracker();
  const [location, setLocation] = useState("");

  useEffect(() => { trackActivity("weather_check"); }, []);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,surface_pressure&timezone=auto`),
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`),
      ]);
      const current = await currentRes.json();
      const forecast = await forecastRes.json();

      const code = current.current.weather_code;
      const info = weatherCodeToInfo(code);

      setWeather({
        location: name,
        temperature: Math.round(current.current.temperature_2m),
        feelsLike: Math.round(current.current.apparent_temperature),
        humidity: current.current.relative_humidity_2m,
        windSpeed: Math.round(current.current.wind_speed_10m),
        description: info.label,
        icon: info.label,
        visibility: 10,
        pressure: Math.round(current.current.surface_pressure),
        daily: forecast.daily.time.map((date: string, i: number) => ({
          date,
          tempMax: Math.round(forecast.daily.temperature_2m_max[i]),
          tempMin: Math.round(forecast.daily.temperature_2m_min[i]),
          weatherCode: forecast.daily.weather_code[i],
        })),
      });
    } catch {
      toast.error("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
      const data = await res.json();
      if (!data.results?.length) { toast.error("Location not found"); setLoading(false); return; }
      const { latitude, longitude, name, country } = data.results[0];
      await fetchWeather(latitude, longitude, `${name}, ${country}`);
    } catch {
      toast.error("Search failed");
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, "Your Location"),
      () => toast.error("Location access denied")
    );
  };

  const WeatherIcon = ({ code, className }: { code?: number; className?: string }) => {
    const { Icon } = weatherCodeToInfo(code ?? 0);
    return <Icon className={className} />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <CloudSun className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Weather Intelligence</h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real-time weather data and 7-day forecasts to plan your farming activities
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Enter city or farm location..." value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
            <Button type="button" variant="outline" onClick={handleUseMyLocation} disabled={loading}>
              📍 My Location
            </Button>
          </form>
        </div>

        {weather && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Current Weather */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center">
                    <WeatherIcon code={0} className="h-16 w-16 text-secondary mx-auto" />
                    <p className="text-lg font-medium text-foreground mt-2">{weather.description}</p>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm text-muted-foreground">{weather.location}</p>
                    <p className="text-5xl font-bold text-foreground">{weather.temperature}°C</p>
                    <p className="text-sm text-muted-foreground">Feels like {weather.feelsLike}°C</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Droplets className="h-4 w-4 text-primary" />
                      <span>{weather.humidity}% Humidity</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Wind className="h-4 w-4 text-primary" />
                      <span>{weather.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Gauge className="h-4 w-4 text-primary" />
                      <span>{weather.pressure} hPa</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4 text-primary" />
                      <span>{weather.visibility} km</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farming Tips */}
            <Card>
              <CardHeader><CardTitle className="text-base">🌾 Farming Advisory</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-accent">
                    <p className="font-medium text-accent-foreground">Irrigation</p>
                    <p className="text-muted-foreground mt-1">
                      {weather.humidity > 70 ? "High humidity — skip watering today" : "Low humidity — ensure adequate irrigation"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent">
                    <p className="font-medium text-accent-foreground">Spraying</p>
                    <p className="text-muted-foreground mt-1">
                      {weather.windSpeed > 15 ? "High wind — avoid pesticide spraying" : "Good conditions for spraying"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent">
                    <p className="font-medium text-accent-foreground">Crops</p>
                    <p className="text-muted-foreground mt-1">
                      {weather.temperature > 35 ? "Extreme heat — provide shade for sensitive crops" : weather.temperature < 10 ? "Cold weather — protect from frost" : "Favorable temperature for most crops"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 7-Day Forecast */}
            <Card>
              <CardHeader><CardTitle className="text-base">7-Day Forecast</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {weather.daily.map((day, i) => {
                    const info = weatherCodeToInfo(day.weatherCode);
                    return (
                      <div key={day.date} className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">
                          {i === 0 ? "Today" : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                        </p>
                        <WeatherIcon code={day.weatherCode} className="h-6 w-6 mx-auto my-2 text-primary" />
                        <p className="text-xs text-muted-foreground">{info.label}</p>
                        <p className="text-sm font-semibold text-foreground">{day.tempMax}°</p>
                        <p className="text-xs text-muted-foreground">{day.tempMin}°</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!weather && !loading && (
          <div className="text-center py-20 text-muted-foreground">
            <CloudSun className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Search for a location to see weather data</p>
            <p className="text-sm mt-1">Enter your farm location or use your current position</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
