import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ProfileData } from 'src/app/shared/services/sync/types';
import { UserData } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-profiles-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage extends BaseformPage implements OnInit {
  submitButtonText = 'Save';
  userData: UserData;
  profileData: ProfileData;
  isViewInfo: boolean = false;
  viewInfo: any = {};

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public profilesDataService: ProfilesDataService,
    public analytics: AnalyticsService
  ) {
    super(contentService);
  }

  async ngOnInit() {
    await this.pageSetup();
    this.analytics.trackEvent(PageEventNames.workerProfileinfo, this.sharedMethods.analyticsEventParams)
  }

  async pageSetup() {
    this.commonText = this.contentService.commonText;
    this.submitButtonText = this.commonText?.save;
    this.userData = await this.sharedMethods.getUserData();
    const profData = await this.profilesDataService.getSingleProfile(this.userData?.email);
    if (profData?.id) {
      this.profileData = profData;
    }
    // This ensures that the profile view happens when some of the fields have values otherwise the view would be blank
    this.isViewInfo = (this.profileData?.id && this.profileData?.addressLine1 && this.profileData?.firstName && this.profileData?.email && this.profileData?.mobile) ? true : false;
    this.initializeForm();
  }

  initializeForm() {
    const pageData = this.contentService.getContentByPropertyName('workerbudiinfo');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions?.forEach((entry) => {
      this.viewInfo[entry.key] = entry?.label;

      // this field will not be displayed
      if (entry.key === 'address') {
        return;
      }

      const validators = this.sharedMethods.getFormValidators(entry);
      const value = this.profileData?.[entry.key] || this.userData?.[entry.key] || '';
      this.group[entry.key] = new FormControl(value, validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
  }

  async onSubmit(data) {
    this.sharedMethods.showLoader(this.pageText?.savingProfile, 2000);
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    data.userRole = userData.role;
    data.updatedBy = userData.id;
    data.updatedAt = now;
    const profileExists = await this.profilesDataService.checkIfProfileExists(data.email);
    if (profileExists) {
      data = { ...this.profileData, ...data}
      const result = await this.profilesDataService.update(data);
      if (result?.rowsAffected > 0) {
        await this.pageSetup();
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.profileUpdateSuccess);
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.profileUpdateFailure);
      }
    } else {
      data.createdAt = now;
      data.createdBy = userData.id;
      const insertId = await this.profilesDataService.create(data);
      if (insertId) {
        await this.pageSetup();
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.profileCreateSuccess);
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.pageText?.profileCreateFailure);
      }
    }
  }

  editInfo() {
    this.isViewInfo = false;
  }

  getCountryValueTranslation(value) {
    if (!value) {
      return '';
    }
    return this.formQuestions.find((el) => el.key === 'country')?.options?.find((opt) => opt.value === value)?.label || '';
  }
}
