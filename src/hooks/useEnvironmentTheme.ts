import { useEffect, useState, useCallback } from "react";

type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";
type Climate = "clear" | "cloudy" | "rainy" | "windy" | "sunny" | "stormy" | "foggy";
type TimeOfDay = "dawn" | "morning" | "afternoon" | "evening" | "night";

function getIndiaSeason(): Season {
  const month = new Date().getMonth();
  if (month === 11 || month === 0 || month === 1) return "winter";
  if (month === 2 || month === 3) return "spring";
  if (month === 4 || month === 5) return "summer";
  if (month >= 6 && month <= 8) return "monsoon";
  return "autumn";
}

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

function getClimateFromCode(code: number, wind: number): Climate {
  if (wind > 30) return "windy";
  if ([0, 1].includes(code)) return "sunny";
  if ([2].includes(code)) return "clear";
  if ([3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return "foggy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rainy";
  if ([95, 96, 99].includes(code)) return "stormy";
  return "clear";
}

interface ThemeVars {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  heroDark: string;
  heroDarkForeground: string;
}

// 10 distinct palettes: season × isNight, for both light and dark UI modes
// Each palette is tuned to complement its respective hero background image
type SeasonTimeKey = `${Season}_day` | `${Season}_night`;

const THEME_PALETTES: Record<SeasonTimeKey, { light: Partial<ThemeVars>; dark: Partial<ThemeVars> }> = {
  // Spring Day: bright green mustard fields, blue sky
  spring_day: {
    light: {
      background: "120 20% 97%",
      foreground: "150 40% 8%",
      primary: "142 70% 28%",
      primaryForeground: "0 0% 100%",
      secondary: "72 85% 45%",
      secondaryForeground: "150 40% 8%",
      accent: "142 40% 90%",
      accentForeground: "142 70% 20%",
      muted: "120 12% 93%",
      mutedForeground: "150 10% 40%",
      border: "142 15% 88%",
      heroDark: "150 40% 8%",
      heroDarkForeground: "0 0% 100%",
    },
    dark: {
      background: "150 30% 5%",
      foreground: "120 15% 93%",
      primary: "142 65% 35%",
      primaryForeground: "0 0% 100%",
      secondary: "72 80% 48%",
      secondaryForeground: "150 40% 8%",
      accent: "142 30% 15%",
      accentForeground: "142 50% 65%",
      muted: "150 20% 12%",
      mutedForeground: "120 10% 55%",
      border: "150 20% 15%",
      heroDark: "150 30% 5%",
      heroDarkForeground: "0 0% 100%",
    },
  },
  // Spring Night: moonlit green fields, deep blue sky
  spring_night: {
    light: {
      background: "200 15% 95%",
      foreground: "220 30% 12%",
      primary: "210 50% 35%",
      primaryForeground: "0 0% 100%",
      secondary: "160 60% 40%",
      secondaryForeground: "0 0% 100%",
      accent: "200 30% 90%",
      accentForeground: "210 50% 25%",
      muted: "200 12% 91%",
      mutedForeground: "210 15% 45%",
      border: "200 12% 86%",
      heroDark: "220 35% 10%",
      heroDarkForeground: "180 20% 95%",
    },
    dark: {
      background: "220 30% 4%",
      foreground: "200 15% 90%",
      primary: "200 45% 40%",
      primaryForeground: "0 0% 100%",
      secondary: "160 55% 42%",
      secondaryForeground: "0 0% 100%",
      accent: "210 25% 14%",
      accentForeground: "200 40% 70%",
      muted: "220 20% 10%",
      mutedForeground: "200 12% 55%",
      border: "220 20% 14%",
      heroDark: "220 30% 4%",
      heroDarkForeground: "180 20% 92%",
    },
  },
  // Summer Day: golden wheat, intense warm sun
  summer_day: {
    light: {
      background: "40 30% 97%",
      foreground: "30 35% 10%",
      primary: "35 80% 40%",
      primaryForeground: "0 0% 100%",
      secondary: "45 90% 48%",
      secondaryForeground: "30 40% 10%",
      accent: "40 50% 90%",
      accentForeground: "35 70% 25%",
      muted: "40 18% 92%",
      mutedForeground: "30 15% 42%",
      border: "40 20% 88%",
      heroDark: "30 40% 8%",
      heroDarkForeground: "45 30% 98%",
    },
    dark: {
      background: "30 25% 6%",
      foreground: "40 20% 90%",
      primary: "35 75% 42%",
      primaryForeground: "0 0% 100%",
      secondary: "45 85% 50%",
      secondaryForeground: "30 40% 8%",
      accent: "35 30% 15%",
      accentForeground: "40 50% 65%",
      muted: "30 18% 12%",
      mutedForeground: "40 12% 55%",
      border: "30 20% 15%",
      heroDark: "30 25% 5%",
      heroDarkForeground: "45 25% 95%",
    },
  },
  // Summer Night: golden wheat under warm moonlight, dark sky
  summer_night: {
    light: {
      background: "25 20% 95%",
      foreground: "20 30% 12%",
      primary: "25 65% 38%",
      primaryForeground: "0 0% 100%",
      secondary: "40 75% 45%",
      secondaryForeground: "20 35% 10%",
      accent: "30 35% 89%",
      accentForeground: "25 60% 25%",
      muted: "25 15% 90%",
      mutedForeground: "20 12% 45%",
      border: "25 15% 85%",
      heroDark: "20 35% 8%",
      heroDarkForeground: "40 25% 95%",
    },
    dark: {
      background: "20 22% 5%",
      foreground: "30 18% 88%",
      primary: "30 60% 40%",
      primaryForeground: "0 0% 100%",
      secondary: "40 70% 48%",
      secondaryForeground: "20 30% 8%",
      accent: "25 25% 13%",
      accentForeground: "35 45% 65%",
      muted: "20 18% 10%",
      mutedForeground: "30 12% 52%",
      border: "20 18% 14%",
      heroDark: "20 22% 4%",
      heroDarkForeground: "35 20% 92%",
    },
  },
  // Monsoon Day: rainy green paddy, dark stormy clouds
  monsoon_day: {
    light: {
      background: "190 20% 96%",
      foreground: "195 30% 10%",
      primary: "175 60% 30%",
      primaryForeground: "0 0% 100%",
      secondary: "160 65% 42%",
      secondaryForeground: "0 0% 100%",
      accent: "180 40% 90%",
      accentForeground: "175 60% 20%",
      muted: "185 15% 91%",
      mutedForeground: "190 12% 42%",
      border: "180 15% 86%",
      heroDark: "195 35% 8%",
      heroDarkForeground: "180 15% 97%",
    },
    dark: {
      background: "195 30% 5%",
      foreground: "185 15% 90%",
      primary: "175 55% 35%",
      primaryForeground: "0 0% 100%",
      secondary: "160 60% 40%",
      secondaryForeground: "0 0% 100%",
      accent: "180 25% 14%",
      accentForeground: "175 40% 65%",
      muted: "195 18% 11%",
      mutedForeground: "185 12% 52%",
      border: "195 20% 14%",
      heroDark: "195 30% 4%",
      heroDarkForeground: "180 12% 95%",
    },
  },
  // Monsoon Night: lightning, rain, very dark moody
  monsoon_night: {
    light: {
      background: "210 18% 94%",
      foreground: "215 28% 12%",
      primary: "200 50% 32%",
      primaryForeground: "0 0% 100%",
      secondary: "175 55% 38%",
      secondaryForeground: "0 0% 100%",
      accent: "205 30% 89%",
      accentForeground: "200 45% 22%",
      muted: "210 12% 89%",
      mutedForeground: "210 12% 45%",
      border: "210 12% 84%",
      heroDark: "215 35% 7%",
      heroDarkForeground: "200 15% 95%",
    },
    dark: {
      background: "215 28% 4%",
      foreground: "205 15% 88%",
      primary: "200 45% 38%",
      primaryForeground: "0 0% 100%",
      secondary: "175 50% 40%",
      secondaryForeground: "0 0% 100%",
      accent: "210 22% 12%",
      accentForeground: "200 35% 65%",
      muted: "215 20% 9%",
      mutedForeground: "205 10% 50%",
      border: "215 20% 13%",
      heroDark: "215 28% 3%",
      heroDarkForeground: "200 12% 92%",
    },
  },
  // Autumn Day: golden harvest, warm orange sunset
  autumn_day: {
    light: {
      background: "25 25% 97%",
      foreground: "20 35% 10%",
      primary: "20 70% 38%",
      primaryForeground: "0 0% 100%",
      secondary: "35 80% 48%",
      secondaryForeground: "20 40% 10%",
      accent: "25 45% 90%",
      accentForeground: "20 65% 22%",
      muted: "25 18% 92%",
      mutedForeground: "20 12% 42%",
      border: "25 18% 87%",
      heroDark: "20 40% 8%",
      heroDarkForeground: "30 25% 98%",
    },
    dark: {
      background: "20 25% 6%",
      foreground: "25 18% 88%",
      primary: "20 65% 38%",
      primaryForeground: "0 0% 100%",
      secondary: "35 75% 48%",
      secondaryForeground: "20 35% 8%",
      accent: "25 30% 14%",
      accentForeground: "30 45% 65%",
      muted: "20 18% 11%",
      mutedForeground: "25 12% 52%",
      border: "20 20% 14%",
      heroDark: "20 25% 5%",
      heroDarkForeground: "30 20% 95%",
    },
  },
  // Autumn Night: amber moonlit harvest fields
  autumn_night: {
    light: {
      background: "18 20% 94%",
      foreground: "15 28% 12%",
      primary: "15 55% 35%",
      primaryForeground: "0 0% 100%",
      secondary: "30 65% 45%",
      secondaryForeground: "0 0% 100%",
      accent: "20 30% 88%",
      accentForeground: "15 50% 25%",
      muted: "18 14% 89%",
      mutedForeground: "15 10% 45%",
      border: "18 14% 84%",
      heroDark: "15 30% 7%",
      heroDarkForeground: "25 20% 95%",
    },
    dark: {
      background: "15 22% 5%",
      foreground: "20 15% 86%",
      primary: "18 55% 38%",
      primaryForeground: "0 0% 100%",
      secondary: "30 60% 45%",
      secondaryForeground: "0 0% 100%",
      accent: "18 22% 13%",
      accentForeground: "25 40% 62%",
      muted: "15 18% 10%",
      mutedForeground: "20 10% 50%",
      border: "15 18% 13%",
      heroDark: "15 22% 4%",
      heroDarkForeground: "25 18% 90%",
    },
  },
  // Winter Day: misty frost, cold blue-green tones
  winter_day: {
    light: {
      background: "210 15% 97%",
      foreground: "215 25% 12%",
      primary: "210 40% 38%",
      primaryForeground: "0 0% 100%",
      secondary: "200 50% 50%",
      secondaryForeground: "0 0% 100%",
      accent: "210 30% 92%",
      accentForeground: "210 45% 25%",
      muted: "210 10% 92%",
      mutedForeground: "210 10% 42%",
      border: "210 12% 88%",
      heroDark: "210 30% 10%",
      heroDarkForeground: "200 15% 97%",
    },
    dark: {
      background: "215 25% 6%",
      foreground: "210 12% 90%",
      primary: "210 38% 38%",
      primaryForeground: "0 0% 100%",
      secondary: "200 45% 48%",
      secondaryForeground: "0 0% 100%",
      accent: "210 25% 14%",
      accentForeground: "200 35% 65%",
      muted: "215 18% 11%",
      mutedForeground: "210 10% 52%",
      border: "215 18% 14%",
      heroDark: "215 25% 5%",
      heroDarkForeground: "200 12% 94%",
    },
  },
  // Winter Night: deep blue frost, cold moonlit mist
  winter_night: {
    light: {
      background: "225 15% 94%",
      foreground: "230 25% 14%",
      primary: "220 40% 35%",
      primaryForeground: "0 0% 100%",
      secondary: "210 45% 48%",
      secondaryForeground: "0 0% 100%",
      accent: "225 25% 90%",
      accentForeground: "220 40% 25%",
      muted: "225 10% 89%",
      mutedForeground: "225 10% 45%",
      border: "225 10% 84%",
      heroDark: "230 30% 8%",
      heroDarkForeground: "215 15% 95%",
    },
    dark: {
      background: "230 25% 4%",
      foreground: "220 12% 88%",
      primary: "215 35% 38%",
      primaryForeground: "0 0% 100%",
      secondary: "210 40% 45%",
      secondaryForeground: "0 0% 100%",
      accent: "225 20% 12%",
      accentForeground: "215 30% 62%",
      muted: "230 18% 9%",
      mutedForeground: "220 10% 50%",
      border: "230 18% 13%",
      heroDark: "230 25% 3%",
      heroDarkForeground: "215 12% 90%",
    },
  },
};

// Climate modifiers (subtle adjustments on top)
const CLIMATE_MODIFIERS: Record<Climate, { light: Partial<ThemeVars>; dark: Partial<ThemeVars> }> = {
  sunny: {
    light: { muted: "45 15% 93%" },
    dark: {},
  },
  clear: { light: {}, dark: {} },
  cloudy: {
    light: { muted: "210 8% 90%", mutedForeground: "210 8% 45%" },
    dark: { muted: "210 12% 11%" },
  },
  foggy: {
    light: { muted: "200 6% 88%" },
    dark: {},
  },
  rainy: {
    light: { muted: "205 10% 89%", border: "205 10% 84%" },
    dark: { muted: "205 15% 10%", border: "205 15% 12%" },
  },
  stormy: {
    light: { muted: "220 12% 85%", border: "220 12% 80%" },
    dark: { muted: "220 18% 8%" },
  },
  windy: {
    light: {},
    dark: {},
  },
};

function applyThemeVars(vars: Partial<ThemeVars>) {
  const root = document.documentElement;
  const map: Record<keyof ThemeVars, string> = {
    background: "--background",
    foreground: "--foreground",
    card: "--card",
    cardForeground: "--card-foreground",
    primary: "--primary",
    primaryForeground: "--primary-foreground",
    secondary: "--secondary",
    secondaryForeground: "--secondary-foreground",
    muted: "--muted",
    mutedForeground: "--muted-foreground",
    accent: "--accent",
    accentForeground: "--accent-foreground",
    border: "--border",
    heroDark: "--hero-dark",
    heroDarkForeground: "--hero-dark-foreground",
  };

  Object.entries(vars).forEach(([key, value]) => {
    if (value && map[key as keyof ThemeVars]) {
      root.style.setProperty(map[key as keyof ThemeVars], value);
    }
  });
}

function isNightTime(timeOfDay: TimeOfDay): boolean {
  return timeOfDay === "night" || timeOfDay === "evening";
}

export function useEnvironmentTheme() {
  const [season, setSeason] = useState<Season>(getIndiaSeason);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay);
  const [climate, setClimate] = useState<Climate>("clear");
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  // Watch for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Update time of day every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
      setSeason(getIndiaSeason());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.209&current=weather_code,wind_speed_10m"
        );
        const data = await res.json();
        if (data.current) {
          setClimate(getClimateFromCode(data.current.weather_code, data.current.wind_speed_10m));
        }
      } catch {
        // fallback
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Apply combined theme
  const applyTheme = useCallback(() => {
    const mode = isDark ? "dark" : "light";
    const timeKey: SeasonTimeKey = `${season}_${isNightTime(timeOfDay) ? "night" : "day"}`;
    const baseVars = THEME_PALETTES[timeKey][mode];
    const climateVars = CLIMATE_MODIFIERS[climate][mode];

    // Layer: base palette → climate modifier
    const combined = { ...baseVars, ...climateVars };
    applyThemeVars(combined);

    // Also update input & ring to match
    const root = document.documentElement;
    if (combined.border) root.style.setProperty("--input", combined.border);
    if (combined.primary) root.style.setProperty("--ring", combined.primary);
  }, [season, timeOfDay, climate, isDark]);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return { season, timeOfDay, climate, isDark };
}
