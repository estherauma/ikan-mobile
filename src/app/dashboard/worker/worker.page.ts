import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications/push-notifications.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {

  sLists = [
    {title: 'Placement'},
    {title: 'My Document'},
    {title: 'To Do'},
    {title: 'Training'},
    {title: 'Payments'},
  ];

  constructor(
    public pushNotifications: PushNotificationsService,
  ) { }

  ngOnInit() {
    if (!this.pushNotifications.preventSecondNotificationPrompt) {
      this.pushNotifications.checkAndroidPNsPermissions();
    }
  }

}
