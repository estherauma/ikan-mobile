import { Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/services/content/content.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData } from '../shared/types/api-types';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';
import { AnalyticsService } from '../shared/services/analytics/analytics.service';
import { PageEventNames } from '../shared/services/analytics/event-names';
import { PushNotificationsService } from '../shared/services/push-notifications/push-notifications.service';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-language',
    templateUrl: './language.page.html',
    styleUrls: ['./language.page.scss'],
    standalone: false
})
export class LanguagePage implements OnInit {
  currentLanguage = 'en-us';
  availableLanguages: any[] = [];
  pageTitle: string = '';
  isLanguageSelected = false;
  commonText: any;

  constructor(
    public contentServ: ContentService,
    public router: Router,
    public authService: AuthService,
    public sharedMethods: SharedmethodsService,
    public analytics: AnalyticsService,
    public pushNotificationsService: PushNotificationsService,
    public platform: Platform,
  ) {
    this.getAvailableLanguages();
    this.sharedMethods.readDataFromStorage(StorageKeys.currentLanguage)
    .then((data) => {
      if (data != null) {
        this.currentLanguage = data;
      }
    });
  }

  async ngOnInit() {
    this.commonText = await this.contentServ.commonText;
    this.analytics.trackEvent(PageEventNames.changeLanguage, this.sharedMethods.analyticsEventParams);
  }

  getAvailableLanguages() {
    const data = this.contentServ.getAvailableLanguages();
    const {languages, pageTitle} = data;
    this.pageTitle = pageTitle;
    this.availableLanguages = languages;
    this.contentServ.compareContent();
  }

  changeLanguage(e: any) {
    this.currentLanguage = e?.detail?.value;
    this.isLanguageSelected = true;
  }

  async onSubmit() {
    await this.sharedMethods.saveDataToStorage(StorageKeys.currentLanguage, this.currentLanguage);
    await this.contentServ.updateCurrentLanguage();
    this.contentServ.contentObs.next(true);

    if (!this.platform.is('desktop') && !this.platform.is('mobileweb')) {
      await this.pushNotificationsService.setup();
    }
    const user: UserData = await this.sharedMethods.readDataFromStorage(StorageKeys.userData);
    this.router.navigate([this.authService.getCurrentUserBaseUrlFromRole(user?.role)], {replaceUrl: true});
  }
}
