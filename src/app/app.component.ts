import { Component } from '@angular/core';
import { ContentService } from './shared/services/content/content.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Work Orders', url: '/workorders-home', icon: 'bag-handle' },
  ];

  constructor(
    public contentService: ContentService
  ) {
    this.contentService.fetchContent();
  }
}
