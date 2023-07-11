import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-taiwaneseagent',
  templateUrl: './taiwaneseagent.page.html',
  styleUrls: ['./taiwaneseagent.page.scss'],
})
export class TaiwaneseagentPage implements OnInit {

  sLists = [
    {title: 'Work Orders'},
    {title: 'Demand Letters'},
    {title: 'Recruits'},
    {title: 'Payments'},
    {title: 'Learning Hub'}
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
