import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-vesselowner',
  templateUrl: './vesselowner.page.html',
  styleUrls: ['./vesselowner.page.scss'],
})
export class VesselownerPage implements OnInit {

  sLists = [
    // {title: 'Work Orders', icon: '/assets/icon/workorders_blue.svg', url: '/workorders/home'},
    {title: 'Vessels', icon: '/assets/icon/boat_with_blue_bg.svg',  url: '/vessels/home'},
    {title: 'Manning Agencies', icon: '/assets/icon/office.svg',  url: '/companies/home'},
    {title: 'Recruits', icon: '/assets/icon/profile_info_blue.svg', url: '/workers/home'},
    {title: 'Contracts', icon: '/assets/icon/offers.svg',  url: '/contracts/home'},
    {title: 'Payments', icon: '/assets/icon/single_payment_blue.svg',  url: '/payments/home'},
  ];

  performanceData: any = {
    chartType: 'doughnut',
    title: '',
    datasets: [{
      label: '',
      data: [65, 59, 80]
    }]
  };
  feedbackDashboardMessage: string = '';
  welcomeText: string = '';
  welcomeMessage: string = '';
  welcomeCardTitle: string = '';
  overalStat: string = '';
  stat1: string = '';
  stat2: string = '';
  stat3: string = '';
  name: string = '';
  menuContent: any;
  commonText: any;

  constructor(
    public pushNotifications: PushNotificationsService,
    public contentService: ContentService,
    public sharedmethods: SharedmethodsService,
    public router: Router,
    public cdr: ChangeDetectorRef,
    public analytics: AnalyticsService
  ) {
    this.menuContent = this.contentService.getMenuContent();
    this.setupPage();
    this.contentService.watchContent().subscribe(async(resp) => {
      if (resp) {
        this.commonText = this.contentService.commonText;
        this.menuContent = await this.contentService.getMenuContent();
        await this.setupPage();
      }
    });
   }

  async ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
    await this.setupPage();
    this.analytics.trackEvent(pageEventNames.viewVesselOwnerDashboard, this.sharedmethods.analyticsEventParams)
  }

  async setupPage() {
    await this.contentService.updateCurrentLanguage();
    this.menuContent = await this.contentService.getMenuContent();
    this.commonText = this.contentService.commonText;
    this.feedbackDashboardMessage = this.commonText?.fdbckLink;
    this.welcomeText = this.commonText?.fdbkWelcomeText;
    this.welcomeMessage = this.commonText?.fdbkWelcomMessage;
    this.welcomeCardTitle = this.commonText?.fdbkWelcomCardTitle;
    this.performanceData = {
      chartType: 'doughnut',
      title: this.welcomeCardTitle,
      datasets: [{
        label: '',
        data: [65, 59, 80]
      }]
    };
    
    // for item in slists, update title with menuContent
    this.sLists.forEach((item) => {
      Object.entries(this.menuContent).forEach((x) => {
        if (x[1]['url'] === item.url) {
          item['title'] = x[1]['label'];
        }
      });
    });

    this.overalStat = this.commonText?.fdbckOverallConditions;
    this.stat1 = this.commonText?.fdbckNotCompleted;
    this.stat2 = this.commonText?.fdbckAdditionalLearning;
    this.stat3 = this.commonText?.fdbckCoreTraining;

    // get user name
    const user = await this.sharedmethods.readDataFromStorage(StorageKeys.userData);
    this.name = (this.commonText?.hi || '') + ' ' + (user?.firstName || '');
  }

  goToProfile() {
    this.router.navigate(['profile']);
  }
}
