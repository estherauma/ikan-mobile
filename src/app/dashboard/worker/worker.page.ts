import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { LocalNotificationsService } from 'src/app/shared/services/local-notifications/local-notifications.service';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData, StorageKeys, UserRole } from 'src/app/shared/types/api-types';
import { env } from 'src/environments/environment';

@Component({
    selector: 'app-worker',
    templateUrl: './worker.page.html',
    styleUrls: ['./worker.page.scss'],
    standalone: false
})
export class WorkerPage implements OnInit {

  commonText: any;
  user: UserData;
  name = '';
  isProduction = env.production;
  showTriggerButton = false;
  sLists = [
    {
      title: 'My Documents',
      icon: '/assets/icon/documents.svg',
      url: '/mydocuments'
    },
    {
      title: 'Contracts',
      icon: '/assets/icon/offers.svg',
      url: '/contracts/home'
    },
    {
      title: 'Payments',
      icon: '/assets/icon/single_payment_blue.svg',
      url: '/payments'
    },
    // {title: 'Placement'},
    // {title: 'To Do'},
    // {title: 'Training'},
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
    this.analytics.trackEvent(PageEventNames.viewWorkerDashboard, this.sharedmethods.analyticsEventParams);
  }

  async setupPage() {
    await this.contentService.setUpAppData();
    this.commonText = this.contentService?.commonText;
    this.user = await this.sharedmethods.readDataFromStorage(StorageKeys.userData);
    this.name = `${this.commonText?.hi || ''} ${this.user?.firstName || ''}`;
    await this.contentService.updateCurrentLanguage();
    const menuContent = await this.contentService.getMenuContent();

    // for item in slists, update title with menuContent
    this.sLists.forEach((item) => {
      Object.entries(menuContent).forEach((x) => {
        if (x[1].url === item.url) {
          item.title = x[1].label;
        }
      });
    });

    const splitString = /\s*,\s*|\s*,\s*/; // split by comma and remove spaces
    const allowedTestUsers = this.commonText?.allowedTestUsers ? this.commonText?.allowedTestUsers.split(splitString) : [];
    if (!this.isProduction && allowedTestUsers.includes(this.user?.email)) {
      this.showTriggerButton = true;
    }
  }

  goToWorkerProfile() {
    this.router.navigate(['/worker/profile']);
  }

  // For testing purposes
  triggerNotifications() {
    this.localNotifications.triggerTestNotification(this.commonText);
  }
}
