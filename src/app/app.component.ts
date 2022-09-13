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
  // TODO: Generate this from primisc to integrate localization
  public appPages = [
    { title: 'Work Orders', url: '/workorders/home', icon: 'bag-handle-outline' },
    { title: 'Logout', url: '/logout', icon: 'log-out-outline' },
    { title: 'Change Language', url: '/change-language', icon: 'language-outline' },
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
      //TODO: Use translated text from prismic
      this.sharedMethods.showLoader('Please login to proceed!');
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
