import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-wage-detail',
  templateUrl: './wage-detail.component.html',
  styleUrls: ['./wage-detail.component.scss'],
  standalone: false,
})
export class WageDetailComponent  implements OnInit {

  commonText: any;
  paymentsCommonText: any;
  wageDetails: any;
  currentLanguage = 'en-us';
  currentUser: any;

  constructor(
    public contentService: ContentService,
    public activatedRoute: ActivatedRoute,
    public sharedMethods: SharedmethodsService,
    public analyticsService: AnalyticsService,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params?.wageDetails) {
        this.wageDetails = JSON.parse(params.wageDetails);
      }
    });
  }

  async ngOnInit() {
    this.commonText = this.contentService?.commonText;
    const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
    this.paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);
    this.currentLanguage = this.contentService?.currentLanguage;
    this.currentUser = await this.sharedMethods.getUserData();

    const analyticsEventParams = this.sharedMethods.getAnalyticsEventParams();
    this.analyticsService.trackEvent(PageEventNames.viewWageDetails, analyticsEventParams);
  }

}
