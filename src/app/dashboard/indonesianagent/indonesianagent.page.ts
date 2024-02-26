import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-indonesianagent',
  templateUrl: './indonesianagent.page.html',
  styleUrls: ['./indonesianagent.page.scss'],
})
export class IndonesianagentPage implements OnInit {

  sLists = [
    {title: 'Demand Letters'},
    {title: 'Recruits'},
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
    public router: Router,
  ) { }

  ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
  }

  goToProfile() {
    this.router.navigate(['profile']);
  }
}
