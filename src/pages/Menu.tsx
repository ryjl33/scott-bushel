import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { MenuSection } from "@/components/MenuSection";
import { useDiningHall, DINING_HALLS } from "@/hooks/useDiningHall";
import { getCurrentMenu } from "@/services/diningData";
import { UtensilsCrossed } from "lucide-react";

const Menu = () => {
  const { selectedHall } = useDiningHall();
  const [menuData, setMenuData] = useState(getCurrentMenu());
  
  useEffect(() => {
    setMenuData(getCurrentMenu());
    
    // Update menu every minute
    const menuInterval = setInterval(() => {
      setMenuData(getCurrentMenu());
    }, 60000);
    
    return () => clearInterval(menuInterval);
  }, [selectedHall]);

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
            <UtensilsCrossed className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Menu</h1>
          </div>
          <p className="text-sm text-muted-foreground">{DINING_HALLS[selectedHall]}</p>
          <p className="text-xs text-muted-foreground">{today}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-6">
        <MenuSection meal={menuData.meal} items={menuData.items} />
      </main>

      <Navigation />
    </div>
  );
};

export default Menu;
