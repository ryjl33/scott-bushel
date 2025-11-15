import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TrendChart } from "@/components/TrendChart";
import { getHistoricalTrends } from "@/services/diningData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";

const Trends = () => {
  const [view, setView] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const data = getHistoricalTrends(view);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">Historical Trends</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze traffic patterns over time
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-6">
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hourly" className="mt-0">
            <TrendChart data={data} view="hourly" />
            <p className="text-sm text-muted-foreground mt-4">
              Average occupancy by hour across all weekdays
            </p>
          </TabsContent>
          
          <TabsContent value="daily" className="mt-0">
            <TrendChart data={data} view="daily" />
            <p className="text-sm text-muted-foreground mt-4">
              Average daily traffic by day of the week
            </p>
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-0">
            <TrendChart data={data} view="weekly" />
            <p className="text-sm text-muted-foreground mt-4">
              Daily average occupancy over the last 7 days
            </p>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Trends;
