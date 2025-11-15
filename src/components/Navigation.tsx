import { NavLink } from "@/components/NavLink";
import { Home, CalendarClock, Lightbulb } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Live" },
  { to: "/schedule", icon: CalendarClock, label: "Schedule" },
  { to: "/insights", icon: Lightbulb, label: "Insights" },
];

export const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors text-muted-foreground"
            activeClassName="text-primary bg-primary/10"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
