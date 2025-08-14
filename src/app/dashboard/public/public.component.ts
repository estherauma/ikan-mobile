import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { LocalNotificationsService } from 'src/app/shared/services/local-notifications/local-notifications.service';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys, UserData } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent  implements OnInit {
  commonText: any;
  user: UserData;
  name = '';

  dashdoardItems = [
    {
      title: 'My Documents',
      icon: '/assets/icon/documents.svg',
      url: '/mydocuments'
    },
  ];

  constructor(
    public pushNotifications: PushNotificationsService,
    public contentService: ContentService,
    public sharedmethods: SharedmethodsService,
    public router: Router,
    public localNotifications: LocalNotificationsService,
    public analytics: AnalyticsService
  ) {
    this.contentService.watchContent().subscribe(async(resp) => {
      if (resp) {
        this.commonText = this.contentService.commonText;
        await this.setupPage();
      }
    });
  }

  async ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
    await this.setupPage();
    this.analytics.trackEvent(PageEventNames.viewPublicDashboard, this.sharedmethods.analyticsEventParams);
  }

  async setupPage() {
    await this.contentService.setUpAppData();
    this.commonText = this.contentService?.commonText;
    this.user = await this.sharedmethods.readDataFromStorage(StorageKeys.userData);
    this.name = `${this.commonText?.hi || ''} ${this.user?.firstName || ''}`;
    await this.contentService.updateCurrentLanguage();

    const menuContent = await this.contentService.getMenuContent();
    // for item in slists, update title with menuContent
    this.dashdoardItems.forEach((item) => {
      Object.entries(menuContent).forEach((x) => {
        if (x[1].url === item.url) {
          item.title = x[1].label;
        }
      });
    });
  }

  goToProfile() {
    this.router.navigate(['profile']);
  }
}
