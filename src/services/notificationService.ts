import { DiningHall } from './diningData';

export interface NotificationPreferences {
  enabled: boolean;
  selectedHalls: DiningHall[];
  notifyOnLevel: 'low' | 'moderate';
}

const STORAGE_KEY = 'dining_notification_prefs';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function getNotificationPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function getNotificationPreferences(): NotificationPreferences {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    enabled: false,
    selectedHalls: [],
    notifyOnLevel: 'moderate',
  };
}

export function sendBrowserNotification(
  title: string,
  body: string,
  icon?: string
): void {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'dining-busyness',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  }
}

export function shouldNotify(
  hall: DiningHall,
  currentLevel: string,
  prefs: NotificationPreferences
): boolean {
  if (!prefs.enabled || !prefs.selectedHalls.includes(hall)) {
    return false;
  }

  // Notify if busyness is at or below the threshold
  if (prefs.notifyOnLevel === 'moderate') {
    return currentLevel === 'low' || currentLevel === 'moderate';
  } else {
    return currentLevel === 'low';
  }
}
