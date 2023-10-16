import { Injectable } from '@angular/core';
import { ActionPerformed, LocalNotificationSchema, LocalNotifications, PermissionStatus, Weekday } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  constructor() {
    this.scheduleNotifications();
  }

  async requestNotificationPermission() {
    const hasPermissions = await LocalNotifications.checkPermissions();
    if (hasPermissions.display === 'granted') {
      return true;
    }

    const result = await LocalNotifications.requestPermissions();
    if (result.display ) {
      return true;
    }
    return false
  }


  async scheduleNotifications() {
    const permissionsGranted = await this.requestNotificationPermission();
    if (permissionsGranted) {
      const notifications: LocalNotificationSchema[] = [
        {
          title: 'Test Notification',
          body: 'This is a test notification.',
          id: 1,
          schedule: { on: { weekday: Weekday.Monday, } }, // Notification will run every Monday
        },
        {
          title: 'Another Notification',
          body: 'This is another test notification.',
          id: 1,
          schedule: { 
            at: new Date(Date.now() + 1000), 
            repeats: true,
            every: "minute" //runs every minute
          } 
        },
        // ADD NOTIFICATIONS HERE
      ];
    
      await LocalNotifications.schedule({
        notifications: notifications,
      });
    }
  }

  addListeners() {
    try {
      LocalNotifications.addListener(
        'localNotificationReceived',
        (notification: LocalNotificationSchema) => {}
      );
      
      LocalNotifications.addListener(
        'localNotificationActionPerformed',
        (notificationAction: ActionPerformed) => {}
      );



    } catch (error) {
      console.error(error);
    }
  }
}

