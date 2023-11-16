import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPerformed, LocalNotificationSchema, LocalNotifications, PermissionStatus, Weekday } from '@capacitor/local-notifications';
import { SurveyModes } from '../../types/api-types';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  constructor(
    public router: Router,
  ) {
    this.scheduleNotifications();
    this.addListeners();
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
          title: 'Survey',
          body: 'A quick survey checking on you',
          id: 1,
          schedule: {
            repeats: true,
            on:
              {
                weekday: Weekday.Sunday,
                hour: 18,
                minute: 0,
              }
            }, // Notification will run every Sunday
          actionTypeId: 'survey',
          
        },
        // TO BE REMOVED
        // Testing purposes
        // Uncomment the code block below (& in addListeners()) to run the notification every minute
        // {
        //   title: 'Another Test Notification',
        //   body: 'This is another test notification.',
        //   id: 2,
        //   schedule: { 
        //     at: new Date(Date.now() + 1000), 
        //     repeats: true,
        //     every: "minute" //runs every minute
        //   },
        //   actionTypeId: 'test',
        // },

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
        (notificationAction: ActionPerformed) => {
          const notification: LocalNotificationSchema = notificationAction?.notification;
          switch (notificationAction?.actionId) {
            case 'tap':
              if (notification?.actionTypeId === 'survey') {
                this.router.navigate([ 'survey' ], { queryParams: { mode: SurveyModes.notification }});
              }
              // TO BE REMOVED
              // for testing purposes
              if (notification?.actionTypeId === 'test') {
                this.router.navigate([ 'survey' ], { queryParams: { mode: SurveyModes.notification }});
              }
              break;
            default:
              break;
          }

        }
      );



    } catch (error) {
      console.error(error);
    }
  }
}

