import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ForecastCard } from "@/components/ForecastCard";
import { getTodayPredictions, HourlyPrediction } from "@/services/diningData";
import { Calendar } from "lucide-react";

const Forecast = () => {
  const [predictions, setPredictions] = useState<HourlyPrediction[]>([]);

  useEffect(() => {
    setPredictions(getTodayPredictions());
  }, []);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">Today's Forecast</h1>
          </div>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-6">
        <p className="text-muted-foreground mb-6">
          Predicted busyness levels for the rest of today based on historical patterns
        </p>

        <div className="grid gap-4">
          {predictions.map((prediction) => (
            <ForecastCard key={prediction.hour} prediction={prediction} />
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Forecast;
