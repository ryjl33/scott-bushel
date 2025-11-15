import { useState, useEffect, useCallback } from 'react';
import { DiningHall, getCurrentOccupancy } from '@/services/diningData';
import {
  NotificationPreferences,
  getNotificationPreferences,
  saveNotificationPreferences,
  requestNotificationPermission,
  sendBrowserNotification,
  shouldNotify,
  getNotificationPermissionStatus,
} from '@/services/notificationService';
import { DINING_HALLS } from './useDiningHall';

export function useNotifications() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    getNotificationPreferences()
  );
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    getNotificationPermissionStatus()
  );
  const [lastNotified, setLastNotified] = useState<Record<DiningHall, number>>({
    scott: 0,
    morrill: 0,
    kennedy: 0,
  });

  const updatePreferences = useCallback((newPrefs: NotificationPreferences) => {
    setPreferences(newPrefs);
    saveNotificationPreferences(newPrefs);
  }, []);

  const enableNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(getNotificationPermissionStatus());
    
    if (granted) {
      updatePreferences({ ...preferences, enabled: true });
    }
    
    return granted;
  }, [preferences, updatePreferences]);

  const disableNotifications = useCallback(() => {
    updatePreferences({ ...preferences, enabled: false });
  }, [preferences, updatePreferences]);

  const checkAndNotify = useCallback(() => {
    if (!preferences.enabled || permissionStatus !== 'granted') {
      return;
    }

    const now = Date.now();
    const cooldownPeriod = 30 * 60 * 1000; // 30 minutes

    preferences.selectedHalls.forEach((hall) => {
      // Check if we've notified recently (within cooldown period)
      if (now - lastNotified[hall] < cooldownPeriod) {
        return;
      }

      const occupancy = getCurrentOccupancy(hall);
      
      if (shouldNotify(hall, occupancy.level, preferences)) {
        const hallName = DINING_HALLS[hall];
        sendBrowserNotification(
          `${hallName} is ${occupancy.level}! 🎉`,
          `Current occupancy: ${occupancy.current}/${occupancy.capacity}. Great time to visit!`
        );
        
        setLastNotified((prev) => ({
          ...prev,
          [hall]: now,
        }));
      }
    });
  }, [preferences, permissionStatus, lastNotified]);

  // Check busyness every 2 minutes
  useEffect(() => {
    if (!preferences.enabled) {
      return;
    }

    const interval = setInterval(checkAndNotify, 2 * 60 * 1000);
    
    // Also check immediately
    checkAndNotify();

    return () => clearInterval(interval);
  }, [preferences.enabled, checkAndNotify]);

  return {
    preferences,
    updatePreferences,
    enableNotifications,
    disableNotifications,
    permissionStatus,
  };
}
