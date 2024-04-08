import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';

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
  ) { }

  ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
  }

  generateNewReport() {}

  goToProfile() {
    this.router.navigate(['profile']);
  }
}
