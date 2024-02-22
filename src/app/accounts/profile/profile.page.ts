import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ProfilesDataService } from 'src/app/profiles/data/profiles-data.service';
import { BaseformPage } from 'src/app/shared/components/baseform/baseform.page';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { ProfileData } from 'src/app/shared/services/sync/types';
import { UserData, UserRole } from 'src/app/shared/types/api-types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage extends BaseformPage implements OnInit {
  pageTitle: string = 'My Profile'
  imageUrl: string = '';
  userData: UserData;
  profileData: ProfileData;
  regFormQtns: any;
  regGroup = {};
  regFormGroup: FormGroup;
  regPageText: any;
  isAgent: boolean = false;
  isViewProfile: boolean = false;
  viewData: any = {};

  constructor(
    public contentService: ContentService,
    public sharedMethods: SharedmethodsService,
    public profilesDataService: ProfilesDataService,
    public cdr: ChangeDetectorRef,
  ) {
    super(contentService);
  }

  async ngOnInit() {
    await this.pageSetup();
  }

  async pageSetup() {
    this.commonText = await this.contentService?.commonText;
    this.pageTitle = this.commonText?.myProfile || this.pageTitle;
    this.submitButtonText = this.commonText?.save;
    this.userData = await this.sharedMethods.getUserData();
    this.isAgent = this.userData?.role === UserRole.indonesianAgent || this.userData?.role === UserRole.taiwaneseAgent;
    const profData = await this.profilesDataService.getSingleProfile(this.userData?.email);
    if (profData?.id) {
      this.profileData = profData;
    }

    // This ensures that the profile view happens when some of the fields have values otherwise the view would be blank
    this.isViewProfile = (this.profileData?.id && this.profileData?.addressLine1 && this.profileData?.firstName && this.profileData?.email && this.profileData?.telephone) ? true : false;
    this.initializeForm();
  }

  initializeForm() {
    // Profile form
    const pageData = this.contentService.getContentByPropertyName('vo-agent-buyer-profile-form');
    this.pageText = this.sharedMethods.convertAdditionalTextToObj(pageData?.additionalText);
    this.formQuestions = pageData?.formQuestions;
    this.formQuestions?.forEach((entry) => {
      this.viewData[entry.key] = entry?.label;
      // this field will not be displayed
      if (entry.key === 'address') {
        return;
      }

      const value = this.profileData?.[entry.key] || this.userData?.[entry.key] || '';
      this.group[entry.key] = new FormControl(value, [Validators.required]);

      if (entry.key === 'email') {
        entry.questionType = 'email';
        this.group[entry.key] = new FormControl(value, [Validators.required, Validators.email]);
      }
      if (entry.key === 'lastName' || entry.key === 'addressLine2' || entry.key === 'addressLine3' || entry.key === 'postalCode' || entry.key === 'mobile') {
        this.group[entry.key] = new FormControl(value, []);
      }
    });
    this.pageFormGroup = new FormGroup(this.group);

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

      const value = this.profileData?.[entry.key] || '';
      this.regGroup[entry.key] = new FormControl(value, []);
    });
    this.regFormGroup = new FormGroup(this.regGroup);
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

  async onSubmitRegDetails(data) {
    this.sharedMethods.showLoader(this.regPageText?.savingRegDetails, 2000);
    const userData = await this.sharedMethods.getUserData();
    const now = this.sharedMethods.getCurrentDateTime();
    data.email = this.profileData?.email;
    data.updatedBy = userData.id;
    data.updatedAt = now;
    const profileExists = await this.profilesDataService.checkIfProfileExists(data.email);
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
}
