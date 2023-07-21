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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [];
  networkListener: PluginListenerHandle;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public authService: AuthService,
    public dbService: DBService
  ) {
    this.authService.setUpAuthData();
    this.contentService.setUpAppData();
    this.checkLoginStatus();
    this.contentService.menuContent.subscribe((data) => {
      data.sort((a, b) => a.position - b.position);
      this.appPages = data;
    });

    this.dbService.checkDbPlatformAndRunMigration();
  }

  async ngOnInit() {
    const showStatusBar = async() => {
      await StatusBar.show();
    };
    await this.sharedMethods.addNetworkEventListener((network => {
        this.networkListener = network.networkListener;
        if (network.connected) {
          return this.contentService.compareContent();
        }
    }));
  }

  ngOnDestroy() {
    this.sharedMethods.removeNetworkEventListener(this.networkListener);
  }

  checkLoginStatus() {
    console.log('checkLoginStatus')
    this.sharedMethods.readDataFromStorage(StorageKeys.apiToken)
      .then(async(value) => {
        if (value != null) {
          const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
          const now = new Date().toUTCString();
          if ( this.authService.tokenExpiryDate < new Date(now)) {
            this.logOut();
          } else {
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
    } else {
      this.router.navigate([this.appPages[index].url], { replaceUrl: true });
    }
  }
}
