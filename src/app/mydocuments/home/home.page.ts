import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

export type Segment = 'essentials' | 'myfiles';
@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements OnInit {
  commonText: any;
  docsCommonText: any;
  pageTitle: string = 'Documents';
  activeSegment: Segment = 'essentials';
  progressPercentage = 0;

  constructor(
    public router: Router,
    public contentService: ContentService,
    private sharedMethods: SharedmethodsService,
    public analyticsService: AnalyticsService,
  ) { }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageTitle = this.commonText?.documents;
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);

    const eventParams = await this.sharedMethods.getAnalyticsEventParams();
    await this.analyticsService.trackEvent(PageEventNames.viewMyDocuments, eventParams);
  }

  onSegmentChange(e) {
    this.activeSegment = e?.detail?.value;
  }

  onProgressDataChange(event) {
    this.progressPercentage = event.progress;
  }
}
