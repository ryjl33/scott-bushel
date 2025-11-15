import { Navigation } from "@/components/Navigation";
import { InsightCard } from "@/components/InsightCard";
import { NotificationSettings } from "@/components/NotificationSettings";
import { getInsights } from "@/services/diningData";
import { useDiningHall, DINING_HALLS } from "@/hooks/useDiningHall";
import { Lightbulb } from "lucide-react";

const Insights = () => {
  const { selectedHall } = useDiningHall();
  const insights = getInsights(selectedHall);

  return (
    <div className="min-h-screen bg-background pb-20">
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

        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>

        <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
          <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
            <span>🐂</span> Go Buckeyes!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Data Dining uses aggregated entry and exit data to help you find the perfect time to visit dining halls. 
            All data is anonymous and used solely to improve your dining experience.
          </p>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Insights;
