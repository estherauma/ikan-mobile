import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
    standalone: false
})
export class SignupPage extends BaseformPage implements OnInit {
  pageText: any;
  title='';
  description = '';
  submitButtonText = '';
  isLoading = false;
  fieldErrors = {}
  authCommonText: any;

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
    this.analytics.trackEvent(PageEventNames.signup, this.sharedMethods.analyticsEventParams);
  }

  pageSetup() {
    const authPageData = this.contentService.getContentByPropertyName('auth-common-text');
    this.authCommonText = this.sharedMethods.convertAdditionalTextToObj(authPageData?.additionalText);
    const pageData = this.contentService.getContentByPropertyName('signup');
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.title = this.pageText?.signupTitle;
    this.description = this.pageText?.signupDescription;
    this.submitButtonText = this.pageText?.submitButtonText;
    this.formQuestions.forEach((entry: any) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);

      // We are using the email key and not emailOrPhone for backward compatibility
      // with the old login page
      if (entry.key === 'email') {
        // TODO: add translation here
        entry.label = this.authCommonText?.emailOrPhoneLabel ?? entry.label;
        this.group[entry.key] = new FormControl('', [Validators.required, this.sharedMethods.emailOrPhoneValidator]);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);
    this.sharedMethods.trimFormValues(this.pageFormGroup);
  }

  async onSubmit(data: any) {
    this.isLoading = true;
    if (data?.password?.trim() !== data?.confirmPassword?.trim()) {
      this.sharedMethods.showToast(this.commonText?.passwordsDoNotMatch);
      this.isLoading = false;
      return;
    }
  
    this.sharedMethods?.showLoader(this.commonText?.submittingYourData);
    const dataToSubmit = this.sharedMethods.aggregateEmailOrPhoneValue(data, this.authCommonText);
    dataToSubmit.language = this.contentService?.currentLanguage || 'en-us';
    delete dataToSubmit.confirmPassword;
    if (!dataToSubmit?.role && !dataToSubmit?.userRole) {
      dataToSubmit.userRole = 'public';
    }
    this.apiService.post('accounts/register', dataToSubmit, true).subscribe(
      res => {
        this.sharedMethods.showToast(this.commonText?.accountCreatedSuccessfully);
        this.isLoading = false;
        this.sharedMethods?.hideLoader();
        this.router.navigate(['/auth/register-success']);
      },
      error => {
        this.isLoading = false;
        this.sharedMethods?.hideLoader();
        if (error.status === 400) {
          const validationErrors = error.error || error.message;
          this.fieldErrors = validationErrors;
          this.cdr.detectChanges();
        } else {
          this.sharedMethods.showToast(this.commonText?.somethingWentWrong);
        }
      }
    );
  }

  goBack() {
    this.router.navigate(['auth/login-method'], { replaceUrl: true });
  }
}
