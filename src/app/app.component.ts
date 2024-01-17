import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { ContentService } from './shared/services/content/content.service';
import { SharedmethodsService } from './shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData } from './shared/types/api-types';
import { PluginListenerHandle } from '@capacitor/core';
import { AuthService } from './shared/services/auth/auth.service';
import { DBService } from './shared/services/database/db.service';
import { PushNotificationsService } from './shared/services/push-notifications/push-notifications.service';
import { LocalNotificationsService } from './shared/services/local-notifications/local-notifications.service';
import { Subscription } from 'rxjs';
import { SyncService } from './shared/services/sync/sync.service';
import { TrainingVideoComponent } from './learninghub/training-video/training-video.component';
import { ModalController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [];
  networkListener: PluginListenerHandle;
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
  ) {
    this.authService.setUpAuthData();
    this.contentService.setUpAppData().then(() => {
      this.checkSetupComplete();
    });
    this.checkLoginStatus();
    this.pushNotifications.setup();
    this.localNotifications.scheduleNotifications();
    this.contentService.menuContent.subscribe((data) => {
      // TODO: move to prismic
      data.push({label: 'Sync', url: '/sync', icon: 'sync', roles:'all', enabled: true, position: 395});
      if (data && Object.keys(data).length > 0) {
        data?.sort((a, b) => a.position - b.position);
        this.appPages = this.authService.alterMenuBaseOnRole(data);
      }
    });
    this.contentService.watchContent().subscribe((resp) => {
      if (resp) {
        this.checkSetupComplete();
        this.contentService.saveSurveyCategories();
      }
    });
    this.setupDB();
    this.userEmail = this.authService.userData?.email;
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
    this.commonText = this.contentService.commonText;
    await this.contentService.saveSurveyCategories();
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

  checkLoginStatus() {
    this.sharedMethods.readDataFromStorage(StorageKeys.apiToken)
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
      this.authService.logOut();
      this.router.navigate(['']);
    } else if(this.appPages[index].url === '/sync') {
      await this.sharedMethods.showToast(this.contentService.commonText?.syncingData || 'Syncing data...', 'long');
      this.syncService.syncData();
    } else if (this.appPages[index].url === '/tfa-video') {
      await this.showTrainingVideo();
    } else {
      this.router.navigate([this.appPages[index].url]);
    }
  }

  async showTrainingVideo() {
    const modal = await this.modalController.create({
      component: TrainingVideoComponent,
      cssClass: 'tfa-training-video',
      // commented out because it's messing with the back button navigation
      // backdropDismiss: false,
    });
    modal.present();
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
    const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    if (user) {
     await this.syncService.syncData();
    }
  }

  async setupDB() {
    await this.dbService.checkDbPlatformAndRunMigration();
    await this.syncData();
  }
}
