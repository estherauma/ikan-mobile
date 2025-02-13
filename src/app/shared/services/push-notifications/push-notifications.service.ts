import {
  StorageKeys,
  PushNotificationData,
  UserData,
} from 'src/app/shared/types/api-types';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { FCM } from '@capacitor-community/fcm';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { Preferences } from '@capacitor/preferences';
import { SharedmethodsService } from '../sharedmethods/sharedmethods.service';
import { NativeSettings, AndroidSettings } from 'capacitor-native-settings';
import { ContentService } from '../content/content.service';
import { GlobalErrorHandlerService } from '../error-handler/global-error-handler.service';

@Injectable({
  providedIn: 'root'
})

export class PushNotificationsService {
  public pushNotificationData: PushNotificationData;
  public notificationsPermission = false;
  public registrationToken = '';
  public preventSecondNotificationPrompt = false;

  constructor(
    private router: Router,
    public apiService: ApiService,
    public alertController: AlertController,
    public sharedmethods: SharedmethodsService,
    public contentService: ContentService,
    public globalErrorHandler: GlobalErrorHandlerService,
  ) { }

  async setup() {
    const permissionStatus = await PushNotifications.requestPermissions();
    if (permissionStatus?.receive !== 'granted') {
      this.notificationsPermission = false;
      return;
    }
    await PushNotifications.register();
    await this.getFCMToken(); // bit of duplication here since function is called after registration event, but neede for when listener is not triggered
    this.addListeners();
    this.notificationsPermission = true;
  }

  async setPushNotificationData() {
    const user: UserData = await this.sharedmethods.readDataFromStorage(StorageKeys.userData);
    // TODO: add logic for all users
    if (!user || !this.registrationToken) {
      return;
    }
    const messagingRepos = [ 'tuna-messaging' ];
    // TODO: add logic for all users, language and locale
    this.pushNotificationData = {
      appId: 'tuna',
      userRole: user?.role,
      registrationToken: this.registrationToken,
      messagingRepos,
    };
  }

  async getPushNotificationData() {
    const pushNotificationData = await Preferences.get({ key: StorageKeys.pushNotificationData });
    if (!pushNotificationData?.value) {
      return null;
    }
    this.pushNotificationData = JSON.parse(pushNotificationData.value);
    return JSON.parse(pushNotificationData.value);
  }

  async savePushNotificationData() {
    try {
      if (!this.pushNotificationData || !this.pushNotificationData.registrationToken) {
        return;
      }
      await Preferences.set({
        key: StorageKeys.pushNotificationData,
        value: JSON.stringify(this.pushNotificationData),
      });
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in push-notifications.service.ts at savePushNotificationData(). Failed to save push notification data');
    }
  }

  async uploadPushNotificationData() {
    try {
      const pushNotificationData = await this.getPushNotificationData();
      if (!pushNotificationData) {
        return;
      }
      await this.apiService.uploadPushNotificationData(pushNotificationData);
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in push-notifications.service.ts at uploadPushNotificationData(). Failed to upload push notification data');
    }
  }

