import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ImageselectComponent } from 'src/app/shared/components/imageselect/imageselect.component';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { PageEventNames } from 'src/app/shared/services/analytics/event-names';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ProfileData } from 'src/app/shared/services/sync/types';
import { UserData, UserRole } from 'src/app/shared/types/api-types';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    standalone: false
})
export class ProfilePage extends BaseformPage implements OnInit {
  pageTitle = 'My Profile';
  imageUrl = '';
  userData: UserData;
  profileData: ProfileData;
  regFormQtns: any;
  regGroup = {};
  regFormGroup: FormGroup;
  regPageText: any;
  isAgent = false;
  isViewProfile = false;
  viewData: any = {};
  docsCommonText: any;
  mobileCtrlSubscription: any;
  telephoneCtrlSubscription: any;
  authCommonText: any;

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public profilesDataService: ProfilesDataService,
    public analytics: AnalyticsService,
    public modalController: ModalController,
    public router: Router,
  ) {
    super(contentService);
  }

  async ngOnInit() {
    await this.pageSetup();
    this.analytics.trackEvent(PageEventNames.profile, this.sharedMethods.analyticsEventParams);
    this.profilesDataService.getAll().subscribe(async(data) => {
      const user = await this.sharedMethods.getUserData();
      const userProfile: any = this.profilesDataService.getSingleProfile(user?.email, user?.mobile);
      if (userProfile?.profileImage) {
        this.imageUrl = userProfile?.profileImage;
      }
    });
  }

  ngOnDestroy() {
    this.mobileCtrlSubscription?.unsubscribe();
    this.telephoneCtrlSubscription?.unsubscribe();
  }

  async pageSetup() {
    this.commonText = await this.contentService?.commonText;
    this.authCommonText = await this.contentService.getAuthCommonText();
    const docsPageData = this.contentService.getContentByPropertyName('my-documents-common-text');
    this.docsCommonText = this.sharedMethods.convertAdditionalTextToObj(docsPageData?.additionalText);
    this.pageTitle = this.commonText?.myProfile || this.pageTitle;
    this.submitButtonText = this.commonText?.save;
    this.userData = await this.sharedMethods.getUserData();
    this.isAgent = this.userData?.role === UserRole.indonesianAgent || this.userData?.role === UserRole.taiwaneseAgent;
    const profData = await this.profilesDataService.getSingleProfile(this.userData?.email, this.userData?.mobile);
    if (profData?.id) {
      this.profileData = profData;
    }
    // This ensures that the profile view happens when some of the fields have values otherwise the view would be blank
    this.isViewProfile = (this.profileData?.id && this.profileData?.addressLine1 && this.profileData?.firstName && this.profileData?.email && this.profileData?.mobile && this.profileData?.telephone) ? true : false;
    this.initializeForm();
  }

  initializeForm() {
    // Profile form
    const pageData = this.contentService.getContentByPropertyName('vo-agent-buyer-profile-form');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions?.forEach((entry: any) => {
      this.viewData[entry.key] = entry?.label;

      // this field will not be displayed
      if (entry.key === 'address') {
        return;
      }

      const validators = this.sharedMethods.getFormValidators(entry);
      const value = this.profileData?.[entry.key] || this.userData?.[entry.key] || '';
      this.group[entry.key] = new FormControl(value, validators);
    });
    this.pageFormGroup = new FormGroup(this.group);
    // on phone number change, reset the verification status of both mobile and telephone
    if (this.profileData?.mobile || this.profileData?.telephone) {
      this.mobileCtrlSubscription =this.pageFormGroup.controls['mobile']?.valueChanges.subscribe((mobile) => {
        if (this.profileData?.mobile && (this.profileData?.mobile !== mobile)) {
          this.profileData.isMobileVerified = false;
        }
      });
      this.telephoneCtrlSubscription = this.pageFormGroup.controls['telephone']?.valueChanges.subscribe((telephone) => {
        if (this.profileData?.telephone && (this.profileData?.telephone !== telephone)) {
          this.profileData.isTelephoneVerified = false;
        }
      });
    }

    // Registration Details form
    const regPageData = this.contentService.getContentByPropertyName('registration-details-form');
    this.regPageText = this.sharedMethods.convertAdditionalTextToObj(regPageData?.additionalText);
    this.regFormQtns = regPageData?.formQuestions;
    this.regFormQtns?.forEach((entry) => {
      this.viewData[entry.key] = entry?.label;

      // this field will not be displayed
      if (entry.key === 'registrationDetails') {
        return;
      }

      const validators = this.sharedMethods.getFormValidators(entry);
      const value = this.profileData?.[entry.key] || '';
      this.regGroup[entry.key] = new FormControl(value, validators);
    });
    this.regFormGroup = new FormGroup(this.regGroup);
  }

  async onSubmit(data: any) {
    if(!data.email && !data.mobile) {
      return this.sharedMethods.showToast(this.authCommonText?.emailOrPhoneNumberRequired, 'long');
    }
    
    this.sharedMethods.showLoader(this.pageText?.savingProfile, 2000);
    const userData = await this.sharedMethods.getUserData();
    const now = new Date().toISOString();
    data.userRole = userData.role;
    data.updatedBy = userData.id;
    data.updatedAt = now;
    const profileExists = await this.profilesDataService.checkIfProfileExists(data.email, data.mobile);
    if (profileExists) {
      data = { ...this.profileData, ...data};
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

  async onSubmitRegDetails(data: any) {
    this.sharedMethods.showLoader(this.regPageText?.savingRegDetails, 2000);
    const userData = await this.sharedMethods.getUserData();
    const now = new Date().toISOString();
    data.email = this.profileData?.email;
    data.mobile = this.profileData?.mobile;
    data.updatedBy = userData.id;
    data.updatedAt = now;
    const profileExists = await this.profilesDataService.checkIfProfileExists(data.email, data.mobile);
    if (profileExists) {
      const result = await this.profilesDataService.updateProfileRegistrationDetails(data);
      if (result?.rowsAffected > 0) {
        await this.pageSetup();
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.regPageText?.regDetailsUpdateSuccess);
      } else {
        this.sharedMethods.hideLoader();
        this.sharedMethods.showToast(this.regPageText?.regDetailsUpdateFailure);
      }
    } else {
      this.sharedMethods.hideLoader();
      this.sharedMethods.showToast(this.regPageText?.updateProfileFirst);
    }
  }

  editProfile() {
    this.isViewProfile = false;
  }

  getCountryValueTranslation(value: any) {
    if (!value) {
      return '';
    }
    return this.formQuestions?.find((el) => el.key === 'country')?.options?.find((opt) => opt.value === value)?.label || '';
  }

  async changePhoto() {
    const modal = await this.modalController.create({
      component: ImageselectComponent,
      cssClass: 'notification-modal',
    });
    await modal.present();
    await modal.onDidDismiss().then(async(data) => {
      if (data?.data?.imageData && data?.data?.imageData.webPath) {
        this.imageUrl = data?.data?.imageData.webPath;
        const user = await this.sharedMethods.getUserData();
        const result = await this.profilesDataService.updateProfilesField(user?.email, user?.mobile, 'profile_image', this.imageUrl);
        if (!result) {
          console.error(`Failed to update profile image for ${user?.email || user?.mobile}`);
          this.sharedMethods.showToast(this.docsCommonText?.profilePictureUpdateFailure);
        }
      } else if (data?.role !== 'backdrop') {
        this.sharedMethods.showToast(this.docsCommonText?.profilePictureUpdateFailure);
      }
    });
  }

  async verifyPhoneNumber(type: string) {
    let phoneNumber = null;
    if (type === 'mobile' && this.profileData?.mobile) {
      phoneNumber = this.profileData?.mobile;
    } else if (type === 'telephone' && this.profileData?.telephone) {
      phoneNumber = this.profileData?.telephone;
    }

    const queryParams = {
      phoneNumber,
      numberType: type,
      previousUrl: this.router.url,
    };

    this.router.navigate(['auth/verify-phone-number'], { replaceUrl: true, queryParams });
  }
}
