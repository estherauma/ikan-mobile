import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
// import { Network } from '@awesome-cordova-plugins/network/ngx';
import { ContentService } from './shared/services/content/content.service';
import { SharedmethodsService } from './shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from './shared/types/api-types';
import { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [];

  networkListener: PluginListenerHandle

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
  ) {
    this.contentService.setUpAppData();
    this.checkLoginStatus();
    this.contentService.menuContent.subscribe((data) => {
      this.appPages = data;
    });
  }

  async ngOnInit() {
    this.networkListener = await Network.addListener('networkStatusChange', status => {
      this.compareAppWithServerContents(status.connected)
    });

      const status = await Network.getStatus();
      this.compareAppWithServerContents(status.connected)
  }

  ngOnDestroy() {
    if(this.networkListener) this.networkListener.remove();
  }

  checkLoginStatus() {
    this.sharedMethods.readDataFromStorage(StorageKeys.apiToken)
      .then((value) => {
        if (value != null) {
          this.router.navigate(['workorders/home']);

        }
      });

  }

  compareAppWithServerContents(status:boolean){
    console.log("connected::", status)
    if(status){
      this.contentService.compareContent()
      return
    }
    console.log("no need to compare contents")
  }

  logOut() {
    Preferences.remove({ key: StorageKeys.apiToken });
    this.checkLoginStatus();
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
      Preferences.remove({ key: StorageKeys.apiToken });
      this.router.navigate(['']);
    } else {
      this.router.navigate([this.appPages[index].url], { replaceUrl: true });
    }
  }
}
