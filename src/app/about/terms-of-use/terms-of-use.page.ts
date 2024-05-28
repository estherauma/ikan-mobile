import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.page.html',
  styleUrls: ['./terms-of-use.page.scss'],
})
export class TermsOfUsePage implements OnInit {
  pageContent = '';
  pageTitle: any;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService, 
    public analytics: AnalyticsService
  ) { }

  ngOnInit() {
    this.pageSetup()
    this.analytics.trackEvent(pageEventNames.termsOfUse, this.sharedMethods.analyticsEventParams);
  }

  pageSetup() {
    const content = this.contentService.getContentByPropertyName('terms-of-use');
    this.pageTitle = content?.pageTitle;
    const pageContent = content?.pageContent[0];
    pageContent['description'].forEach((element) => {
      if (element?.paragraph !== undefined || element?.paragraph !== null) {
        this.pageContent += element?.paragraph;
        this.pageContent += '<br/>';
      }
     
    });
  }

}
