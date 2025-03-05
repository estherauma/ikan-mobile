import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-indonesianagent',
  templateUrl: './indonesianagent.page.html',
  styleUrls: ['./indonesianagent.page.scss'],
})
export class IndonesianagentPage implements OnInit {

  sLists = [
    {title: 'Demand Letters'},
    {title: 'Recruits'},
    {
      title: 'Payments',
      icon: '/assets/icon/single_payment_blue.svg',
      url: '/payments',
    },
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
    public sharedMethods: SharedmethodsService,
    public analytics: AnalyticsService
  ) { }

  ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
    this.analytics.trackEvent(pageEventNames.viewIndonesianDashboard, this.sharedMethods.analyticsEventParams);
  }

  goToProfile() {
    this.router.navigate(['profile']);
  }
}
