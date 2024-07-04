import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  pageContent: any = '';
  pageTitle: any;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public analytics: AnalyticsService
  ) { }

  ngOnInit() {
    this.pageSetup();
    this.analytics.trackEvent(pageEventNames.privacyPolicy, this.sharedMethods.analyticsEventParams);
  }

  pageSetup() {
    const content = this.contentService.getContentByPropertyName('app-privacy-policy');
    this.pageTitle = content?.pageTitle;
    const pageContent = content?.pageContent[0];
    pageContent['description'].forEach((element) => {
      if (element?.paragraph !== undefined) {
        this.pageContent += '<br/>';
        this.pageContent += element?.paragraph;
      }
     
    });
    
  }

}
