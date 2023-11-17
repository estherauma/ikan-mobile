import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Preferences } from '@capacitor/preferences';
import { ContentService } from './shared/services/content/content.service';
import { SharedmethodsService } from './shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData, UserRole } from './shared/types/api-types';
import { PluginListenerHandle } from '@capacitor/core';
import { AuthService } from './shared/services/auth/auth.service';
import { DBService } from './shared/services/database/db.service';
import { PushNotificationsService } from './shared/services/push-notifications/push-notifications.service';
import { LocalNotificationsService } from './shared/services/local-notifications/local-notifications.service';
import { Subscription } from 'rxjs';
import { SyncService } from './shared/services/sync/sync.service';

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
  ) {
    this.authService.setUpAuthData();
    this.contentService.setUpAppData().then(() => {
      this.checkSetupComplete();
    });
    this.checkLoginStatus();
    this.pushNotifications.setup();
    this.localNotifications.scheduleNotifications();
    this.contentService.menuContent.subscribe((data) => {
      data.push({label: 'Sync', url: '/sync', icon: 'sync', role:'all', enabled: true, position: 399});
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
    this.dbService.checkDbPlatformAndRunMigration();
    this.userEmail = this.authService.userData?.email;
  }

  async ngOnInit() {
    const showStatusBar = async() => {
      await StatusBar.show();
    };
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
           
            this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(user.role)]);
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

  onClick(index) {
    if (this.appPages[index].url === '/logout') {
      this.authService.logOut();
      this.router.navigate(['']);
    } else if(this.appPages[index].url === '/sync') {
      this.syncService.syncData();
    }
     else {
      this.router.navigate([this.appPages[index].url], { replaceUrl: true });
    }
  }
}
