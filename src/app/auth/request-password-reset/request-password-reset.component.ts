import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss'],
})
export class RequestPasswordResetComponent extends BaseformPage implements OnInit {
  title='';
  description = '';
  submitButtonText = '';
  pageText: any;
  isLoading = false;
  fieldErrors = {};
  nonFieldErrors = [];

  constructor(
    public contentService: ContentService,
    public router: Router,
    public apiService: ApiService,
    public sharedMethods: SharedmethodsService,
    public cdr: ChangeDetectorRef,
    public analytics: AnalyticsService
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.pageSetup();
    this.analytics.trackEvent(pageEventNames.requestPasswordReset, this.sharedMethods.analyticsEventParams);
  }

  pageSetup() {
    const pageData = this.contentService.getContentByPropertyName('requestpasswordresetform');
    this.formQuestions = pageData?.formQuestions;
    this.title = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.description = this.pageText?.resetPasswordDescription;
    this.submitButtonText = this.pageText?.submitButtonText;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required, Validators.email]);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  async onSubmit(data) {
    this.isLoading = true;
    this.sharedMethods?.showLoader(this.commonText?.submittingYourData);
    this.apiService.post('accounts/reset-password-request', data, true).subscribe(
      res => {
        this.sharedMethods.showToast(this.pageText?.resetRequestSent);
        this.isLoading = false;
        this.sharedMethods?.hideLoader();
        this.router.navigate(['/auth/password-reset'], { queryParams: { email: data?.email } });
      },
      error => {
        this.isLoading = false;
        this.sharedMethods?.hideLoader();
        if (error.status === 400) {
          const validationErrors = error.error || error.message;
          if (error.nonFieldErrors) {
            this.nonFieldErrors = error.nonFieldErrors;
          }
          this.fieldErrors = validationErrors;
          this.cdr.detectChanges();
        } else {
          this.sharedMethods.showToast(this.commonText?.somethingWentWrong);
        }
      }
    );
  }
}
