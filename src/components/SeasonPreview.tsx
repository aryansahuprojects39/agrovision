import { useEnvironment } from "@/contexts/EnvironmentContext";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";

const SEASONS: { value: Season; icon: string; label: string }[] = [
  { value: "spring", icon: "🌸", label: "Spring" },
  { value: "summer", icon: "☀️", label: "Summer" },
  { value: "monsoon", icon: "🌧️", label: "Monsoon" },
  { value: "autumn", icon: "🍂", label: "Autumn" },
  { value: "winter", icon: "❄️", label: "Winter" },
];

const SeasonPreview = () => {
  const { season, seasonOverride, setSeasonOverride } = useEnvironment();

  return (
    <div className="flex items-center gap-1 bg-muted/60 rounded-full px-1.5 py-0.5 backdrop-blur-sm">
      {SEASONS.map((s) => {
        const isActive = season === s.value;
        const isOverridden = seasonOverride === s.value;
        return (
          <Tooltip key={s.value}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSeasonOverride(isOverridden ? null : s.value)}
                className={`text-sm w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-primary/20 ring-1 ring-primary scale-110"
                    : "hover:bg-muted opacity-60 hover:opacity-100"
                }`}
                aria-label={`${s.label} ${isOverridden ? "(active override)" : ""}`}
              >
                {s.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs font-semibold">
              {s.label} {isOverridden ? "(click to reset)" : ""}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default SeasonPreview;
