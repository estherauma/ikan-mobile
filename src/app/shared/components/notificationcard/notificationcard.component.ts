import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notificationcard',
  templateUrl: './notificationcard.component.html',
  styleUrls: ['./notificationcard.component.scss'],
})
export class NotificationcardComponent implements OnInit {
  @Input() statusContainer: 'skyblue-status-container' | 'gray-status-container' = 'skyblue-status-container';
  @Input() notification;
  @Input() titleColor: 'blue' | 'deep-blue' = 'deep-blue';

  constructor() { }

  ngOnInit() {
    if (this.notification.read) {
      this.statusContainer = 'skyblue-status-container';
    } else {
      this.statusContainer = 'gray-status-container';
    }
  }

}
