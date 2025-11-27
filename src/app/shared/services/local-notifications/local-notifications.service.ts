import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ActionPerformed, LocalNotificationSchema, LocalNotifications, Weekday } from '@capacitor/local-notifications';
import { NotificationActionId, SurveySources, UserRole } from '../../types/api-types';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';
import { AuthService } from '../auth/auth.service';
import { Platform } from '@ionic/angular';
import { App, AppState } from '@capacitor/app';
import { ContentService } from '../content/content.service';
import { NotificationsDataService } from 'src/app/notifications/data/notifications-data.service';

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
    public contentService: ContentService,
    public zone: NgZone,
    public notificationsDataService: NotificationsDataService,
  ) {
    this.platform.ready().then(() => {
      App.addListener('appStateChange', (state: AppState) => {
        this.appActive = state.isActive;
      });
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
      return false;
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in local-notifications.service.ts at requestNotificationPermission(). Error requesting notification permissions'
      );
      return false;
    }
  }


  async scheduleNotifications(commonText) {
    try {
      const permissionsGranted = await this.requestNotificationPermission();
      if (permissionsGranted) {
        // Regular Notifications to run every Thursday & Sunday
        const regularNotifications: LocalNotificationSchema[] = [
          {
            title: commonText?.surveyNotificationTitle,
            body: commonText?.surveyNotificationBody,
            id: 1,
            schedule: {
              repeats: true,
              every: 'two-weeks',
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
          // THURSDAY NOTIFICATION DISABLED FOR NOW
          // {
          //   title: commonText?.surveyNotificationTitle,
          //   body: commonText?.surveyNotificationBody,
          //   id: 2,
          //   schedule: {
          //     repeats: true,
          //     on:
          //       {
          //         weekday: Weekday.Thursday,
          //         hour: 18,
          //         minute: 0,
          //       }
          //     }, // Notification will run every Thursday
          //   actionTypeId: NotificationActionId.survey,
          //   extra: {
          //     roles: [UserRole.worker,]
          //   }
          // },

          // ADD NOTIFICATIONS HERE
          // id should be different for each notification otherwise it will override the previous one
        ];

        const user = await this.sharedMethods.getUserData();
        const userNotifications = regularNotifications.filter((notif) => notif?.extra?.roles?.includes(user?.role) || !notif.extra?.roles);
        const pendingNotifications = await LocalNotifications.getPending();

        if (userNotifications.length > 0) {
          await LocalNotifications.schedule({ notifications: userNotifications});
        } else {
          // cancel any existing notifications
          if (pendingNotifications?.notifications?.length) {
            await LocalNotifications.cancel({ notifications: pendingNotifications?.notifications });
          }
        }


        // Preset Notifications to run every week from the given date within given time frame
        const presetNotifications: LocalNotificationSchema[] = [];
        // TODO: Get preset topics from prismic
        // TODO: make notif frequency dynamic
        const presetTopics = await this.contentService?.getAllCategories();
        const notificationsStartDate = commonText?.notificationsStartDate ? new Date(commonText?.notificationsStartDate) : undefined;
        const notificationsTimeFrame = commonText?.notificationsTimeFrame ? Number(commonText?.notificationsTimeFrame) : undefined;

        if (!notificationsStartDate || !notificationsTimeFrame) {
          return;
        }

        for (let i = 0; i < notificationsTimeFrame; i++) {
          const notificationDate = new Date(notificationsStartDate);
          notificationDate.setDate(notificationDate.getDate() + (i * 7));
          notificationDate.setHours(18, 0, 0, 0);

          const prestNotif = {
            title: commonText?.surveyNotificationTitle,
            body: commonText?.surveyNotificationBody,
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
          let tempNotifs = [];
          if (userNotifications?.length) {
            tempNotifs = userNotifications;
            await LocalNotifications.cancel({ notifications: userNotifications});
          }

          // schedule the preset notificationsconst
          const userPresetNotifications = presetNotifications.filter(
            (notif) => notif?.extra?.roles?.includes(user?.role) || !notif.extra?.roles);
          if (userPresetNotifications.length > 0) {
            await LocalNotifications.schedule({ notifications: userPresetNotifications});
          } else {
            // reschedule pre-existing user notifications
            if (tempNotifs?.length) {
              await LocalNotifications.schedule({ notifications: tempNotifs });
            }
          }
        }

      }
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in local-notifications.service.ts at scheduleNotifications(). Failed to schedule local notifications'
      );
    }
  }

  async triggerTestNotification(commonText) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: commonText?.surveyNotificationTitle,
            body: commonText?.surveyNotificationBody,
            id: 10,
            schedule: {
              at: new Date(Date.now() + 1000),
            },
            actionTypeId: NotificationActionId.survey,
          },
        ],
      });
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in local-notifications.service.ts at triggerNotification(). Failed to trigger local notifications'
      );
    }
  }

  async triggerWagePaymentNotifications(wageNotifications) {
    try {
      if (wageNotifications?.length) {
        for (const wageNotif of wageNotifications) {
          await LocalNotifications.schedule({
            notifications: [
              {
                title: wageNotif?.title,
                body: wageNotif?.message,
                id: Number(wageNotif.id) + 100, // to avoid id clash with other notifications
                schedule: {
                  at: new Date(Date.now() + 1000),
                },
                actionTypeId: NotificationActionId.wagePayment,
                extra: {
                  wageId: wageNotif?.wageId ?? undefined,
                  wageDetails: wageNotif?.wageDetails ?? undefined,
                  notificationDataId: wageNotif?.notificationDataId ?? undefined,
                },
              },
            ],
          });
        }
      }
    } catch (error) {
      this.globalErrorHandler.handleError(
        error,
        'Error in local-notifications.service.ts at triggerWagePaymentNotification(). Failed to trigger wage payment notification'
      );
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
          await this.zone.run(async() => {
            const notification: LocalNotificationSchema = notificationAction?.notification;
            switch (notificationAction?.actionId) {
              case 'tap':
                if (notification?.actionTypeId === NotificationActionId.survey) {
                  if (!this.appActive) {
                    return setTimeout(async() => {
                      await this.router.navigate([ 'survey' ], { queryParams: { surveySource: SurveySources.notification }});
                      return false;
                    }, 700);
                  }
                  this.router.navigate([ 'survey' ], { queryParams: { surveySource: SurveySources.notification }});
                }
                // TO BE REMOVED
                // for testing purposes
                else if (notification?.actionTypeId === NotificationActionId.test) {
                  this.router.navigate([ 'survey' ], { queryParams: { surveySource: SurveySources.notification }});
                }
                else if (notification?.actionTypeId === NotificationActionId.wagePayment) {
                  if (notification?.extra?.wageId) {
                    const queryParams = { wageDetails: JSON.stringify(notification.extra.wageDetails) };
                    this.router.navigate([ 'wages/wage-details' ], { queryParams });
                    break;
                  }
                  this.router.navigate([ 'wages' ]);
                }
                break;
              default:
                break;
            }
          });
        }
      );
    } catch (error) {
      console.error(error);
      this.globalErrorHandler.handleError(
        error,
        'Error in local-notifications.service.ts at addListeners(). Failed to add listeners to local notifications'
      );
    }
  }
}

