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
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { UserData } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
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

  constructor(
    public router: Router,
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public apiService: ApiService,
    public analytics: AnalyticsService,
    public http: HttpClient,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
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
    const pageData = this.contentService.getContentByPropertyName('verify-code');
    this.pageTitle = pageData?.pageTitle;
    this.pageText = this.sharedMethods?.convertAdditionalTextToObj(pageData?.additionalText);

    const group: any = {};
    // add inputs to the form group
    group['code-1'] = new FormControl('', [Validators.required]);
    group['code-2'] = new FormControl('', [Validators.required]);
    group['code-3'] = new FormControl('', [Validators.required]);
    group['code-4'] = new FormControl('', [Validators.required]);

    this.pageFormGroup = new FormGroup(group);
  }

  ionViewDidEnter() {
    this.inputs.first.setFocus();
  }

  goBack() {
    this.router.navigate(['auth/verify-phone-number'], { replaceUrl: true });
  }

  clickToResendCode() {}

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

  onSubmit(formData) {}
}
