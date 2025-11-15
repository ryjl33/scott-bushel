import { MenuItem } from "@/services/diningData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MenuSectionProps {
  meal: string;
  items: MenuItem[];
}

const dietaryBadges: { [key: string]: string } = {
  V: "Vegetarian",
  VG: "Vegan",
  GF: "Gluten-Free",
};

const categoryEmoji: { [key: string]: string } = {
  entree: "🍽️",
  side: "🥗",
  dessert: "🍰",
  drink: "🥤",
  salad: "🥬",
};

export const MenuSection = ({ meal, items }: MenuSectionProps) => {
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.station]) {
      acc[item.station] = [];
    }
    acc[item.station].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold capitalize">
          {meal === 'late-night' ? 'Late Night' : meal}
        </h2>
        <Badge variant="secondary" className="text-xs">
          Now Serving
        </Badge>
      </div>

      {Object.entries(groupedItems).map(([station, stationItems]) => (
        <Card key={station} className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{station}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {stationItems.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-lg mt-0.5">
                      {categoryEmoji[item.category]}
                    </span>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {item.dietary && item.dietary.length > 0 && (
                    <div className="flex gap-1">
                      {item.dietary.map((diet) => (
                        <Badge
                          key={diet}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-5"
                        >
                          {diet}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="font-semibold mb-1">Dietary Labels:</p>
        <div className="space-y-0.5">
          {Object.entries(dietaryBadges).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium">{key}</span> - {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};