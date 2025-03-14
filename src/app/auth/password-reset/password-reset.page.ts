import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { pageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage extends BaseformPage implements OnInit {
  title='';
  description = '';
  submitButtonText = '';
  pageText: any;
  isLoading = false;
  fieldErrors = {};
  nonFieldErrors = [];
  email = '';

  constructor(
    public contentService: ContentService,
    public router: Router,
    public apiService: ApiService,
    public sharedMethods: SharedmethodsService,
    public cdr: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public analytics: AnalyticsService
  ) {
    super(contentService);
  }

  ngOnInit() {
    this.getEmail();
    this.commonText = this.contentService?.commonText;
    this.pageSetup();
    this.analytics.trackEvent(pageEventNames.passwordReset, this.sharedMethods.analyticsEventParams);
  }

  pageSetup() {
    const pageData = this.contentService.getContentByPropertyName('resetpasswordform');
    this.formQuestions = pageData.formQuestions;
    this.title = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.submitButtonText = this.pageText?.submitButtonText;
    this.description = this.pageText?.description;
    this.formQuestions.forEach((entry) => {
      this.group[entry.key] = new FormControl('', [Validators.required]);
      if (entry.key == 'email') {
        this.group[entry.key] = new FormControl(this.email, [Validators.required, Validators.email]);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  getEmail() {
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      if (queryParams && Object.keys(queryParams).length > 0) {
        this.email = queryParams?.email || '';
      }
    });
  }

  onSubmit(data) {
    this.isLoading = true;
    if (data?.password?.trim() !== data?.confirm_password?.trim()) {
      this.sharedMethods.showToast(this.commonText?.passwordsDoNotMatch);
      this.isLoading = false;
      return;
    }
  
    delete data.confirm_password;
    this.sharedMethods?.showLoader(this.commonText?.submittingYourData);
    this.apiService.post('accounts/reset-password', data, true).subscribe(
      res => {
        this.sharedMethods.showToast(this.pageText?.passwordResetProceedToLogin || 'Password was reset successfully. Please proceede to login');
        this.isLoading = false;
        this.sharedMethods?.hideLoader();
        this.router.navigate(['auth/password-reset-success']);
      },
      error => {
        this.isLoading = false;
        this.sharedMethods?.hideLoader();
        if (error.status === 400) {
          const validationErrors = error.error || error.message;
          this.fieldErrors = validationErrors;
          if (error.nonFieldErrors) {
            this.nonFieldErrors = error.nonFieldErrors;
          }
          this.cdr.detectChanges();
        } else {
          this.sharedMethods.showToast(this.commonText?.somethingWentWrong);
        }
      }
    );
  }

  goBack() {
    this.router.navigate(['auth/request-password-reset'], { replaceUrl: true });
  }
}
