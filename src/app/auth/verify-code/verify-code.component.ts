import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { GlobalErrorHandlerService } from 'src/app/shared/services/error-handler/global-error-handler.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { SyncService } from 'src/app/shared/services/sync/sync.service';
import { UserData } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
  standalone: false
})
export class VerifyCodeComponent  implements OnInit {

  @ViewChildren(IonInput) inputs!: QueryList<IonInput>;

  submitButtonText = 'Verify';
  countryOptions;
  btnDisabled = true;
  pageFormGroup: FormGroup;
  pageTitle: any;
  pageText: any;
  commonText: any;
  params: any;
  userData: UserData;

  constructor(
    public router: Router,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public apiService: ApiService,
    public analytics: AnalyticsService,
    public http: HttpClient,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public syncService: SyncService,
    public globalErrorHandler: GlobalErrorHandlerService,
  ) {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams && Object.keys(queryParams).length > 0) {
        this.params = queryParams;
      }
    });
  }

  async ngOnInit() {
    await this.pageSetup();
    this.analytics.trackEvent(PageEventNames.verifyCode, this.sharedMethods.analyticsEventParams);
  }

  async pageSetup() {
    this.commonText = this.contentService.getCommonText();
    const pageData = this.contentService.getContentByPropertyName('verify-phone-number');
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods?.convertAdditionalTextToObj(pageData?.additionalText);
    this.submitButtonText = this.commonText?.verify;

    const group: any = {};
    // add inputs to the form group
    group['code-1'] = new FormControl('', [Validators.required]);
    group['code-2'] = new FormControl('', [Validators.required]);
    group['code-3'] = new FormControl('', [Validators.required]);
    group['code-4'] = new FormControl('', [Validators.required]);
    group['code-5'] = new FormControl('', [Validators.required]);
    group['code-6'] = new FormControl('', [Validators.required]);

    this.pageFormGroup = new FormGroup(group);
  }

  ionViewDidEnter() {
    this.inputs.first.setFocus();
  }

  goBack() {
    this.router.navigate(['auth/verify-phone-number'], { replaceUrl: true });
  }

  async clickToResendCode() {
    const data = {
      phoneNumber: this.params?.phoneNumber,
      userId: this.params?.userId,
      type: this.params?.type,
      locale: this.params?.locale || 'en',
      regenerate: true,
    };
    const res: any = await lastValueFrom(this.apiService.post('accounts/generate-otp/', data, true));
    if (res?.status) {
      await this.sharedMethods.showToast(this.pageText?.resendCodeSuccessMessage);
      // Clear the input fields
      this.inputs.forEach((input) => {
        input.value = '';
      });
      this.inputs.first.setFocus();
    } else {
      await this.sharedMethods.showToast(this.pageText?.resendCodeErrorMessage);
    }
  }

  onInputChange(event: Event, nextInput: IonInput) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && nextInput) {
      nextInput.setFocus();
    }
  }

  onBackspace(event: Event, prevInput: IonInput) {
    const input = event.target as HTMLInputElement;
    if (!input.value.length && prevInput) {
      prevInput.setFocus();
    }
  }

  async onSubmit(formData) {
    try {
      await this.sharedMethods.showWaitLoader(this.commonText?.submittingYourData);
      const code = Object.values(formData).join('');
      const data = {
        phoneNumber: this.params?.phoneNumber,
        userId: this.params?.userId,
        type: this.params?.type,
        otpCode: code,
      };
      const res: any = await lastValueFrom(this.apiService.post('accounts/verify-otp/', data, true));
      if (res?.status && res?.status !== 'error') {
        // sync api profile changes to device
        await this.syncService.fetchProfile();
        
        await this.sharedMethods.dismissLoader();
        this.sharedMethods.showToast(this.pageText?.verificationSuccessMessage);
        if (this.params?.previousUrl) {
          this.router.navigate([this.params?.previousUrl], { replaceUrl: true });
        } else {
          const userData: UserData = await this.sharedMethods.getUserData();
          const url = this.authService.getCurrentUserBaseUrlFromRole(userData?.role);
          this.router.navigate([url], { replaceUrl: true });
        }
      } else {
        await this.sharedMethods.dismissLoader();
        this.sharedMethods.showToast(this.pageText?.verificationErrorMessage);
      }
    } catch (error) {
      console.error('Error verifying phone number', error);
      this.globalErrorHandler.handleError(
        error,
        'Error verifying phone number.'
      );
      await this.sharedMethods.dismissLoader();
      this.sharedMethods.showToast(this.pageText?.verificationErrorMessage);
    }
  }
}
