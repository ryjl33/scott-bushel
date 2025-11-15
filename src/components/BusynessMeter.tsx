import { OccupancyData } from "@/services/diningData";
import { Activity } from "lucide-react";

interface BusynessMeterProps {
  data: OccupancyData;
}

const levelConfig = {
  low: {
    label: "Chill right now",
    emoji: "😌",
    color: "hsl(var(--busyness-low))",
    bgColor: "hsl(var(--busyness-low) / 0.1)",
  },
  moderate: {
    label: "Getting busy",
    emoji: "👥",
    color: "hsl(var(--busyness-moderate))",
    bgColor: "hsl(var(--busyness-moderate) / 0.1)",
  },
  busy: {
    label: "Pretty packed",
    emoji: "🏃",
    color: "hsl(var(--busyness-busy))",
    bgColor: "hsl(var(--busyness-busy) / 0.1)",
  },
  packed: {
    label: "Stampede hours!",
    emoji: "🐂",
    color: "hsl(var(--busyness-packed))",
    bgColor: "hsl(var(--busyness-packed) / 0.1)",
  },
};

export const BusynessMeter = ({ data }: BusynessMeterProps) => {
  const config = levelConfig[data.level];
  const percentage = Math.round(data.percentage * 100);

  return (
    <div className="relative">
      {/* Main Meter */}
      <div className="relative w-64 h-64 mx-auto">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={config.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.percentage)}`}
            className="transition-all duration-1000 ease-out meter-glow"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl mb-2">{config.emoji}</div>
          <div className="text-4xl font-bold" style={{ color: config.color }}>
            {data.current}
          </div>
          <div className="text-sm text-muted-foreground">of {data.capacity}</div>
        </div>
      </div>

      {/* Status Label */}
      <div
        className="mt-6 px-6 py-3 rounded-full text-center font-semibold text-lg mx-auto max-w-fit"
        style={{ backgroundColor: config.bgColor, color: config.color }}
      >
        {config.label}
      </div>

      {/* Percentage */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Activity className="w-4 h-4" />
          <span className="text-sm">{percentage}% capacity</span>
        </div>
      </div>
    </div>
  );
};
