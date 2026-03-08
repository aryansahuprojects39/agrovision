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

// HSL CSS variable values for each combination
// Format: "H S% L%"
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

// Base seasonal palettes
const SEASON_THEMES: Record<Season, { light: Partial<ThemeVars>; dark: Partial<ThemeVars> }> = {
  spring: {
    light: {
      background: "120 20% 97%",
      primary: "142 70% 28%",
      secondary: "72 85% 50%",
      accent: "142 40% 90%",
      accentForeground: "142 70% 20%",
      border: "142 15% 88%",
    },
    dark: {
      background: "150 30% 5%",
      primary: "142 65% 35%",
      secondary: "72 80% 48%",
      accent: "142 30% 15%",
      border: "150 20% 15%",
    },
  },
  summer: {
    light: {
      background: "40 30% 97%",
      primary: "35 80% 45%",
      secondary: "45 90% 55%",
      accent: "40 50% 90%",
      accentForeground: "35 70% 25%",
      border: "40 20% 88%",
    },
    dark: {
      background: "30 25% 6%",
      primary: "35 75% 42%",
      secondary: "45 85% 50%",
      accent: "35 30% 15%",
      border: "30 20% 15%",
    },
  },
  monsoon: {
    light: {
      background: "190 20% 96%",
      primary: "175 60% 30%",
      secondary: "190 70% 50%",
      accent: "180 40% 90%",
      accentForeground: "175 60% 20%",
      border: "180 15% 86%",
    },
    dark: {
      background: "195 30% 5%",
      primary: "175 55% 35%",
      secondary: "190 65% 45%",
      accent: "180 25% 14%",
      border: "195 20% 14%",
    },
  },
  autumn: {
    light: {
      background: "25 25% 97%",
      primary: "20 70% 40%",
      secondary: "35 80% 52%",
      accent: "25 45% 90%",
      accentForeground: "20 65% 22%",
      border: "25 18% 87%",
    },
    dark: {
      background: "20 25% 6%",
      primary: "20 65% 38%",
      secondary: "35 75% 48%",
      accent: "25 30% 14%",
      border: "20 20% 14%",
    },
  },
  winter: {
    light: {
      background: "210 15% 97%",
      primary: "210 40% 40%",
      secondary: "200 50% 55%",
      accent: "210 30% 92%",
      accentForeground: "210 45% 25%",
      border: "210 12% 88%",
    },
    dark: {
      background: "215 25% 6%",
      primary: "210 38% 38%",
      secondary: "200 45% 48%",
      accent: "210 25% 14%",
      border: "215 18% 14%",
    },
  },
};

// Time-of-day modifiers (applied on top of season)
const TIME_MODIFIERS: Record<TimeOfDay, { light: Partial<ThemeVars>; dark: Partial<ThemeVars> }> = {
  dawn: {
    light: { background: "30 20% 96%", heroDark: "25 30% 12%" },
    dark: { background: "25 20% 7%", heroDark: "25 25% 6%" },
  },
  morning: {
    light: {},
    dark: {},
  },
  afternoon: {
    light: { background: "45 15% 97%" },
    dark: {},
  },
  evening: {
    light: { background: "20 18% 95%", heroDark: "15 35% 10%" },
    dark: { background: "15 22% 5%", heroDark: "15 30% 4%" },
  },
  night: {
    light: { background: "230 12% 94%", heroDark: "230 30% 8%" },
    dark: { background: "230 25% 4%", heroDark: "230 30% 3%" },
  },
};

// Climate modifiers
const CLIMATE_MODIFIERS: Record<Climate, { light: Partial<ThemeVars>; dark: Partial<ThemeVars> }> = {
  sunny: {
    light: { background: "48 25% 97%", muted: "45 15% 93%" },
    dark: {},
  },
  clear: { light: {}, dark: {} },
  cloudy: {
    light: { background: "210 8% 94%", muted: "210 8% 90%", mutedForeground: "210 8% 45%" },
    dark: { background: "210 15% 5%", muted: "210 12% 11%" },
  },
  foggy: {
    light: { background: "200 6% 92%", muted: "200 6% 88%" },
    dark: { background: "200 10% 5%" },
  },
  rainy: {
    light: { background: "205 12% 93%", muted: "205 10% 89%", border: "205 10% 84%" },
    dark: { background: "205 18% 4%", muted: "205 15% 10%", border: "205 15% 12%" },
  },
  stormy: {
    light: { background: "220 15% 90%", muted: "220 12% 85%", border: "220 12% 80%" },
    dark: { background: "220 20% 3%", muted: "220 18% 8%" },
  },
  windy: {
    light: { background: "180 8% 95%" },
    dark: { background: "180 12% 5%" },
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
    const seasonVars = SEASON_THEMES[season][mode];
    const timeVars = TIME_MODIFIERS[timeOfDay][mode];
    const climateVars = CLIMATE_MODIFIERS[climate][mode];

    // Layer: season base → time modifier → climate modifier
    const combined = { ...seasonVars, ...timeVars, ...climateVars };
    applyThemeVars(combined);

    // Also update input & ring to match border/primary
    const root = document.documentElement;
    if (combined.border) root.style.setProperty("--input", combined.border);
    if (combined.primary) root.style.setProperty("--ring", combined.primary);
  }, [season, timeOfDay, climate, isDark]);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return { season, timeOfDay, climate, isDark };
}
