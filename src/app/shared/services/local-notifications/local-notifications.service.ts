import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPerformed, LocalNotificationSchema, LocalNotifications, PermissionStatus, Weekday } from '@capacitor/local-notifications';
import { SurveySources } from '../../types/api-types';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  constructor(
    public router: Router,
    public sharedMethods: SharedmethodsService,
    public globalErrorHandler: GlobalErrorHandlerService,
  ) {
    this.scheduleNotifications();
    this.addListeners();
  }

  async requestNotificationPermission() {
    try {
      const hasPermissions = await LocalNotifications.checkPermissions();
      if (hasPermissions.display === 'granted') {
        return true;
      }
  
      const result = await LocalNotifications.requestPermissions();
      if (result.display ) {
        return true;
      }
      return false 
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in local-notifications.service.ts at requestNotificationPermission(). Error requesting notification permissions');
      return false;
    }
  }


  async scheduleNotifications() {
    try {
      const permissionsGranted = await this.requestNotificationPermission();
      if (permissionsGranted) {
        const allNotifications: LocalNotificationSchema[] = [
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
            extra: {
              roles: ['worker']
            }
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
  
        const user = await this.sharedMethods.getUserData();
        const notifications = allNotifications.filter((notif) => notif?.extra?.roles?.includes(user?.role) || !notif.extra?.roles);
      
        await LocalNotifications.schedule({
          notifications: notifications,
        });
      }
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in local-notifications.service.ts at scheduleNotifications(). Failed to schedule local notifications');
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
                this.router.navigate([ 'survey' ], { queryParams: { surveySource: SurveySources.notification }});
              }
              // TO BE REMOVED
              // for testing purposes
              if (notification?.actionTypeId === 'test') {
                this.router.navigate([ 'survey' ], { queryParams: { surveySource: SurveySources.notification }});
              }
              break;
            default:
              break;
          }

        }
      );
    } catch (error) {
      console.error(error);
      this.globalErrorHandler.handleError(error, 'Error in local-notifications.service.ts at addListeners(). Failed to add listeners to local notifications');
    }
  }
}

