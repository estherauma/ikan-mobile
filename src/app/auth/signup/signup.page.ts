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
    const pageData = this.contentService.getContentByPropertyName('signup');
    this.formQuestions = pageData.formQuestions;
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.title = this.pageText?.signupTitle;
    this.description = this.pageText?.signupDescription;
    this.submitButtonText = this.pageText?.submitButtonText;
    this.formQuestions.forEach((entry) => {
      const validators = this.sharedMethods.getFormValidators(entry);
      this.group[entry.key] = new FormControl('', validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  async onSubmit(data) {
    this.isLoading = true;
    if (data?.password?.trim() !== data?.confirmPassword?.trim()) {
      this.sharedMethods.showToast(this.commonText?.passwordsDoNotMatch);
      this.isLoading = false;
      return;
    }
  
    delete data.confirmPassword;
    this.sharedMethods?.showLoader(this.commonText?.submittingYourData);
    this.apiService.post('accounts/register', data, true).subscribe(
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
