import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { MenuSection } from "@/components/MenuSection";
import { useDiningHall, DINING_HALLS } from "@/hooks/useDiningHall";
import { getCurrentMenu, BREAKFAST_MENU, LUNCH_MENU, DINNER_MENU, LATE_NIGHT_MENU } from "@/services/diningData";
import { UtensilsCrossed } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Menu = () => {
  const { selectedHall } = useDiningHall();
  const [currentMeal, setCurrentMeal] = useState(getCurrentMenu().meal);
  
  useEffect(() => {
    setCurrentMeal(getCurrentMenu().meal);
    
    // Update current meal every minute
    const menuInterval = setInterval(() => {
      setCurrentMeal(getCurrentMenu().meal);
    }, 60000);
    
    return () => clearInterval(menuInterval);
  }, [selectedHall]);

  const allMenus = [
    { meal: "Breakfast", items: BREAKFAST_MENU },
    { meal: "Lunch", items: LUNCH_MENU },
    { meal: "Dinner", items: DINNER_MENU },
    { meal: "Late Night", items: LATE_NIGHT_MENU },
  ];

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
        <Tabs defaultValue={currentMeal} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            {allMenus.map((menu) => (
              <TabsTrigger 
                key={menu.meal} 
                value={menu.meal}
                className="data-[state=inactive]:opacity-50"
              >
                {menu.meal}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {allMenus.map((menu) => (
            <TabsContent key={menu.meal} value={menu.meal}>
              <MenuSection 
                meal={menu.meal} 
                items={menu.items} 
                isCurrentMeal={menu.meal === currentMeal}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Menu;