  addListeners() {
    try {
      PushNotifications.addListener('registration', async(token: Token) => {
        await this.getFCMToken();
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error(error);
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {},
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        async(actionData: ActionPerformed) => {
          const notification: PushNotificationSchema = actionData?.notification;
          switch (actionData?.actionId) {
            case 'tap':
              if (notification?.data?.type === 'message') {
                await this.router.navigate([ '/tabs/messages' ]);
              }
              break;

            default:
              break;
          }
        },
      );
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in push-notifications.service.ts at addListeners(). Failed to add listeners to push notifications');
    }
  }

  // TODO: add topic subscription logic
  async subscribeMessagingTopics() {
    try {
      if (this.notificationsPermission) {
        const subscriptionTopics = [];
        const messegingRepos = [ 'tuna-messaging' ];
        const user: UserData = await this.sharedmethods.readDataFromStorage(StorageKeys.userData);
        if (messegingRepos) {
          // TODO: add logic for all users, language and locale
          if (user) {
            for (const repo of messegingRepos) {
              subscriptionTopics.push(...[
                // add role topic
                user?.role,
              ]);
            }
            if (subscriptionTopics) {
              if (await this.subscribeToTopics(subscriptionTopics)) {
                this.sharedmethods.saveDataToStorage(StorageKeys.pushNotificationTopics, subscriptionTopics);
              }
            }
          } else {
            console.log('Could not get user data for push notifications.');
          }
        }
      }
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in push-notifications.service.ts at subscribeMessagingTopics(). Failed to subscribe to messaging topics');
    }
  }

  async subscribeToTopics(subscriptionTopics: Array<string>) {
    if (!subscriptionTopics) {
      return false;
    }
    for (const topic of subscriptionTopics) {
      await FCM.subscribeTo({ topic })
        .catch((err) => console.error(err));
    }
    return true;
  }

  async unsubscribeMessagingTopics() {
    try {
      if (this.notificationsPermission) {
        const subscriptionTopics = await this.sharedmethods.readDataFromStorage(StorageKeys.pushNotificationTopics);
        if (subscriptionTopics) {
          if (await this.unsubscribeFromTopics(subscriptionTopics)) {
            this.sharedmethods.saveDataToStorage(StorageKeys.pushNotificationTopics, []);
          }
        }
      }
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in push-notifications.service.ts at unsubscribeMessagingTopics(). Failed to unsubscribe from messaging topics');
    }
  }

  async unsubscribeFromTopics(subscriptionTopics: Array<string>) {
    if (!subscriptionTopics) {
      return false;
    }
    for (const topic of subscriptionTopics) {
      await FCM.unsubscribeFrom({ topic })
        .catch((err) => console.error(err));
    }
    return true;
  }

  async getFCMToken() {
    if (this.notificationsPermission) {
      await FCM.getToken()
        .then(async(r) => {
          this.registrationToken = r.token;

          // check if token is expired if we have previously saved data
          const savedNotificationData = await this.getPushNotificationData();
          const isTokenExpired = await this.checkFCMTokenExpiry(r.token);
          if (savedNotificationData && isTokenExpired) {
            // update old data, set token expiry to true. This will help us identify duplicate users
            const dataToUpdate = { ...savedNotificationData, tokenExpired: true };
            this.apiService.uploadPushNotificationData(dataToUpdate);
          }
          
          // update preferences regardless since other data might have changed not just the token
          this.setSaveUploadPushNotificationData();
        })
        .catch((err) => {
          this.globalErrorHandler.handleError(err, 'Error in push-notifications.service.ts at getFCMToken(). Failed to get FCM token');
        });
    }
  }

  async checkFCMTokenExpiry(currentToken: string) {
    try {
      const storedPushNotificationData = await this.getPushNotificationData();
      if (!storedPushNotificationData) {
        return false;
      }
      if (storedPushNotificationData.registrationToken === currentToken) {
        return false;
      }
      return true;
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in push-notifications.service.ts at checkFCMTokenExpiry(). Failed to check FCM token expiry');
      return false;
    }
  }

  deleteFCMInstance() {
    if (this.notificationsPermission) {
      FCM.deleteInstance()
        .then(() => true)
        .catch((err) => {
          this.globalErrorHandler.handleError(err, 'Error in push-notifications.service.ts at deleteFCMInstance(). Failed to delete FCM instance');
          return false;
        });
    }
  }

  removeSpaces(value: string) {
    return value.split(' ').join('-');
  }

  async setSaveUploadPushNotificationData() {
    await this.setPushNotificationData();
    await this.savePushNotificationData();
    await this.uploadPushNotificationData();
  }

  async checkAndroidPNsPermissions() {
    try {
      this.preventSecondNotificationPrompt = true;
      const showPNsPermissionsPrompt = await this.sharedmethods.readDataFromStorage(StorageKeys.showPNsPermissionsPrompt);
      if (showPNsPermissionsPrompt !== null) {
        return;
      }
      const isAndroidVersionAbove = await this.sharedmethods.isAndroidVersionAbove(12);
      if (!isAndroidVersionAbove) {
        return;
      }
      await this.showPNsPrompt();
    } catch (error) {
      console.error(error);
      this.globalErrorHandler.handleError(error, 'Error in push-notifications.service.ts at checkAndroidPNsPermissions(). Failed to check android push notification permissions');
      return;
    }
  }

  async showPNsPrompt() {
    const alertProps = {
      cssClass: 'workflow-alert',
      message: this.contentService.commonText?.promptPushNotification,
      backdropDismiss: false,
      buttons: [
        {
          text: this.contentService.commonText?.cancel,
          handler: () => {
            this.sharedmethods.saveDataToStorage(StorageKeys.showPNsPermissionsPrompt, '0');
          }
        },
        {
          text: this.contentService.commonText?.ok,
          handler: async() => {
            await this.sharedmethods.saveDataToStorage(StorageKeys.showPNsPermissionsPrompt, '1');
            this.showAppNotificationSettings();
          }
        }
      ]
    };
    const alert = await this.alertController.create(alertProps);
    await alert.present();
  }

  showAppNotificationSettings() {
    try {
      NativeSettings.openAndroid({
        option: AndroidSettings.AppNotification,
      });
    } catch (error) {
      this.globalErrorHandler.handleError(error, 'Error in push-notifications.service.ts at showAppNotificationSettings(). Failed to show app notification settings');
    }
  }
}
