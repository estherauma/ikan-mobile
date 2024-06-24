import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPerformed, LocalNotificationSchema, LocalNotifications, Weekday } from '@capacitor/local-notifications';
import { NotificationActionId, SurveySources, UserRole } from '../../types/api-types';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';
import { env } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Platform } from '@ionic/angular';
import { App, AppState } from '@capacitor/app';
import { Plugins, } from '@capacitor/core';
import { ContentService } from '../content/content.service';
const coreApp = Plugins.App;

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  appActive = false;
  commonText: any;

  constructor(
    public router: Router,
    public sharedMethods: SharedmethodsService,
    public globalErrorHandler: GlobalErrorHandlerService,
    public platform: Platform,
    public authService: AuthService,
    public contentService: ContentService,
  ) {
    this.commonText = this.contentService?.commonText;
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
      const permissionsGranted = await this.requestNotificationPermission();
      if (permissionsGranted) {
        // Regular Notifications to run every Sunday
        const regularNotifications: LocalNotificationSchema[] = [
          {
            title: this.commonText?.surveyNotificationTitle || 'Survey',
            body: this.commonText?.surveyNotificationBody || 'A quick survey checking on you',
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
            actionTypeId: NotificationActionId.survey,
            extra: {
              roles: [UserRole.worker,]
            }
          },
  
          // ADD NOTIFICATIONS HERE
        ];
  
        const user = await this.sharedMethods.getUserData();
        const userNotifications = regularNotifications.filter((notif) => notif?.extra?.roles?.includes(user?.role) || !notif.extra?.roles);
      
        if (userNotifications.length > 0) {
          await LocalNotifications.schedule({ notifications: userNotifications});
        } else {
          // cancel any existing notifications
          await LocalNotifications.cancel({ notifications: userNotifications });
        }


        // Preset Notifications to run every week from the given date within given time frame
        let presetNotifications: LocalNotificationSchema[] = [];
        const presetTopics = await this.contentService?.getAllCategories();
        const notificationsStartDate = this.commonText?.notificationsStartDate ? new Date(this.commonText?.notificationsStartDate) : undefined;
        const notificationsTimeFrame = this.commonText?.notificationsTimeFrame ? Number(this.commonText?.notificationsTimeFrame) : undefined;

        if (!notificationsStartDate || !notificationsTimeFrame) {
          return;
        }

        for (let i = 0; i < notificationsTimeFrame; i++) {
          const notificationDate = new Date(notificationsStartDate);
          notificationDate.setDate(notificationDate.getDate() + (i * 7));
          notificationDate.setHours(18, 0, 0, 0);

          const prestNotif = {
            title: 'Survey',
            body: 'A quick survey checking on you',
            id: i + 1,
            schedule: { 
              at: notificationDate, 
            },
            actionTypeId: NotificationActionId.survey,
            extra: {
              roles: [UserRole.worker,],
              topic: presetTopics?.[i] || ''
            }
          };
          presetNotifications.push(prestNotif);
        }

        const currentDate = new Date();
        const dateInRange = this.sharedMethods.isDateWithinTimeFrame(currentDate, notificationsTimeFrame, notificationsStartDate);
        if (dateInRange) {
          // cancel existing regular notifications so that they's no clash
          await LocalNotifications.cancel({ notifications: userNotifications});
          
          // schedule the preset notificationsconst
          const userPresetNotifications = presetNotifications.filter((notif) => notif?.extra?.roles?.includes(user?.role) || !notif.extra?.roles);
          if (userPresetNotifications.length > 0) {
            await LocalNotifications.schedule({ notifications: userPresetNotifications});
          } else {
            // cancel any existing notifications
            await LocalNotifications.cancel({ notifications: userPresetNotifications });
          }
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
            actionTypeId: NotificationActionId.survey,
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
              if (notification?.actionTypeId === NotificationActionId.survey) {
                if (!this.appActive) {
                  return setTimeout(async() => {
                    await this.router.navigate([ 'survey' ], { queryParams: { surveySource: SurveySources.notification }});
                  }, 700);
                }
                this.router.navigate([ 'survey' ], { queryParams: { surveySource: SurveySources.notification }});
              }
              // TO BE REMOVED
              // for testing purposes
              if (notification?.actionTypeId === NotificationActionId.test) {
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

