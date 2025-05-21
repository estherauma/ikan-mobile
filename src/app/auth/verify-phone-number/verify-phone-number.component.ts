import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Component({
  selector: 'app-verify-phone-number',
  templateUrl: './verify-phone-number.component.html',
  styleUrls: ['./verify-phone-number.component.scss'],
})
export class VerifyPhoneNumberComponent  implements OnInit {

  // translate
  submitButtonText = 'Get Code';
  countryOptions;
  btnDisabled = true;
  pageFormGroup: FormGroup;
  pageTitle: any;
  pageText: any;
  phoneNumberRegex = /\+?(\(\+?\d{1,3}\)([- ])?)?\d{1,}(?:[- ]\d+)*/;
  selectedCode = '';
  commonText: any;

  constructor(
    public router: Router,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public apiServices: ApiService,
    public analytics: AnalyticsService,
    public http: HttpClient,
  ) { }

  async ngOnInit() {
    await this.pageSetup();
    this.analytics.trackEvent(PageEventNames.verifyPhoneNumber, this.sharedMethods.analyticsEventParams);
  }

  async pageSetup() {
    this.commonText = this.contentService.getCommonText();
    const pageData = this.contentService.getContentByPropertyName('verify-phone-number');
    this.pageTitle = pageData?.pageTitle;
    this.countryOptions = await this.getCountryOptions();

    const group: any = {};
    // add country code to the form group
    group.countryCode = new FormControl(this.selectedCode, [Validators.required]);
    // add phone number to the form group
    group.phoneNumber = new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberRegex)]);

    this.pageFormGroup = new FormGroup(group);
    console.log('Form Group', this.pageFormGroup);
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
    this.router.navigate(['login'], { replaceUrl: true });
  }

  onCountryCodeChange(event) {
    this.selectedCode = this.countryOptions.find((country) => country?.dial_code === event.detail.value)?.dial_code;
  }

  onSubmit(formData) {
    console.log('Form submitted', formData);
  }
}
