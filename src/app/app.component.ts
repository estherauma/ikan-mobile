import { Component } from '@angular/core';
import { ContentService } from './shared/services/content/content.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' }
  ];

  constructor(
    public contentService: ContentService
  ) {
    this.contentService.fetchContent();
  }
}
