import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useEnvironmentTheme } from "@/hooks/useEnvironmentTheme";

type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";
type Climate = "clear" | "cloudy" | "rainy" | "windy" | "sunny" | "stormy" | "foggy";
type TimeOfDay = "dawn" | "morning" | "afternoon" | "evening" | "night";

interface EnvironmentContextType {
  season: Season;
  timeOfDay: TimeOfDay;
  climate: Climate;
  isDark: boolean;
  seasonOverride: Season | null;
  setSeasonOverride: (season: Season | null) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType>({
  season: "spring",
  timeOfDay: "morning",
  climate: "clear",
  isDark: false,
  seasonOverride: null,
  setSeasonOverride: () => {},
});

export const useEnvironment = () => useContext(EnvironmentContext);

export const EnvironmentProvider = ({ children }: { children: ReactNode }) => {
  const env = useEnvironmentTheme();
  const [seasonOverride, setSeasonOverride] = useState<Season | null>(null);

  const effectiveSeason = seasonOverride ?? env.season;

  return (
    <EnvironmentContext.Provider value={{
      ...env,
      season: effectiveSeason,
      seasonOverride,
      setSeasonOverride,
    }}>
      {children}
    </EnvironmentContext.Provider>
  );
};
