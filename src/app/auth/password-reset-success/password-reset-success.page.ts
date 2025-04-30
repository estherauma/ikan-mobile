import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-password-reset-success',
  templateUrl: './password-reset-success.page.html',
  styleUrls: ['./password-reset-success.page.scss'],
})
export class PasswordResetSuccessPage implements OnInit {
  commonText: any;
  pageText: any;

  constructor(
    public router: Router,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public analytics: AnalyticsService
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    const pageData = this.contentService.getContentByPropertyName('reset-password-success');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.analytics.trackEvent(PageEventNames.passwordResetSuccess, this.sharedMethods.analyticsEventParams);
  }

  toLogin() {
    this.router.navigate(['login'], {replaceUrl: true});
  }

}
