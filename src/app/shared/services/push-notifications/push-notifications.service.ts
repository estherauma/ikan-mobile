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
    ) { }

  async setup() {
    const permissionStatus = await PushNotifications.requestPermissions();
    if (permissionStatus?.receive !== 'granted') {
      this.notificationsPermission = false;
      return;
    }
    await this.getFCMToken();
    await this.setPushNotificationData();
    await PushNotifications.register();
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
    if (!this.pushNotificationData || !this.pushNotificationData.registrationToken) {
      return;
    }
    await Preferences.set({
      key: StorageKeys.pushNotificationData,
      value: JSON.stringify(this.pushNotificationData),
    });
  }

  async uploadPushNotificationData() {
    const pushNotificationData = await this.getPushNotificationData();
    if (!pushNotificationData) {
      return;
    }
    await this.apiService.uploadPushNotificationData(pushNotificationData);
  }

  addListeners() {
    try {
      PushNotifications.addListener('registration', (token: Token) => {
        this.getFCMToken();
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
        (actionData: ActionPerformed) => {
          const notification: PushNotificationSchema = actionData?.notification;
          switch (actionData?.actionId) {
            case 'tap':
              if (notification?.data?.type === 'message') {
                this.router.navigate([ '/tabs/messages' ]);
              }
              break;

            default:
              break;
          }
        },
      );
    } catch (error) {
      console.error(error);
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
            console.error('Could not get user data for push notifications.');
          }
        }
      }
    } catch (error) {
      console.error(error);
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
      console.error(error);
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

          const savedNotificationData = await this.getPushNotificationData();
          if (!savedNotificationData) {
            this.setSaveUploadPushNotificationData();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  deleteFCMInstance() {
    if (this.notificationsPermission) {
      FCM.deleteInstance()
        .then(() => true)
        .catch((err) => {
          console.error(err);
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
      return;
    }
  }

  async showPNsPrompt() {
    const alertProps = {
      cssClass: 'workflow-alert',
      message: this.contentService.commonText?.promptPushNotification, // TODO: add to prismic
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
      console.error(error);
    }
  }
}
