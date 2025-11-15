import { HourlyPrediction, formatTime } from "@/services/diningData";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ForecastCardProps {
  prediction: HourlyPrediction;
}

const levelEmoji = {
  low: "😌",
  moderate: "👥",
  busy: "🏃",
  packed: "🐂",
};

const levelColor = {
  low: "busyness-low",
  moderate: "busyness-moderate",
  busy: "busyness-busy",
  packed: "busyness-packed",
};

export const ForecastCard = ({ prediction }: ForecastCardProps) => {
  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">{formatTime(prediction.hour)}</span>
          </div>
          <span className="text-2xl">{levelEmoji[prediction.level]}</span>
        </div>
        
        <div className="mb-2">
          <div className="text-2xl font-bold">{prediction.occupancy}</div>
          <div className="text-xs text-muted-foreground">expected visitors</div>
        </div>
        
        {/* Visual Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full bg-${levelColor[prediction.level]} transition-all duration-500`}
            style={{ width: `${(prediction.occupancy / 500) * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
