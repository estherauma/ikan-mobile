import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { env } from 'src/environments/environment';

@Component({
  selector: 'app-how-to-signup',
  templateUrl: './how-to-signup.page.html',
  styleUrls: ['./how-to-signup.page.scss'],
})
export class HowToSignupPage implements OnInit {
  pageText: any;
  title = '';
  description = '';
  externalResourceLink = `${env.baseUrl}account/register`;

  constructor(
    public contentService: ContentService,
    public router: Router,
    public sharedMethods: SharedmethodsService,
    public analytics: AnalyticsService
  ) {
  }

  ngOnInit() {
    const pageData = this.contentService.getContentByPropertyName('howtosignup');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.title = pageData?.pageTitle;
    this.description = this.pageText?.description;
    this.analytics.trackEvent(pageEventNames.howToSignUp, this.sharedMethods.analyticsEventParams)
  }

  onCreateLogin() {
    this.router.navigate(['/auth/signup']);
  }

}
