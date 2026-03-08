import { createContext, useContext, ReactNode } from "react";
import { useEnvironmentTheme } from "@/hooks/useEnvironmentTheme";

type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";
type Climate = "clear" | "cloudy" | "rainy" | "windy" | "sunny" | "stormy" | "foggy";
type TimeOfDay = "dawn" | "morning" | "afternoon" | "evening" | "night";

interface EnvironmentContextType {
  season: Season;
  timeOfDay: TimeOfDay;
  climate: Climate;
  isDark: boolean;
}

const EnvironmentContext = createContext<EnvironmentContextType>({
  season: "spring",
  timeOfDay: "morning",
  climate: "clear",
  isDark: false,
});

export const useEnvironment = () => useContext(EnvironmentContext);

export const EnvironmentProvider = ({ children }: { children: ReactNode }) => {
  const env = useEnvironmentTheme();
  return (
    <EnvironmentContext.Provider value={env}>
      {children}
    </EnvironmentContext.Provider>
  );
};
