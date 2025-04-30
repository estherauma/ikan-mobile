import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { StorageKeys } from 'src/app/shared/types/api-types';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  pageContent: any;
  pageTitle: any;
  showMenuButton = true;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public analytics: AnalyticsService
  ) { }

  async ngOnInit() {
    await this.pageSetup();
    this.analytics.trackEvent(pageEventNames.privacyPolicy, this.sharedMethods.analyticsEventParams);
  }

  async pageSetup() {
    const completedConsentForm = await this.sharedMethods.readDataFromStorage(StorageKeys.completedConsentForms);
    if (!completedConsentForm) {
      this.showMenuButton = false;
    }
    const content = this.contentService.getContentByPropertyName('app-privacy-policy');
    this.pageTitle = content?.pageTitle;
    this.pageContent = content?.pageContent;
  }

}
