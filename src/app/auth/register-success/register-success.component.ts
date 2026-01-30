import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-register-success',
    templateUrl: './register-success.component.html',
    styleUrls: ['./register-success.component.scss'],
    standalone: false
})
export class RegisterSuccessComponent  implements OnInit {
  pageText: any;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public analyitics: AnalyticsService,
    public router: Router,
  ) { }

  ngOnInit() {
    const pageData = this.contentService.getContentByPropertyName('signup-sucess');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.analyitics.trackEvent(PageEventNames.registerSuccess, this.sharedMethods.analyticsEventParams)
  }


  goBack() {
    this.router.navigate(['auth/login-method'], { replaceUrl: true });
  }
}
