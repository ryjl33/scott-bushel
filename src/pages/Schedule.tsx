import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ForecastCard } from "@/components/ForecastCard";
import { TrendChart } from "@/components/TrendChart";
import { MenuSection } from "@/components/MenuSection";
import { useDiningHall, DINING_HALLS } from "@/hooks/useDiningHall";
import { 
  getTodayPredictions, 
  getHistoricalTrends, 
  getCurrentMenu,
  HourlyPrediction 
} from "@/services/diningData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart3, UtensilsCrossed } from "lucide-react";

const Schedule = () => {
  const { selectedHall } = useDiningHall();
  const [predictions, setPredictions] = useState<HourlyPrediction[]>([]);
  const [trendView, setTrendView] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const [menuData, setMenuData] = useState(getCurrentMenu());
  
  useEffect(() => {
    setPredictions(getTodayPredictions(selectedHall));
    
    // Update menu every minute
    const menuInterval = setInterval(() => {
      setMenuData(getCurrentMenu());
    }, 60000);
    
    return () => clearInterval(menuInterval);
  }, [selectedHall]);

  const trendData = getHistoricalTrends(trendView, selectedHall);
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">{DINING_HALLS[selectedHall]}</h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-6">
        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast" className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Forecast</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-1.5">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-4 mt-0">
            <p className="text-muted-foreground text-sm">
              Predicted busyness for the rest of today
            </p>
            <div className="grid gap-4">
              {predictions.map((prediction) => (
                <ForecastCard key={prediction.hour} prediction={prediction} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-0">
            <Tabs value={trendView} onValueChange={(v) => setTrendView(v as typeof trendView)}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="hourly">Hourly</TabsTrigger>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hourly" className="mt-0">
                <TrendChart data={trendData} view="hourly" />
                <p className="text-sm text-muted-foreground mt-4">
                  Average occupancy by hour across all weekdays
                </p>
              </TabsContent>
              
              <TabsContent value="daily" className="mt-0">
                <TrendChart data={trendData} view="daily" />
                <p className="text-sm text-muted-foreground mt-4">
                  Average daily traffic by day of the week
                </p>
              </TabsContent>
              
              <TabsContent value="weekly" className="mt-0">
                <TrendChart data={trendData} view="weekly" />
                <p className="text-sm text-muted-foreground mt-4">
                  Daily average occupancy over the last 7 days
                </p>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="menu" className="mt-0">
            <MenuSection meal={menuData.meal} items={menuData.items} />
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Schedule;