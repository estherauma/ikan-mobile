import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPerformed, LocalNotificationSchema, LocalNotifications, Weekday } from '@capacitor/local-notifications';
import { SurveySources } from '../../types/api-types';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';
import { env } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Platform } from '@ionic/angular';
import { App, AppState } from '@capacitor/app';
import { Plugins, } from '@capacitor/core';
const coreApp = Plugins.App;

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  appActive = false;

  constructor(
    public router: Router,
    public sharedMethods: SharedmethodsService,
    public globalErrorHandler: GlobalErrorHandlerService,
    public platform: Platform,
    public authService: AuthService,
  ) {

    this.platform.ready().then(() => {
      App.addListener('appStateChange', (state: AppState) => {
        this.appActive = state.isActive;
      });

    this.scheduleNotifications();
    this.addListeners();
  
    });
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
      const isProduction = env.production;
      const permissionsGranted = await this.requestNotificationPermission();
      if (permissionsGranted) {
        const allNotifications: LocalNotificationSchema[] = [
          {
            // TODO: add to prismic
            title: 'Survey' + (isProduction ? '' : ' (Development)'),
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
              roles: ['worker',]
            }
          },

          // FOR TEST PURPOSES
          // {
          //     title: 'Test Notification' + (isProduction ? '' : ' (Development)'),
          //     body: 'This is a test notification.',
          //     id: 2,
          //     schedule: { 
          //       at: new Date(Date.now() + 1000), 
          //       repeats: true,
          //       every: "minute", //runs every minute
          //     },
          //     actionTypeId: 'survey',
          //   },

          // TO BE REMOVED
          // Testing purposes
          // Uncomment the code block below (& in addListeners()) to run the notification every minute
          // {
          //   title: 'Another Test Notification' + (isProduction ? '' : ' (Development)'),
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
      
        if (notifications.length > 0) {
          await LocalNotifications.schedule({
            notifications: notifications,
          });
        }
      }
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in local-notifications.service.ts at scheduleNotifications(). Failed to schedule local notifications');
    }
  }

  async triggerTestNotification() {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Survey - This is a test notification',
            body: 'A quick survey checking on you',
            id: 10,
            schedule: { 
              at: new Date(Date.now() + 1000), 
            },
            actionTypeId: 'survey',
          },
        ],
      });
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in local-notifications.service.ts at triggerNotification(). Failed to trigger local notifications');
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
        async(notificationAction: ActionPerformed) => {
          const notification: LocalNotificationSchema = notificationAction?.notification;
          switch (notificationAction?.actionId) {
            case 'tap':
              if (notification?.actionTypeId === 'survey') {
                if (!this.appActive) {
                  return setTimeout(async() => {
                    await this.router.navigate([ 'survey' ], { queryParams: { surveySource: SurveySources.notification }});
                  }, 700);
                }
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

