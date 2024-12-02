import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { ContentService } from './shared/services/content/content.service';
import { SharedmethodsService } from './shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, SurveySources, UserData } from './shared/types/api-types';
import { PluginListenerHandle } from '@capacitor/core';
import { AuthService } from './shared/services/auth/auth.service';
import { DBService } from './shared/services/database/db.service';
import { PushNotificationsService } from './shared/services/push-notifications/push-notifications.service';
import { LocalNotificationsService } from './shared/services/local-notifications/local-notifications.service';
import { Subscription } from 'rxjs';
import { SyncService } from './shared/services/sync/sync.service';
import { TrainingVideoComponent } from './learninghub/training-video/training-video.component';
import { AlertController, IonicSafeString, ModalController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';
import { LocalNotifications  } from '@capacitor/local-notifications';
import { ApiService } from './shared/services/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [];
  networkListener: PluginListenerHandle;
  userData: UserData;
  userEmail: string;
  appSetupComplete = false;
  watchContent: Subscription;
  commonText: any;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public authService: AuthService,
    public dbService: DBService,
    public pushNotifications: PushNotificationsService,
    public localNotifications: LocalNotificationsService,
    public syncService: SyncService,
    public modalController: ModalController,
    public platform: Platform,
    public location: Location,
    public alertController: AlertController,
    public apiService: ApiService,
  ) {
    this.authService.setUpAuthData();
    this.checkLoginStatus();
    this.pushNotifications.setup();
    this.contentService.menuContent.subscribe((data) => {
      this.setupMenu(data);
    });
    this.contentService.watchContent().subscribe(async(resp) => {
      if (resp) {
        this.checkSetupComplete();
        this.contentService.saveSurveyCategories();
        await this.contentService.updateAllContent();
      }
    });
    this.authService.currentUser.subscribe((data) => {
      if (data && Object.keys(data).length > 0) {
        this.userData = data;
        this.userEmail = data.email;
      }
    });
    this.setupDB();
  }

  async ngOnInit() {
    const showStatusBar = async() => {
      await StatusBar.show();
    };
    this.handleBackButtonNavigation();
    await this.sharedMethods.addNetworkEventListener((async(network) => {
      this.networkListener = network.networkListener;
      if (network.connected) {
        await this.contentService.compareContent();
        this.checkSetupComplete();
      }
    }));
    await this.contentService.setUpAppData().then(() => {
      this.checkSetupComplete();
      this.commonText = this.contentService.commonText;
      this.localNotifications.scheduleNotifications(this.commonText);
    });
    this.userData = this.authService.userData;
    this.userEmail = this.authService.userData?.email;
    await this.contentService.saveSurveyCategories();
  }

  setupMenu(menuData) {
    if (menuData && Object.keys(menuData).length > 0) {
      menuData?.sort((a, b) => a.position - b.position);

      // identify last item in a menu section
      menuData.forEach((el, index) => {
        if (index === menuData.length - 1 ) {
          el.last = false
        } else {
          const nextItem = menuData[index + 1]
          const nextSection = nextItem?.position - nextItem?.position % 100;
          const currentSection = el.position - el.position % 100;
          if (currentSection !== nextSection) {
            el.last = true;
          } else {
            el.last = false;
          }
        }
        
        if (el.url === '/delete-account') {
          el.isDeleteAccount = true;
        }
      });

      this.appPages = this.authService.alterMenuBasedOnRole(menuData);
    }
  }

  checkSetupComplete() {
    const appContent = this.contentService.appContent;
    if (appContent) {
      this.appSetupComplete = true;
    }
  }

  ngOnDestroy() {
    this.sharedMethods.removeNetworkEventListener(this.networkListener);
  }

  async checkLoginStatus() {
    await this.sharedMethods.readDataFromStorage(StorageKeys.apiToken)
      .then(async(value) => {
        if (value) {
          const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
          const now = new Date().toUTCString();
          if ( this.authService.tokenExpiryDate < new Date(now)) {
            this.logOut();
          } else {
            await this.pushNotifications.setSaveUploadPushNotificationData();
            // TODO: Service isn't returning role and is returning
            // Ensure auth service returns role immediately

            const isRoleSet = await this.sharedMethods.readDataFromStorage(StorageKeys.isRoleSet);
            if (user?.roles?.length > 1 && !isRoleSet) {
              return this.router.navigate(['/select-role']);
            }
           
            this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(user?.role)]);
          }
        }
      });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  async logOutWithExpiredToken(tokenExpiryDateInUTCSeconds) {
    const now = new Date().toUTCString();
    const tokenExpiryDateTime = new Date(0);
    tokenExpiryDateTime.setUTCSeconds(tokenExpiryDateInUTCSeconds);
    if (tokenExpiryDateTime < new Date(now)) {
      this.logOut();
      this.sharedMethods.showLoader(this.contentService.commonText?.loginToProceed);
    }
  }

  async onClick(index) {
    if (this.appPages[index].url === '/logout') {
      await LocalNotifications.removeAllListeners();
      this.authService.logOut();
      this.router.navigate(['']);
    } else if(this.appPages[index].url === '/sync') {
      await this.sharedMethods.showToast(this.contentService.commonText?.syncingData || 'Syncing data...', 'long');
      this.syncService.syncData();
    } else if (this.appPages[index].url === '/tfa-video') {
      await this.showTrainingVideo();
    } else if (this.appPages[index].url === '/myprofile') {
      const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
      this.router.navigate([ this.sharedMethods.getProfileUrlBasedOnRole(user?.role) ]);
    } else if (this.appPages[index].url === '/survey') {
      this.router.navigate([this.appPages[index].url], { queryParams: { surveySource: SurveySources.fromMenu } });
    } else if (this.appPages[index].url === '/delete-account') {
      await this.deleteAccount();
    } else {
      this.router.navigate([this.appPages[index].url]);
    }
  }

  async showTrainingVideo() {
    const modal = await this.modalController.create({
      component: TrainingVideoComponent,
      cssClass: 'tfa-training-video',
      backdropDismiss: true,
    });
    modal.present();
  }

  async deleteAccount() {
    const hasInternet = await this.sharedMethods.checkInternetConnectionStatus();
    if (!hasInternet) {
      return this.sharedMethods.showToast(this.contentService.commonText?.noInternetConnection, 'long');
    }

    const alert = await this.alertController.create({
      header: this.commonText?.deletingYourAccount,
      message: new IonicSafeString(`
        <p>${ this.commonText?.deleteAccountPrompt }</p>
        <p style="color: var(--ikan_red_100); font-weight: bold;">${ this.commonText?.deleteActionIsPermanent }</p>
        <p>${ this.commonText?.accountDataWillBeDeleted }</p>
        <p><strong>${ this.commonText?.proceedWithAccountDeletion }</strong></p>
      `),
      cssClass: 'tuna-alert delete-account-alert',
      buttons: [
        {
          text: this.commonText?.cancel,
          role: 'cancel',
          cssClass: 'secondary',
        }, 
        {
          text: this.commonText?.delete,
          handler: async() => {
            await this.sharedMethods.showWaitLoader(this.commonText?.deletingAccountWaitMessage);
            // clear db, storage, and delete account
            await this.dbService.dropDatabase().then(async() => {
              const userId = this.userData?.id;
              await this.dbService.checkDbPlatformAndRunMigration();
              await this.apiService.delete('account/users', userId);
              await this.sharedMethods.clearPreferences();
            });

            this.router.navigate(['']);
            await this.sharedMethods.dismissLoader();
          }
        }
      ]
    });

    await alert.present();
  }

  handleBackButtonNavigation() {
    this.platform.backButton.subscribeWithPriority(-1, async () => {
      // store url as it changes during navigation
      const targetUrl = this.router.url;
      const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
      const dashboard = this.authService.getCurrentUserBaseUrlFromRole(user?.role);

      if (user  && targetUrl === `/${dashboard}` ||
        (!user && targetUrl === '/auth/login-method')
      ) {
        return App.minimizeApp();
      }
    });
  }

  async syncData() {
    await this.sharedMethods.showWaitLoader(this.commonText?.syncingData || 'Syncing data...');
    const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    if (user) {
     await this.syncService.syncData();
    }
    await this.sharedMethods.dismissLoader();
  }

  async setupDB() {
    await this.dbService.checkDbPlatformAndRunMigration();
    await this.syncData();
  }
}
