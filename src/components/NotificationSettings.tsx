import { Bell, BellOff, BellRing } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { DiningHall } from "@/services/diningData";
import { DINING_HALLS } from "@/hooks/useDiningHall";
import { sendBrowserNotification } from "@/services/notificationService";
import { useToast } from "@/hooks/use-toast";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const {
    preferences,
    updatePreferences,
    enableNotifications,
    disableNotifications,
    permissionStatus,
  } = useNotifications();

  const handleEnableClick = async () => {
    if (preferences.enabled) {
      disableNotifications();
      toast({
        title: "Notifications disabled",
        description: "You won't receive any dining alerts",
      });
    } else {
      const granted = await enableNotifications();
      if (granted) {
        toast({
          title: "Notifications enabled! 🎉",
          description: "You'll be notified when dining halls are less busy",
        });
      } else {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your browser settings",
          variant: "destructive",
        });
      }
    }
  };

  const sendTestNotification = () => {
    sendBrowserNotification(
      "Test Notification 🎉",
      "If you see this, your notifications are working perfectly!"
    );
    toast({
      title: "Test notification sent",
      description: "Check if you received it!",
    });
  };

  const toggleHall = (hall: DiningHall) => {
    const newHalls = preferences.selectedHalls.includes(hall)
      ? preferences.selectedHalls.filter((h) => h !== hall)
      : [...preferences.selectedHalls, hall];
    
    updatePreferences({
      ...preferences,
      selectedHalls: newHalls,
    });
  };

  const setNotifyLevel = (level: 'low' | 'moderate') => {
    updatePreferences({
      ...preferences,
      notifyOnLevel: level,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified when dining halls aren't busy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive alerts about low busyness
            </p>
          </div>
          <Switch
            checked={preferences.enabled}
            onCheckedChange={handleEnableClick}
            disabled={permissionStatus === 'denied'}
          />
        </div>

        {permissionStatus === 'denied' && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}

        {preferences.enabled && (
          <>
            {/* Select Dining Halls */}
            <div className="space-y-3">
              <Label className="text-base">Monitor These Halls</Label>
              <div className="grid gap-2">
                {(Object.entries(DINING_HALLS) as [DiningHall, string][]).map(([key, name]) => (
                  <button
                    key={key}
                    onClick={() => toggleHall(key)}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      preferences.selectedHalls.includes(key)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium">{name}</span>
                    {preferences.selectedHalls.includes(key) && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Threshold */}
            <div className="space-y-3">
              <Label className="text-base">Notify When</Label>
              <div className="grid gap-2">
                <button
                  onClick={() => setNotifyLevel('moderate')}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    preferences.notifyOnLevel === 'moderate'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">Low or Moderate</div>
                    <div className="text-xs text-muted-foreground">
                      More frequent notifications
                    </div>
                  </div>
                  {preferences.notifyOnLevel === 'moderate' && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </button>
                <button
                  onClick={() => setNotifyLevel('low')}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    preferences.notifyOnLevel === 'low'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">Only Low</div>
                    <div className="text-xs text-muted-foreground">
                      Less frequent, only when very quiet
                    </div>
                  </div>
                  {preferences.notifyOnLevel === 'low' && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </button>
              </div>
            </div>

            {preferences.selectedHalls.length === 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Select at least one dining hall to receive notifications.
                </p>
              </div>
            )}

            {/* Test Notification */}
            {preferences.selectedHalls.length > 0 && (
              <Button
                onClick={sendTestNotification}
                variant="outline"
                className="w-full gap-2"
              >
                <BellRing className="w-4 h-4" />
                Send Test Notification
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
