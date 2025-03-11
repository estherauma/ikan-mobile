import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

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
    {
      title: 'Payments',
      icon: '/assets/icon/single_payment_blue.svg',
      url: '/payments',
    },
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
    public router: Router,
    public sharedMethods: SharedmethodsService,
    public analytics: AnalyticsService
  ) { }

  ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
    this.analytics.trackEvent(pageEventNames.viewTaiwaneseDashboard, this.sharedMethods.analyticsEventParams)
  }

  goToProfile() {
    this.router.navigate(['profile']);
  }
}
