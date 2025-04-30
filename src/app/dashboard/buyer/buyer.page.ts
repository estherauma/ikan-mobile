import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.page.html',
  styleUrls: ['./buyer.page.scss'],
})
export class BuyerPage implements OnInit {

  performanceData = {
    chartType: 'doughnut',
    title: 'Overall performace',
    datasets: [{
      label: '',
      data: [65, 59, 80]
    }]
  };

  dashboardStats =  Array(5).fill({
    chartType: 'doughnut',
    title: 'Stats title',
    datasets: [{
      label: '',
      data: [65, 59, 80]
    }]
  });

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
    this.analytics.trackEvent(PageEventNames.viewBuyerDashboard, this.sharedMethods.analyticsEventParams);
  }

  generateNewReport() {}

  goToProfile() {
    this.router.navigate(['profile']);
  }
}
