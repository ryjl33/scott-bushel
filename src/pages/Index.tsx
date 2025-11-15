import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { BusynessMeter } from "@/components/BusynessMeter";
import { DiningHallSelector } from "@/components/DiningHallSelector";
import { getCurrentOccupancy, OccupancyData } from "@/services/diningData";
import { useDiningHall, DINING_HALLS } from "@/hooks/useDiningHall";
import { useNotifications } from "@/hooks/useNotifications";
import { RefreshCw, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dataDineLogo from "@/assets/data-dine-logo.png";
const Index = () => {
  const {
    selectedHall
  } = useDiningHall();
  const {
    preferences
  } = useNotifications();
  const [occupancy, setOccupancy] = useState<OccupancyData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMonitoringThisHall = preferences.enabled && preferences.selectedHalls.includes(selectedHall);
  const fetchData = () => {
    setIsRefreshing(true);
    setOccupancy(getCurrentOccupancy(selectedHall));
    setTimeout(() => setIsRefreshing(false), 500);
  };
  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedHall]);
  return <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-b from-primary/5 to-transparent pt-8 pb-4">
        <div className="max-w-lg mx-auto px-6">
          <div className="text-center mb-4">
            <img src={dataDineLogo} alt="Data Dine Logo" className="w-24 h-24 mx-auto mb-4 bg-primary/5 rounded-2xl p-2" />
            <h1 className="text-4xl font-bold mb-4 text-gradient">
              Data Dine
            </h1>
            <DiningHallSelector />
            
            {isMonitoringThisHall && <Badge variant="secondary" className="mt-3 gap-1.5">
                <Bell className="w-3 h-3" />
                Notifications Active
              </Badge>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-6 py-8">
        {occupancy && <>
            <BusynessMeter data={occupancy} />

            {/* Last Updated */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <p className="text-sm text-muted-foreground">
                Updated {occupancy.timestamp.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            })}
              </p>
              <Button variant="ghost" size="sm" onClick={fetchData} disabled={isRefreshing} className="gap-2">
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Quick Tips */}
            <div className="mt-8 p-6 bg-card rounded-2xl border border-border">
              <h2 className="font-bold mb-3">
                Quick Tip
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {occupancy.level === 'low' && "Perfect time to visit! Grab your favorite spot."}
                {occupancy.level === 'moderate' && "Good time to swing by. Lines are manageable."}
                {occupancy.level === 'busy' && "It's getting crowded. Consider waiting 30 minutes."}
                {occupancy.level === 'packed' && "Peak rush hour! Check back in an hour for a calmer experience."}
              </p>
            </div>
          </>}
      </main>

      <Navigation />
    </div>;
};
export default Index;