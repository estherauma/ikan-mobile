import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ContentService } from './shared/services/content/content.service';
import { SharedmethodsService } from './shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from './shared/types/api-types';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Work Orders', url: '/workorders-home', icon: 'bag-handle' },
  ];

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router
  ) {
    this.contentService.setUpAppData();
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.sharedMethods.readDataFromStorage(StorageKeys.apiToken)
    .then((value) => {
      console.log(value);
      if (value != null) {
        this.router.navigate(['workorders/home']);

      }
    });

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
      // ToDo: Use translated text from prismic
      this.sharedMethods.showLoader('Please login to proceed!');
    }
  }
}
