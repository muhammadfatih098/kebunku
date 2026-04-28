import { Injectable } from '@angular/core';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  async requestPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;

    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  }

  async scheduleDailyWateringNotification() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Notification skipped — web platform');
      return;
    }

    try {
      const granted = await this.requestPermissions();
      if (!granted) return;

      // Cancel any existing notifications first
      await LocalNotifications.cancel({
        notifications: [{ id: 1001 }]
      });

      const now = new Date();
      const notifTime = new Date();
      notifTime.setHours(8, 0, 0, 0);

      // If 8 AM already passed today, schedule for tomorrow
      if (now >= notifTime) {
        notifTime.setDate(notifTime.getDate() + 1);
      }

      const options: ScheduleOptions = {
        notifications: [
          {
            id: 1001,
            title: '🌿 Kebunku',
            body: 'Jangan lupa siram tanaman hari ini!',
            schedule: {
              at: notifTime,
              repeats: true,
              every: 'day'
            },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null,
            smallIcon: 'ic_notification',
            largeIcon: 'ic_launcher',
            iconColor: '#1C5C2E'
          }
        ]
      };

      await LocalNotifications.schedule(options);
      console.log('Daily watering notification scheduled at 08:00');
    } catch (err) {
      console.error('Failed to schedule notification:', err);
    }
  }

  async cancelAll() {
    if (!Capacitor.isNativePlatform()) return;
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  }
}
