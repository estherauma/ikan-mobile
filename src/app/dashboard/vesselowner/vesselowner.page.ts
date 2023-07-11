import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-vesselowner',
  templateUrl: './vesselowner.page.html',
  styleUrls: ['./vesselowner.page.scss'],
})
export class VesselownerPage implements OnInit {

  sLists = [
    {title: 'Work Orders'},
    {title: 'Vessels'},
    {title: 'Agents'},
    {title: 'Recruits'},
    {title: 'Contracts'},
    {title: 'Payments'}
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
  ) { }

  ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
  }


}
