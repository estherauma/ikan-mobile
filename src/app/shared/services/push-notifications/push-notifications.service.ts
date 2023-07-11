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
    // public persistentData: PersistentDataService,
    public contentService: ContentService,
    ) { }

  async setup() {
    await this.getFCMToken();
    await this.setPushNotificationData();
    const permissionStatus = await PushNotifications.requestPermissions();

    if (permissionStatus?.receive !== 'granted') {
      this.notificationsPermission = false;
      return;
    }
    await PushNotifications.register();
    this.addListeners();
    this.notificationsPermission = true;
  }

  async setPushNotificationData() {
    const user: UserData = await this.sharedmethods.readDataFromStorage(StorageKeys.userData);
    // TODO: add logic for all users
    if (!user) {
      return;
    }
    const messagingRepos = [ 'tuna-messaging' ]; // await this.persistentData.getMessagesDomains() || [];
    this.pushNotificationData = {
      appId: 'tuna',
      // language: persistentData?.language, // to be added
      // destination: persistentData?.destination,
      // locale: persistentData?.locale, // to be added
      userRole: user?.role,
      // age: persistentData?.age,
      // sectors: persistentData?.sectors,
      // gender: persistentData?.gender,
      // organisation: persistentData?.organisation,
      // factoryFarm: persistentData?.factoryFarm,
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
    if (!this.pushNotificationData) {
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

  async subscribeMessagingTopics() {
    try {
      if (this.notificationsPermission) {
        const subscriptionTopics = [];
        const messegingRepos = [ 'tuna-messaging' ]; // await this.persistentData.getMessagesDomains();
        const user: UserData = await this.sharedmethods.readDataFromStorage(StorageKeys.userData);
        if (messegingRepos) {
          // TODO: add logic for all users, language and locale
          if (user) {
            // const { destination, locale, language } = persistentData;
            for (const repo of messegingRepos) {
              subscriptionTopics.push(...[
                // add role topic
                `${repo}_All_All_${user?.role}`,
                // `${repo}_All_All_${language}`,
                // `${repo}_${this.removeSpaces(destination)}_${this.removeSpaces(locale)}_${language}`,
                // `${repo}_${this.removeSpaces(destination)}_All_${language}`,
                // `${repo}_All_${this.removeSpaces(locale)}_${language}`
              ]);
            }
            if (subscriptionTopics) {
              if (await this.subscribeToTopics(subscriptionTopics)) {
                this.sharedmethods.saveDataToStorage(StorageKeys.pushNotificationTopics, subscriptionTopics);
              }
            }
          } else {
            console.error('Could not get persistentData for push notifications.');
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
        .then((r) => this.registrationToken = r.token)
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
      message: this.contentService.commonText?.promptPushNotification, // add to prismic
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
