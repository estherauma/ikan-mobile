import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-verify-phone-number',
  templateUrl: './verify-phone-number.component.html',
  styleUrls: ['./verify-phone-number.component.scss'],
})
export class VerifyPhoneNumberComponent  implements OnInit {

  submitButtonText = 'Get Code';
  countryOptions;
  btnDisabled = true;
  pageFormGroup: FormGroup;
  pageTitle: any;
  pageText: any;
  phoneNumberRegex = /\+?(\(\+?\d{1,3}\)([- ])?)?\d{1,}(?:[- ]\d+)*/;
  selectedCode = '';
  commonText: any;
  previousUrl = null;
  numberType = null;

  constructor(
    public router: Router,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public apiService: ApiService,
    public analytics: AnalyticsService,
    public http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams && Object.keys(queryParams).length > 0) {
        this.previousUrl = queryParams?.previousUrl ?? null;
        this.numberType = queryParams?.numberType ?? null;
      }
    });
  }

  async ngOnInit() {
    await this.pageSetup();
    this.analytics.trackEvent(PageEventNames.verifyPhoneNumber, this.sharedMethods.analyticsEventParams);
  }

  async pageSetup() {
    this.commonText = this.contentService.getCommonText();
    const pageData = this.contentService.getContentByPropertyName('verify-phone-number');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.submitButtonText = this.pageText?.getCode;
    this.pageTitle = pageData?.pageTitle;
    this.countryOptions = await this.getCountryOptions();

    const group: any = {};
    // add country code to the form group
    group.countryCode = new FormControl(this.selectedCode, [Validators.required]);
    // add phone number to the form group
    group.phoneNumber = new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberRegex)]);

    this.pageFormGroup = new FormGroup(group);
  }

  async getCountryOptions() {
    try {
      const res = await lastValueFrom(this.http.get<any>('assets/json/countries.json'));
      return res;
    } catch (error) {
      console.error('Error fetching country options', error);
      return [];
    }
  }

  goBack() {
    this.router.navigate([this.previousUrl], { replaceUrl: true });
  }

  onCountryCodeChange(event) {
    this.selectedCode = this.countryOptions.find((country) => country?.dial_code === event.detail.value)?.dial_code;
  }

  async onSubmit(formData) {
    await this.sharedMethods.showWaitLoader(this.commonText?.submittingYourData);
    try {
      const countryCode = formData.countryCode;
      const phoneNumber = formData.phoneNumber;
      const phoneNumberWithCode = `${countryCode}${phoneNumber}`.replace(/\s/g, '');
      const userData: UserData = await this.sharedMethods.getUserData();
      const userId = userData?.id;
      const data = {
        phoneNumber: phoneNumberWithCode,
        userId: userId ?? null,
        type: this.numberType,
        previousUrl: this.previousUrl,
      };

      const response: any = await lastValueFrom(this.apiService.post('accounts/verify-phone-number', data, true));
      if (response?.status && response?.status !== 'error') {
        await this.sharedMethods.dismissLoader();
        this.router.navigate(['auth/verify-code'], {replaceUrl: true, queryParams: data });
      } else {
        await this.sharedMethods.dismissLoader();
        this.sharedMethods.showToast(this.pageText?.errorGeneratingCode);
      }
    } catch (error) {
      console.error('Error in onSubmit', error);
      await this.sharedMethods.dismissLoader();
      this.sharedMethods.showToast(this.pageText?.errorGeneratingCode);
    }
  }
}
