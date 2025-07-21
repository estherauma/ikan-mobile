import { Component, OnInit } from '@angular/core';
import { UserData } from '../shared/types/api-types';
import { Router } from '@angular/router';
import { AnalyticsService } from '../shared/services/analytics/analytics.service';
import { AuthService } from '../shared/services/auth/auth.service';
import { ContentService } from '../shared/services/content/content.service';
import { SharedmethodsService } from '../shared/services/sharedmethods/sharedmethods.service';
import { PageEventNames } from '../shared/services/analytics/event-names';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss'],
})
export class TutorialsComponent  implements OnInit {

  pageContent: any;
  commonText: any;
  user: UserData;
  audioUrl = '';

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public router: Router,
    public analtyicsService: AnalyticsService,
    public authService: AuthService,
  ) {}

  async ngOnInit() {
    await this.setup();
    this.audioUrl = this.pageContent?.welcomeAudio?.url || '';

    const eventParams = this.sharedMethods.getAnalyticsEventParams();
    const eventName = this.pageContent?.analyticsEventName || PageEventNames.viewAppTutotrials;
    // await this.analtyicsService.trackEvent(eventName, eventParams);
  }

  async setup() {
    this.commonText = await this.contentService?.commonText;
    console.log('commonText-----', this.commonText);
    this.pageContent = await this.contentService?.getContentByPropertyName('app-tutorials');
    console.log('pageContent-----', this.pageContent);
  }

  onSlideChange(e) {}

  skipTutorials() {}

  goToNextSlide() {}

  goToPreviousSlide() {}

  exitTutorials() {}

  goToTutorialDetail(tutorial) {}

  playAudio(url) {}
}
