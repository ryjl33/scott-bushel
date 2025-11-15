import { Navigation } from "@/components/Navigation";
import { InsightCard } from "@/components/InsightCard";
import { NotificationSettings } from "@/components/NotificationSettings";
import { getInsights, getStationStatus } from "@/services/diningData";
import { useDiningHall, DINING_HALLS } from "@/hooks/useDiningHall";
import { Lightbulb, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const Insights = () => {
  const {
    selectedHall
  } = useDiningHall();
  const insights = getInsights(selectedHall);
  const stations = getStationStatus(selectedHall);
  return <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold">Smart Insights</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {DINING_HALLS[selectedHall]} - Real-time tips
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-6">
        <div className="mb-6">
          <NotificationSettings />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Current Wait Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stations.map((station, index) => <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">{station.station}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={station.waitTime > 5 ? "destructive" : "default"}>
                      {station.waitTime} min wait
                    </Badge>
                    <Badge variant={station.foodLevel === 'low' ? "destructive" : station.foodLevel === 'moderate' ? "secondary" : "default"}>
                      Food: {station.foodLevel}
                    </Badge>
                    {station.outOfStock.length > 0 && <Badge variant="outline">
                        {station.outOfStock.length} out of stock
                      </Badge>}
                  </div>
                </div>
              </div>)}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {insights.map((insight, index) => <InsightCard key={index} insight={insight} />)}
        </div>

        <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
          <h2 className="font-bold text-lg mb-2 flex items-center gap-2">Go Buckeyes!














   


































          <span>
          </span> Go Buckeyes!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Data Dining uses aggregated entry and exit data to help you find the perfect time to visit dining halls. 
            All data is anonymous and used solely to improve your dining experience.
          </p>
        </div>
      </main>

      <Navigation />
    </div>;
};
export default Insights;