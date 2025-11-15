import { Home, CalendarClock, Lightbulb, UtensilsCrossed, LogOut } from "lucide-react";
import { NavLink } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const Navigation = () => {
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        <NavLink
          to="/"
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors text-muted-foreground"
          activeClassName="text-primary bg-primary/10"
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Live</span>
        </NavLink>
        <NavLink
          to="/schedule"
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors text-muted-foreground"
          activeClassName="text-primary bg-primary/10"
        >
          <CalendarClock className="w-5 h-5" />
          <span className="text-xs font-medium">Schedule</span>
        </NavLink>
        <NavLink
          to="/insights"
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors text-muted-foreground"
          activeClassName="text-primary bg-primary/10"
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-xs font-medium">Insights</span>
        </NavLink>
        <NavLink
          to="/menu"
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors text-muted-foreground"
          activeClassName="text-primary bg-primary/10"
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-xs font-medium">Menu</span>
        </NavLink>
        {(user || isGuest) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center gap-1 h-auto py-2 px-3"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-medium">{isGuest ? 'Exit' : 'Sign Out'}</span>
          </Button>
        )}
      </div>
    </nav>
  );
};
