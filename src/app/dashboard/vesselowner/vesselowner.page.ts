import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    {title: 'Agents', icon: '/assets/icon/office.svg',  url: '/agents/home'},
    {title: 'Recruits', icon: '/assets/icon/profile_info_blue.svg', url: '/workers/home'},
    {title: 'Contracts', icon: '/assets/icon/offers.svg',  url: '/contracts/home'},
    // {title: 'Payments', icon: '/assets/icon/single_payment_blue.svg',  url: '/payments/home'},
  ];

  performanceData: any = {
    chartType: 'doughnut',
    title: '',
    datasets: [{
      label: '',
      data: [65, 59, 80]
    }]
  };;
  feedbackDashboardMessage: string = '';
  welcomeText: string = '';
  welcomeMessage: string = '';
  welcomeCardTitle: string = '';
  overalStat: string = '';
  stat1: string = '';
  stat2: string = '';
  stat3: string = '';
  name: string = '';

  constructor(
    public pushNotifications: PushNotificationsService,
    public contentService: ContentService,
    public sharedmethods: SharedmethodsService,
    public router: Router,
  ) {
    let menuContent = this.contentService.getMenuContent();
    // wait for 5 seconds
    setTimeout(() => {
      this.contentService.updateCurrentLanguage();
      menuContent = this.contentService.getMenuContent();
      this.feedbackDashboardMessage = this.contentService.commonText?.fdbckLink;
      this.welcomeText = this.contentService.commonText?.fdbkWelcomeText;
      this.welcomeMessage = this.contentService.commonText?.fdbkWelcomMessage;
      this.welcomeCardTitle = this.contentService.commonText?.fdbkWelcomCardTitle;
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
        Object.entries(menuContent).forEach((x) => {
          if (x[1]['title'] === item.title) {
            item['title'] = x[1]['label'];
          }
        });
      });

      this.overalStat = this.contentService.commonText?.fdbckOverallConditions;
      this.stat1 = this.contentService.commonText?.fdbckNotCompleted;
      this.stat2 = this.contentService.commonText?.fdbckAdditionalLearning;
      this.stat3 = this.contentService.commonText?.fdbckCoreTraining;

    }, 1000);
    
   }

  async ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
    const user = await this.sharedmethods.readDataFromStorage(StorageKeys.userData);
    this.name = (this.contentService.commonText?.hi || '') + ' ' + (user?.firstName || '');
  }

  // For testing purposes
  // gooo() {
  //   this.router.navigate(['survey'])
  // }
}
