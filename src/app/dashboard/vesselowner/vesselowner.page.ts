import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-vesselowner',
  templateUrl: './vesselowner.page.html',
  styleUrls: ['./vesselowner.page.scss'],
})
export class VesselownerPage implements OnInit {

  sLists = [
    {title: 'Work Orders', icon: '/assets/icon/workorders_blue.svg', url: ''},
    {title: 'Vessels', icon: '/assets/icon/boat_with_blue_bg.svg',  url: ''},
    {title: 'Agents', icon: '/assets/icon/office.svg',  url: ''},
    {title: 'Recruits', icon: '/assets/icon/profile_info_blue.svg', url: ''},
    {title: 'Contracts', icon: '/assets/icon/offers.svg',  url: ''},
    {title: 'Payments', icon: '/assets/icon/single_payment_blue.svg',  url: ''},
  ];

  performanceData = {
    chartType: 'doughnut',
    title: 'Overall performace',
    datasets: [{
      label: '',
      data: [65, 59, 80]
    }]
  };

  constructor(
    public pushNotifications: PushNotificationsService,
    public contentService: ContentService,
  ) {
    let menuContent = this.contentService.getMenuContent();
    // for item in slists, update title with menuContent
    this.sLists.forEach((item) => {
      Object.entries(menuContent).forEach((x) => {
        if (x[1]['title'] === item.title) {
          item['title'] = x[1]['label'];
        }
      });

    });
   }

  ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
  }


}
